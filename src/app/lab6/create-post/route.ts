import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { title, content } = await req.json();

  // Create a slug automatically from the title
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  // For testing, you can use a fixed authorId
  const authorId = "1"; // replace with actual user id

  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      authorId,
    },
  });

  return NextResponse.json(post);
}
