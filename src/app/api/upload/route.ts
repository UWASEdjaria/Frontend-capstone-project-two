import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Upload endpoint - use POST to upload files",
    methods: ["POST"],
    maxSize: "4MB",
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    console.log('File received:', file?.name, file?.size, file?.type);

    if (!file) {
      console.log('No file in request');
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size (max 4MB for Vercel)
    if (file.size > 4 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }, { status: 400 });
    }

    // Convert to base64 for Vercel compatibility
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log('File converted to base64 successfully');

    return NextResponse.json({ 
      message: "File uploaded successfully",
      url: dataUrl,
      filename: file.name
    });
  } catch (error) {
    console.error("Upload error details:", error);
    return NextResponse.json({ 
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}