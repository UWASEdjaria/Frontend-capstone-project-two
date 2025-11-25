import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const currentUserEmail = url.searchParams.get('currentUser');
    
    // Get followers count
    const followersCount = await prisma.follow.count({
      where: { followingId: id }
    });

    let isFollowing = false;
    
    if (currentUserEmail) {
      const currentUser = await prisma.user.findUnique({
        where: { email: currentUserEmail }
      });
      
      if (currentUser) {
        const followRecord = await prisma.follow.findFirst({
          where: {
            followerId: currentUser.id,
            followingId: id
          }
        });
        isFollowing = !!followRecord;
      }
    }

    return NextResponse.json({ 
      followers: followersCount,
      isFollowing
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
  }
}