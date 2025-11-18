import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      author: true,
      comments: {
        include: { author: true }
      },
      likes: true,
    },
  });
  
  return NextResponse.json(post);
}