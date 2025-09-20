import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/prisma-store";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM!;
const appUrl = process.env.NEXTAUTH_URL!;

if (!process.env.RESEND_API_KEY || !emailFrom || !appUrl) {
  throw new Error("Missing required environment variables for email service");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update user with new verification token
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        resetToken: verificationToken,
        resetTokenExp: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    try {
      await resend.emails.send({
        from: emailFrom,
        to: email,
        subject: "Verify your email address",
        html: `
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin-bottom: 10px;">Email Verification</h1>
                <p style="color: #666; font-size: 16px;">Please verify your email address to continue using your account.</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                <h2 style="color: white; margin: 0 0 15px 0;">Verify Your Email</h2>
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">Click the button below to verify your email address:</p>
                <a href="${appUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}" 
                   style="display: inline-block; background-color: rgba(255,255,255,0.2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; border: 2px solid rgba(255,255,255,0.3);">
                  Verify Email Address
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #888; font-size: 14px; margin: 0;">This verification link will expire in 24 hours.</p>
                <p style="color: #888; font-size: 14px; margin: 5px 0 0 0;">If you didn't request this verification, you can safely ignore this email.</p>
              </div>
            </div>
          </body>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { message: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Verification email sent successfully. Please check your inbox." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}