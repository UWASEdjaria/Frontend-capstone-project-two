import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { postId, content } = await request.json();
  
  const comment = await prisma.comment.create({
    data: {
      content,
      postId: postId,
      authorId: "1", // Default user
    },
    include: {
      author: true,
    },
  });
  
  return NextResponse.json(comment);
}