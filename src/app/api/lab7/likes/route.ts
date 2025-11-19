import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json();
    
    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    
    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like - create new like
      await prisma.like.create({
        data: { postId, userId },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}