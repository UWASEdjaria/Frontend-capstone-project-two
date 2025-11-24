import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// PUT /api/lab2/profile - Update user profile
export async function PUT(req: Request) {
  const { email, name, bio } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { name }
    });

    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}