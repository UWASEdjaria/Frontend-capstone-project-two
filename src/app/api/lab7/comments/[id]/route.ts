import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(params.id) },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return NextResponse.json(comments);
}