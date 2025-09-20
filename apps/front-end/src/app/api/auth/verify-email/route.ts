import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/prisma-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prismaClient.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Find user with this email
    const user = await prismaClient.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Verify the email
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the verification token
    await prismaClient.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { 
        message: "Email verified successfully. You can now sign in to your account." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}