import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: any) {
  const comments = await prisma.commentLab7.findMany({
    where: { postId: Number(params.id) },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(comments);
}