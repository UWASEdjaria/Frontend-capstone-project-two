import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const count = await prisma.followLab9.count({
    where: { followingId: Number(params.id) },
  });

  return NextResponse.json({ followers: count });
}