import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      followersCount: user._count.followers,
      followingCount: user._count.following
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}