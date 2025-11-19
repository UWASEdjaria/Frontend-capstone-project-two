import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { title, content } = await request.json();
  
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: 1,
    },
  });
  
  return NextResponse.json(post);
}

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
      likes: {
        include: {
          user: true,
        },
      },
    },
  });
  
  return NextResponse.json(posts);
}