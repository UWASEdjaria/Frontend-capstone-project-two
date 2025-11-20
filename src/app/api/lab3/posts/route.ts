import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        authorId: user.id,
      },
      include: {
        author: true
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
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