import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create safe filename
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filepath, buffer);
    console.log('File saved to:', filepath);

    return NextResponse.json({ 
      message: "File uploaded successfully",
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: `Upload failed: ${error}` }, { status: 500 });
  }
}