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
    console.log('Session:', session);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags, imageUrl } = await request.json();
    console.log('Post data:', { title, content, tags, imageUrl });

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
          password: '' // OAuth users don't need password
        }
      });
      console.log('Created new user:', user);
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

    console.log('Created post:', post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Try simple query first
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${posts.length} posts`);
    
    // Add default values for missing fields
    const postsWithDefaults = posts.map(post => ({
      ...post,
      tags: [],
      comments: [],
      likes: [],
      dislikes: [],
      followers: [],
      postFollowers: []
    }));

    return NextResponse.json(postsWithDefaults);
  } catch (error) {
    console.error("Database error:", error);
    
    // Return mock data if database fails
    return NextResponse.json([
      {
        id: '1',
        title: 'Welcome to Medium Clone',
        content: 'This is a sample post to test the application.',
        author: { name: 'Admin', email: 'admin@example.com' },
        tags: [],
        comments: [],
        likes: [],
        dislikes: [],
        followers: [],
        postFollowers: [],
        createdAt: new Date().toISOString()
      }
    ]);
  }
}
