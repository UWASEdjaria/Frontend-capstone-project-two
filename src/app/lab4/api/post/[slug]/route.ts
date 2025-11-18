import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../../../lib/prisma';
import { authOptions } from '@/app/api/lab2/auth/[...nextauth]/route';

// GET /lab4/api/post/[slug]
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true, email: true } } }
  });
  
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  return NextResponse.json(post);
}

// PUT /lab4/api/post/[slug]
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content, excerpt, published, imageUrl } = await req.json();
  
  const post = await prisma.post.update({
    where: { slug: params.slug },
    data: {
      title,
      content,
      excerpt,
      imageUrl,
      published,
      publishedAt: published ? new Date() : null
    }
  });
  
  return NextResponse.json(post);
}

// DELETE /lab4/api/post/[slug]
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.post.delete({ where: { slug: params.slug } });
  return NextResponse.json({ message: 'Post deleted' });
}