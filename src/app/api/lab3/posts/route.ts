import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { title, content } = await request.json();
  
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,//Converts the post title to a URL-friendly string
      excerpt,
      authorId: "1",
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