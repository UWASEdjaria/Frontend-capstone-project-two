import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const post = await prisma.post.create({ data: { title, content }});
  return NextResponse.json(post);
}