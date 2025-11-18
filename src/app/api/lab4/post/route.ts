import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1, // Default user
      },
      include: {
        author: true,
      },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: { author: true }
        },
        likes: {
          include: { user: true }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}