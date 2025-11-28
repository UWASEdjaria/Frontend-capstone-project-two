import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { userEmail } = await request.json();
    
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Find current user
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get users that current user is following
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUser.id
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const followingUsers = following.map(f => f.following);
    
    return NextResponse.json({ 
      following: followingUsers
    });
  } catch (error) {
    console.error("Error fetching following users:", error);
    return NextResponse.json({ error: "Failed to fetch following users" }, { status: 500 });
  }
}