import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, getFollowers, getFollowing } = await request.json();
    
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
        },
        followers: getFollowers ? {
          select: {
            followerId: true,
            follower: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        } : false,
        following: getFollowing ? {
          select: {
            followingId: true,
            following: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        } : false
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response: any = {
      userId: user.id,
      followersCount: user._count.followers,
      followingCount: user._count.following
    };

    if (getFollowers && user.followers) {
      response.followers = user.followers.map(f => f.follower);
    }

    if (getFollowing && user.following) {
      response.following = user.following.map(f => f.following);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}