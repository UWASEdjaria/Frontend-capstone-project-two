import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const likes = await prisma.like.findMany({
    where: { postId: parseInt(params.id) },
    include: {
      user: true,
    },
  });
  
  return NextResponse.json({ 
    count: likes.length,
    likes: likes 
  });
}