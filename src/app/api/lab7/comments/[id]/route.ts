import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id }, 
    include: {
      author: true,
    },
  });

  return NextResponse.json(comments);
}
