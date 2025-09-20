# NextAuth.js Integration Guide

This guide explains how to integrate NextAuth.js with your Prisma schema for authentication, including sign in, sign up, forgot password, and OAuth with GitHub and Gmail.

---

## 1. Install Dependencies

In your Next.js app (e.g., `/apps/web`):

```bash
bun add next-auth @prisma/client
bunx prisma generate
```

---

## 2. Configure NextAuth.js

Create `/pages/api/auth/[...nextauth].ts` (or `/app/api/auth/[...nextauth]/route.ts` for App Router):

```ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Implement your own user lookup and password check here
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password === credentials.password) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup",
    forgotPassword: "/auth/forgot-password", // Custom page
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
```

---

## 3. Forgot Password Flow

- Create a custom page `/auth/forgot-password`.
- Use the `VerificationToken` model for password reset tokens.
- Send email with reset link (use nodemailer or similar).
- On reset, update the user's password in the database.

---

## 4. Environment Variables

Add these to your `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## 5. Usage Example

- Use `useSession()` from `next-auth/react` in your components.
- Protect pages with `getServerSession` or `useSession`.
- Use `signIn`, `signOut` methods for authentication actions.

---

## 6. How to Add NextAuth.js in Future Projects

1. Add NextAuth.js and Prisma dependencies.
2. Set up your Prisma schema with User, Account, Session, VerificationToken models.
3. Create the NextAuth API route and configure providers.
4. Add environment variables for OAuth and database.
5. Implement custom pages for sign in, sign up, forgot password.
6. Use the Prisma Adapter for NextAuth.js.
7. Test authentication flows (OAuth, credentials, password reset).

---

## 7. References
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Next.js App Router Auth](https://next-auth.js.org/getting-started/example)
- [Custom Credentials Provider](https://next-auth.js.org/providers/credentials)
- [Password Reset Example](https://github.com/nextauthjs/next-auth-example)

---

## 8. Prisma Schema Mapping

Your schema is already compatible with NextAuth.js. The models `User`, `Account`, `Session`, and `VerificationToken` are mapped as required.

---

## 9. Security Notes
- Always hash passwords before storing (use bcrypt or argon2).
- Never store plain text passwords in production.
- Use HTTPS and secure cookies in production.

---

## 10. Troubleshooting
- If you change your schema, run `bunx prisma migrate dev` and `bunx prisma generate`.
- Check environment variables for typos.
- Review NextAuth.js logs for errors.

---
