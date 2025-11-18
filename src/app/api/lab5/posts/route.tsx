import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(req: Request) {
  const { search, tag } = Object.fromEntries(new URL(req.url).searchParams);
  const where: any = {};

  if (search) where.title = { contains: search as string, mode: "insensitive" };
  if (tag) where.tags = { some: { name: tag as string } };

  const posts = await prisma.post.findMany({
    where,
    include: { author: true, tags: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
