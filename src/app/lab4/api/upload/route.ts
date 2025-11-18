import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/lab2/auth/[...nextauth]/route';

// POST /lab4/api/upload
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Mock upload - replace with Cloudinary or your preferred service
    const mockUrl = `https://via.placeholder.com/800x400?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}