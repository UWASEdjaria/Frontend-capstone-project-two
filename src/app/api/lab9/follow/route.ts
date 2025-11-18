import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { followerId, followingId } = await req.json();

  const exists = await prisma.followLab9.findFirst({
    where: { followerId, followingId },
  });

  if (exists) {
    await prisma.followLab9.delete({ where: { id: exists.id } });
    return NextResponse.json({ following: false });
  }

  await prisma.followLab9.create({
    data: { followerId, followingId },
  });

  return NextResponse.json({ following: true });
}