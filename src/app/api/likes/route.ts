import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { postId, userId, action } = await request.json();
    
    if (action === 'like') {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId }
      });
      
      if (existingLike) {
        await prisma.like.delete({
          where: { id: existingLike.id }
        });
        return NextResponse.json({ action: 'unliked' });
      } else {
        await prisma.like.create({
          data: { postId, userId }
        });
        return NextResponse.json({ action: 'liked' });
      }
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
  }
}