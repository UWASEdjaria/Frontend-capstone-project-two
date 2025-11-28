import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { content, postId, authorId } = await request.json();
    console.log('Creating comment:', { content, postId, authorId });
    
    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email: authorId }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: authorId,
          name: authorId.split('@')[0],
          password: ''
        }
      });
    }
    
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      },
    });
    
    console.log('Created comment:', comment);
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: postId! },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json([], { status: 500 });
  }
}