import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Lab 6 API endpoint' });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ message: 'Lab 6 POST', data });
}