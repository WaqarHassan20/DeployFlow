import { NextAuthOptions } from "next-auth";
import { prismaClient } from "@repo/prisma-store";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { REMEMBER_ME_COOKIE } from "./server-cookie-utils";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const nextAuthUrl = process.env.NEXTAUTH_URL;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const databaseUrl = process.env.DATABASE_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (!nextAuthSecret || !databaseUrl) {
  throw new Error("Missing required environment variables: NEXTAUTH_SECRET or DATABASE_URL");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient), // configures the prisma adapter to use the prisma client instance
  providers: [
    ...(googleClientId && googleClientSecret ? [GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })] : []),
    ...(githubClientId && githubClientSecret ? [GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Check whether the user exists in the database
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prismaClient.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.password) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before signing in."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name || user.username || user.email,
        };
      },
    }),
  ],
  // Configure the session to use JWTs
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Default 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Default 7 days
  },
  secret: nextAuthSecret,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Debug OAuth sign in
      if (account?.provider === "google" || account?.provider === "github") {
        console.log("OAuth Sign In Attempt:", {
          provider: account.provider,
          user: user.email,
          accountId: account.providerAccountId
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Check rememberMe cookie and extend session
        const cookieStore = await cookies();
        const rememberMe =
          cookieStore.get(REMEMBER_ME_COOKIE)?.value === "true";
        if (rememberMe) {
          //Extend the expiry for remember me(90 days)
          const extendedExpiry =
            Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;
          token.exp = extendedExpiry;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        //@ts-ignore
        session.user.id = token.id as string;

        // Check if this an extended session
        const cookieStore = await cookies();
        const rememberMe =
          cookieStore.get(REMEMBER_ME_COOKIE)?.value === "true";

        if (rememberMe) {
          //update the session expiry
          session.expires = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString();
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Send welcoming email
      if (user.email && resend && emailFrom) {
        await resend.emails.send({
          from: emailFrom,
          to: user.email,
          subject: "Welcome to Novahost!",
          html: `
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Welcome ${user.name} to Novahost!</h1>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">Thanks for joining Novahost. We're excited to have you on board!</p>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">Feel free to explore our platform and discover the amazing features we offer.</p>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">If you have any questions, don't hesitate to contact our support team.</p>
              <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Get Started</a>
            </div>
          </body>
        `,
        });
      }
    },
    async signOut() {
      //Clear remember me cookie to sign out
      const cookieStore = await cookies();
      cookieStore.delete(REMEMBER_ME_COOKIE);
    },
  },
};
