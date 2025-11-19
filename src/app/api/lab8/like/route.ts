import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { postId, type } = await request.json();
    
    // Convert postId to number for LikeLab8 table
    const numericPostId = parseInt(postId.replace(/\D/g, '')) || 1;
    
    // Generate small random user ID that fits in INT4
    const randomId = Math.floor(Math.random() * 10000) + 1;
    
    if (type === 'like') {
      await prisma.likeLab8.create({
        data: {
          postId: numericPostId,
          userId: randomId,
        },
      });
      return NextResponse.json({ success: true, type: 'like' });
    } else if (type === 'dislike') {
      await prisma.likeLab8.create({
        data: {
          postId: numericPostId,
          userId: -randomId,
        },
      });
      return NextResponse.json({ success: true, type: 'dislike' });
    }
    
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error handling like/dislike:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}