import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/prisma-store";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM!;
const appUrl = process.env.NEXTAUTH_URL!;

if (!process.env.RESEND_API_KEY || !emailFrom || !appUrl) {
  console.error("Missing email environment variables:", {
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL
  });
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

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await prismaClient.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExp,
        },
      });

      // Send reset email
      try {
        console.log("Attempting to send password reset email to:", email);
        const emailResult = await resend.emails.send({
          from: emailFrom,
          to: email,
          subject: "Reset your password",
          html: `
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
                  <p style="color: #666; font-size: 16px;">We received a request to reset your password.</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                  <h2 style="color: white; margin: 0 0 15px 0;">Reset Your Password</h2>
                  <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">Click the button below to reset your password:</p>
                  <a href="${appUrl}/auth/reset-password?token=${resetToken}" 
                     style="display: inline-block; background-color: rgba(255,255,255,0.2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; border: 2px solid rgba(255,255,255,0.3);">
                    Reset Password
                  </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #888; font-size: 14px; margin: 0;">This reset link will expire in 1 hour.</p>
                  <p style="color: #888; font-size: 14px; margin: 5px 0 0 0;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
              </div>
            </body>
          `,
        });
        console.log("Password reset email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        return NextResponse.json(
          { message: "Failed to send reset email. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: "If an account with that email exists, we've sent you a password reset link." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}