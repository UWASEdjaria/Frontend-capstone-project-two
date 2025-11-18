import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../../lib/prisma';
import { authOptions } from '@/app/api/lab2/auth/[...nextauth]/route';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// GET /lab4/api/post
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { publishedAt: 'desc' }
  });
  return NextResponse.json(posts);
}

// POST /lab4/api/post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { title, content, excerpt, published = false, imageUrl } = await req.json();
  const slug = generateSlug(title);
  
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      published,
      publishedAt: published ? new Date() : null,
      author: { connect: { email: session.user?.email! } }
    }
  });
  return NextResponse.json(post, { status: 201 });
}