import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({ 
      userExists: true, 
      passwordValid: isValid,
      userId: user.id,
      userName: user.name 
    });
  } catch (error) {
    console.error("Test auth error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}