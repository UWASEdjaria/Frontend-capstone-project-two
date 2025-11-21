import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create tags if they exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tagRecords: any[] = [];
    if (tags && tags.length > 0) {
      const tagPromises = tags.map(async (tagName: string) => {
        return await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
      });
      tagRecords = await Promise.all(tagPromises);
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug: slugify(title),
        content,
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        imageUrl: imageUrl || null,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: tagRecords.length > 0 ? {
          connect: tagRecords.map(tag => ({ id: tag.id }))
        } : undefined
      },
      include: {
        author: true,
        tags: true
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        likes: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
