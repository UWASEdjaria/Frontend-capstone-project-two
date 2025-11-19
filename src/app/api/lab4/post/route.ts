import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { title, content, tags, imageUrl } = await request.json();
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Generate excerpt from content
    const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        imageUrl: imageUrl || null,
        published: true,
        publishedAt: new Date(),
        authorId: "1",
        tags: tags ? {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        } : undefined
      },
      include: {
        author: true,
        tags: true
      },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        tags: true,
        comments: {
          include: { author: true }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      try {
        const numericPostId = parseInt(post.id.replace(/\D/g, '')) || 1;
        const allLikes = await prisma.likeLab8.findMany({
          where: { postId: numericPostId }
        });
        
        const likes = allLikes.filter(like => like.userId > 0);
        const dislikes = allLikes.filter(like => like.userId < 0);
        
        return {
          ...post,
          likes,
          dislikes
        };
      } catch (error) {
        return {
          ...post,
          likes: [],
          dislikes: []
        };
      }
    }));
    
    return NextResponse.json(postsWithCounts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}