import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// DELETE /api/lab2/delete-user - Delete user from database
export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Delete user from database
    await prisma.user.delete({
      where: { email }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}