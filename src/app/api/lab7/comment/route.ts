import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { postId, content } = await request.json();
  
  const comment = await prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      authorId: 1, // Default user
    },
    include: {
      author: true,
    },
  });
  
  return NextResponse.json(comment);
}