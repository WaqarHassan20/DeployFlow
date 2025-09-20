import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/prisma-store";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM!;
const appUrl = process.env.NEXTAUTH_URL!;

// Debug environment variables
console.log("Email Environment Check:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : "MISSING",
  EMAIL_FROM: emailFrom || "MISSING", 
  NEXTAUTH_URL: appUrl || "MISSING"
});

if (!process.env.RESEND_API_KEY || !emailFrom || !appUrl) {
  console.warn("Missing email environment variables. Email functionality will be disabled.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user without email verification
    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: email.split("@")[0], // Generate username from email
        emailVerified: null, // User needs to verify email first
      },
    });

    // Store verification token in the proper verification tokens table
    await prismaClient.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires,
      },
    });

    // Send verification email if email service is configured
    let emailSent = false;
    console.log("Email service check:", {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailFrom: !!emailFrom,
      hasAppUrl: !!appUrl,
      willSendEmail: !!(process.env.RESEND_API_KEY && emailFrom && appUrl)
    });

    if (process.env.RESEND_API_KEY && emailFrom && appUrl) {
      try {
        console.log("Attempting to send verification email to:", email);
        console.log("Using email from:", emailFrom);
        console.log("Verification URL will be:", `${appUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`);
        
        const emailPayload = {
          from: emailFrom,
          to: email,
          subject: "Verify your email address",
          html: `
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #333; margin-bottom: 10px;">Welcome to NovaHost!</h1>
                  <p style="color: #666; font-size: 16px;">Please verify your email address to complete your registration.</p>
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
                  <p style="color: #888; font-size: 14px; margin: 5px 0 0 0;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
              </div>
            </body>
          `,
        };

        console.log("Email payload prepared:", {
          from: emailPayload.from,
          to: emailPayload.to,
          subject: emailPayload.subject,
          htmlLength: emailPayload.html.length
        });

        const emailResult = await resend.emails.send(emailPayload);
        console.log("✅ Verification email sent successfully:", emailResult);
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send verification email - Full error:", emailError);
        console.error("Error details:", {
          name: emailError instanceof Error ? emailError.name : 'Unknown',
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        });
        // Continue with registration even if email fails
      }
    } else {
      console.warn("Email service not configured. Missing environment variables:", {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        EMAIL_FROM: !!emailFrom,
        NEXTAUTH_URL: !!appUrl
      });
    }

    return NextResponse.json(
      { 
        message: emailSent 
          ? "Account created successfully! Please check your email to verify your account before signing in."
          : "Account created successfully! Email verification is currently unavailable, but you can sign in.",
        requiresVerification: emailSent 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}