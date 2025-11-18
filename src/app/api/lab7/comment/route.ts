import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { postId, text } = await req.json();

  const comment = await prisma.commentLab7.create({
    data: { postId: Number(postId), text },
  });

  return NextResponse.json(comment);
}