NovaHost is a modern hosting platform built with Next.js, TypeScript, and Prisma ORM, designed to provide secure authentication, project deployment, and management capabilities. The authentication system leverages NextAuth.js, supporting email/password login, Google and GitHub OAuth, email verification, password reset, and a “Remember Me” feature for extended sessions. The backend uses PostgreSQL for persistent data storage, with Prisma managing user, session, project, and deployment models. Email services are powered by Resend, enabling real-time verification and password recovery. The platform’s setup begins with installing all necessary dependencies, configuring environment variables for database, authentication, OAuth, and email services, and defining the authentication logic in the codebase. API routes connect the frontend to authentication handlers, while middleware protects sensitive routes and manages user access. The UI integrates session providers and custom pages for login, signup, and verification, ensuring a seamless user experience. Dashboard components display user information and project management tools, with secure logout and session handling. Database migrations keep the schema up-to-date, and thorough testing ensures reliability across all authentication flows. Collectively, these steps create a scalable, production-ready platform with robust security, type safety, and user management, making NovaHost an ideal solution for modern cloud hosting and project deployment needs.

- 🔐 Complete authentication system with NextAuth.js
- 🚀 Project deployment and management
- 📊 Analytics and monitoring
- 🌐 Custom domain management
- ⚡ Built with Next.js 15 and TypeScript

---

# Authentication Implementation with NextAuth.js

This guide covers the complete implementation of authentication in NovaHost using NextAuth.js, including email/password authentication, OAuth providers (Google & GitHub), email verification, password reset, and protected routes.

## Prerequisites

Before starting, ensure you have:

- Next.js 15+ project setup
- PostgreSQL database
- Prisma ORM configured
- Resend account for email services
- Google OAuth credentials
- GitHub OAuth credentials

## Step 1: Install Required Dependencies

```bash
cd apps/web
npm install next-auth @next-auth/prisma-adapter
npm install prisma @prisma/client
npm install bcryptjs @types/bcryptjs
npm install resend
npm install zod
npm install sonner  # For toast notifications
```

## Step 2: Create Environment Variables

Create `apps/web/.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/novahost"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Service (Resend)
RESEND_API_KEY="re_your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

## Step 3: Create Authentication Configuration

Create `apps/web/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@repo/prismadb/client"
import bcrypt from "bcryptjs"
import { cookies } from 'next/headers'

const REMEMBER_ME_COOKIE = 'remember-me'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Default 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Default 7 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        
        // Check remember me cookie and extend session
        const cookieStore = await cookies()
        const rememberMe = cookieStore.get(REMEMBER_ME_COOKIE)?.value === 'true'
        
        if (rememberMe) {
          // Extend token expiry for remember me (90 days)
          const extendedExpiry = Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
          token.exp = extendedExpiry
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        //@ts-ignore
        session.user.id = token.id as string
        
        // Check if this is an extended session
        const cookieStore = await cookies()
        const rememberMe = cookieStore.get(REMEMBER_ME_COOKIE)?.value === 'true'
        
        if (rememberMe) {
          // Update session expiry for remember me
          session.expires = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toISOString()
        }
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email)
    },
    async signOut() {
      // Clear remember me cookie on sign out
      const cookieStore = await cookies()
      cookieStore.delete(REMEMBER_ME_COOKIE)
    }
  }
}
```

## Step 4: Create API Routes for NextAuth

Create `apps/web/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Configure route as dynamic
export const dynamic = 'force-dynamic'
```

## Step 5: Set up Database Schema

Update `packages/prismaDB/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum DeploymentStatus {
  NOT_STARTED
  QUEUED
  IN_PROGRESS
  SUCCESS
  FAILED
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  firstName     String?
  lastName      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // NextAuth relations
  accounts      Account[]
  sessions      Session[]
  
  // Your app relations
  projects      Project[]
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deployments Deployment[]
}

model Deployment {
  id        String           @id @default(cuid())
  projectId String
  status    DeploymentStatus @default(NOT_STARTED)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

Run migrations:

```bash
cd packages/prismaDB
npx prisma migrate dev --name add-nextauth-fields
npx prisma generate
```

## Step 6: Create Authentication Context/Provider

Create `apps/web/components/providers/SessionProvider.tsx`:

```typescript
"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
  children: ReactNode
  session?: any
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
```

## Step 7: Update Root Layout

Update `apps/web/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NovaHost - Build and Deploy on the AI Cloud",
  description: "Deploy your projects in seconds with zero configuration.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Step 8: Create Custom Sign-in/Sign-up Logic

Create `apps/web/lib/auth-actions.ts`:

```typescript
"use server"

import { prisma } from "@repo/prismadb/client"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { z } from "zod"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schemas
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const newPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Signup action
export async function signupAction(formData: FormData) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Validate input
    const validatedData = signupSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return { 
        success: false, 
        message: "User with this email already exists" 
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
      }
    })

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires,
      }
    })

    // Send verification email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "Verify your email - NovaHost",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #10b981;">Welcome to NovaHost!</h1>
          <p>Hi ${user.firstName},</p>
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
      `
    })

    return { 
      success: true, 
      message: "Account created successfully! Please check your email to verify your account." 
    }

  } catch (error) {
    console.error("Signup error:", error)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors[0].message 
      }
    }
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}

// Password reset request
export async function requestPasswordReset(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const validatedData = resetPasswordSchema.parse({ email })

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      // Don't reveal if user exists or not
      return { 
        success: true, 
        message: "If an account with this email exists, you will receive a password reset link." 
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email }
    })

    // Create new reset token
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: resetToken,
        expires,
      }
    })

    // Send password reset email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "Reset your password - NovaHost",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #10b981;">Reset Your Password</h1>
          <p>Hi ${user.firstName || 'there'},</p>
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
      `
    })

    return { 
      success: true, 
      message: "If an account with this email exists, you will receive a password reset link." 
    }

  } catch (error) {
    console.error("Password reset error:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}

// Set new password
export async function setNewPassword(formData: FormData) {
  try {
    const data = {
      token: formData.get("token") as string,
      password: formData.get("password") as string,
    }

    const validatedData = newPasswordSchema.parse(data)

    // Find valid reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token: validatedData.token }
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return { 
        success: false, 
        message: "Invalid or expired reset token." 
      }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier }
    })

    if (!user) {
      return { 
        success: false, 
        message: "User not found." 
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Delete the reset token
    await prisma.verificationToken.delete({
      where: { token: validatedData.token }
    })

    return { 
      success: true, 
      message: "Password updated successfully! You can now sign in with your new password." 
    }

  } catch (error) {
    console.error("Set new password error:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}

// Verify email
export async function verifyEmail(token: string) {
  try {
    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { 
        success: false, 
        message: "Invalid or expired verification token." 
      }
    }

    // Update user as verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token }
    })

    return { 
      success: true, 
      message: "Email verified successfully! You can now sign in." 
    }

  } catch (error) {
    console.error("Email verification error:", error)
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    }
  }
}
```

## Step 9: Create Cookie Utilities for Remember Me

Create `apps/web/lib/cookie-utils.ts`:

```typescript
import { cookies } from 'next/headers'

export const REMEMBER_ME_COOKIE = 'remember-me'

// Server-side cookie functions
export const getRememberMeCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(REMEMBER_ME_COOKIE)?.value === 'true'
}

export const setRememberMeCookie = async (remember: boolean) => {
  const cookieStore = await cookies()
  if (remember) {
    cookieStore.set(REMEMBER_ME_COOKIE, 'true', {
      maxAge: 90 * 24 * 60 * 60, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  } else {
    cookieStore.delete(REMEMBER_ME_COOKIE)
  }
}

// Client-side cookie functions (for browser)
export const setClientRememberMeCookie = (remember: boolean) => {
  if (remember) {
    document.cookie = `${REMEMBER_ME_COOKIE}=true; Max-Age=${90 * 24 * 60 * 60}; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  } else {
    document.cookie = `${REMEMBER_ME_COOKIE}=; Max-Age=0; Path=/`
  }
}

export const getClientRememberMeCookie = () => {
  if (typeof document === 'undefined') return false
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${REMEMBER_ME_COOKIE}=`))
    ?.split('=')[1] === 'true'
}
```

## Step 10: Update Authentication Pages

### Login Page (`apps/web/app/auth/login/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { setClientRememberMeCookie, getClientRememberMeCookie } from '@/lib/cookie-utils';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || '/dashboard';

  // Load remember me preference from cookie on component mount
  useEffect(() => {
    const remembered = getClientRememberMeCookie();
    setRememberMe(remembered);
  }, []);

  const handleCredentialsSignIn = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Set cookie based on remember me checkbox
      setClientRememberMeCookie(rememberMe);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again!");
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  // Your JSX with proper form action={handleCredentialsSignIn} and OAuth buttons
}
```

### Signup Page (`apps/web/app/auth/signup/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/lib/auth-actions';
import { toast } from "sonner";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await signupAction(formData);
      if (result.success) {
        toast.success(result.message);
        // Optionally redirect to login
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, { 
        callbackUrl: '/dashboard',
        redirect: true 
      });
    } catch (error) {
      toast.error(`Failed to sign up with ${provider}`);
    }
  };

  // Your JSX with proper form action={handleSubmit} and OAuth buttons
}
```

### Email Verification Page (`apps/web/app/auth/verify-email/page.tsx`)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/lib/auth-actions';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verify();
  }, [token]);

  // Your JSX with loading, success, and error states
}
```

## Step 11: Create Protected Route Middleware

Create `apps/web/middleware.ts` (at root level):

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/api/projects',
    '/api/deployments',
  ]
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If it's a protected route and user is not authenticated
  if (isProtectedRoute && !token) {
    // Redirect to login with callback URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access auth pages
  if (token && (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup')
  )) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

## Step 12: Update Dashboard Components

### Dashboard Layout (`apps/web/components/dashboard/DashboardLayout.tsx`)

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### Dashboard Sidebar (`apps/web/components/dashboard/DashboardSidebar.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function DashboardSidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return session?.user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Your JSX with navigation, user profile dropdown, and logout functionality
}
```

## Step 13: Database Migration and Testing

### Run Database Migration

```bash
cd packages/prismaDB
npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
```

### Test Complete Authentication Flow

1. **Signup Flow**:
   - Go to `/auth/signup`
   - Fill form with real email
   - Check email for verification link
   - Click verification link
   - Should redirect to login

2. **Login Flow**:
   - Go to `/auth/login`
   - Login with credentials
   - Should redirect to dashboard

3. **OAuth Flow**:
   - Click Google/GitHub buttons
   - Should redirect to dashboard

4. **Password Reset Flow**:
   - Go to `/auth/reset-password`
   - Enter email → Get reset email
   - Click reset link → Set new password
   - Should redirect to login

5. **Protected Routes**:
   - Try accessing `/dashboard` without login
   - Should redirect to `/auth/login`

6. **Remember Me**:
   - Login with "Remember me" checked
   - Session should last 90 days

## Features Implemented

✅ **Email/Password Authentication**: Complete signup, login, logout  
✅ **OAuth Integration**: Google and GitHub authentication  
✅ **Email Verification**: Real email sending with Resend  
✅ **Password Reset**: Secure token-based password reset  
✅ **Remember Me**: Extended session duration  
✅ **Protected Routes**: Middleware-based route protection  
✅ **Session Management**: Server-side session handling  
✅ **Type Safety**: Full TypeScript integration  
✅ **Database Integration**: Prisma ORM with PostgreSQL  
✅ **Security**: Password hashing, CSRF protection, secure cookies  

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="super-secret-production-key"
GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"
GITHUB_CLIENT_ID="production-github-client-id"
GITHUB_CLIENT_SECRET="production-github-client-secret"
RESEND_API_KEY="production-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### Deployment Checklist

- [ ] Set production environment variables
- [ ] Run database migrations in production
- [ ] Configure OAuth redirect URLs for production domain
- [ ] Set up custom email domain in Resend
- [ ] Test all authentication flows in production
- [ ] Monitor error logs and performance

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**: Ensure OAuth provider redirect URLs match your domain
2. **Email Not Sending**: Check Resend API key and domain configuration
3. **Database Connection**: Verify DATABASE_URL and network connectivity
4. **Session Issues**: Check NEXTAUTH_SECRET and cookie settings
5. **Type Errors**: Run `npx prisma generate` after schema changes

### Debug Commands

```bash
# Check database connection
npx prisma db pull

# View database in browser
npx prisma studio

# Check migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

---

## Next Steps

With authentication complete, you can now:

1. **Build Project Deployment Features**: File upload, build processes, deployment management
2. **Add Analytics**: Track user activity, deployment metrics, performance monitoring
3. **Implement Team Features**: User roles, project sharing, collaboration tools
4. **Add Billing**: Subscription management, usage tracking, payment integration
5. **Enhance Security**: Rate limiting, audit logs, advanced authentication options

Your authentication system is now production-ready and secure! 🚀
