import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "posts";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const searchTerm = query.toLowerCase();

    if (type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            {
              tags: {
                some: {
                  name: { contains: searchTerm, mode: "insensitive" }
                }
              }
            },
            {
              author: {
                name: { contains: searchTerm, mode: "insensitive" }
              }
            }
          ],
          published: true
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          tags: true,
          _count: { select: { likes: true, comments: true } }
        },
        orderBy: { createdAt: "desc" },
        take: limit
      });
      return NextResponse.json(posts);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}