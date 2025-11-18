import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { postId } = await request.json();
  const userId = 1; // Default user
  
  // Check if already liked
  const existing = await prisma.like.findFirst({
    where: {
      postId: parseInt(postId),
      userId: userId,
    },
  });
  
  if (existing) {
    // Unlike
    await prisma.like.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ liked: false });
  } else {
    // Like
    await prisma.like.create({
      data: {
        postId: parseInt(postId),
        userId: userId,
      },
    });
    return NextResponse.json({ liked: true });
  }
}