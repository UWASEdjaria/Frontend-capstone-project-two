import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { currentUserEmail, targetUserId } = await request.json();
    
    if (!currentUserEmail || !targetUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find current user
    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: targetUserId
      }
    });

    let isFollowing: boolean;
    
    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      });
      isFollowing = false;
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUserId
        }
      });
      isFollowing = true;
    }

    // Get updated followers count
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId }
    });
    
    return NextResponse.json({ 
      success: true, 
      isFollowing,
      followersCount
    });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}