"use server";

import { prismaClient } from "@repo/prisma-store";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { z } from "zod";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schemas
const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const newPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Signup action
export async function signupAction(formData: FormData) {
  try {
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validatedData = signupSchema.parse(data);

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prismaClient.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        name: `${validatedData.username}`,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prismaClient.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires,
      },
    });

    // Send verification email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "Verify your email - NovaHost",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #10b981;">Welcome to NovaHost!</h1>
          <p>Hi ${user.username},</p>
          <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email Address
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}</p>
          <p>This link expires in 24 hours.</p>
          <p>Best regards,<br>The NovaHost Team</p>
        </div>
      `,
    });

    return {
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Password reset request
export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const validatedData = resetPasswordSchema.parse({ email });

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset link.",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing reset tokens for this user
    await prismaClient.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    // Create new reset token
    await prismaClient.verificationToken.create({
      data: {
        identifier: user.email,
        token: resetToken,
        expires,
      },
    });

    // Send password reset email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "Reset your password - NovaHost",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #10b981;">Reset Your Password</h1>
          <p>Hi ${user.username || "there"},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}</p>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The NovaHost Team</p>
        </div>
      `,
    });

    return {
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Set new password
export async function setNewPassword(formData: FormData) {
  try {
    const data = {
      // Added token to formData on reset-password page
      token: formData.get("token") as string,
      password: formData.get("password") as string,
    };

    const validatedData = newPasswordSchema.parse(data);

    // Find valid reset token
    const resetToken = await prismaClient.verificationToken.findUnique({
      where: { token: validatedData.token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        success: false,
        message: "Invalid or expired reset token.",
      };
    }

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email: resetToken.identifier },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update user password
    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the reset token
    await prismaClient.verificationToken.delete({
      where: { token: validatedData.token },
    });

    return {
      success: true,
      message:
        "Password updated successfully! You can now sign in with your new password.",
    };
  } catch (error) {
    console.error("Set new password error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Verify email
export async function verifyEmail(token: string) {
  try {
    // Find verification token
    const verificationToken = await prismaClient.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    // Update user as verified
    await prismaClient.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prismaClient.verificationToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Email verified successfully! You can now sign in.",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
