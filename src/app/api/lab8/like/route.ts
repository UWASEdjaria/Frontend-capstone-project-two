import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { postId, userId } = await req.json();

  // check if user already liked
  const existing = await prisma.likeLab8.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    // unlike
    await prisma.likeLab8.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  // like
  await prisma.likeLab8.create({
    data: { postId, userId },
  });

  return NextResponse.json({ liked: true });
}