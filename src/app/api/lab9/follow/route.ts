import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { authorId } = await request.json();
    const followerId = 1; // Default user ID
    
    // Create follow entry
    await prisma.followLab9.create({
      data: {
        followerId: followerId + Date.now(),
        followingId: parseInt(authorId.replace(/\D/g, '')) || 1,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}