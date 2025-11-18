import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: any) {
  const count = await prisma.likeLab8.count({
    where: { postId: Number(params.id) },
  });

  return NextResponse.json({ likes: count });
}