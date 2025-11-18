import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const { title, content } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: (decoded as any).id,
      },
    });

    return NextResponse.json({ message: "Post created", post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
