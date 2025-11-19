import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const likes = await prisma.like.findMany({
    where: { postId: id },
    include: {
      user: true,
    },
  });
  
  return NextResponse.json({ 
    count: likes.length,
    likes: likes 
  });
}