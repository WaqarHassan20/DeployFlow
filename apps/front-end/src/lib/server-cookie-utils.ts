import { cookies } from "next/headers"; // Created two files bcz
// import {cookies} from 'next/headers' will work only in server components

export const REMEMBER_ME_COOKIE = "remember-me";

// Sever-side cookie functions
export const getRememberMeCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(REMEMBER_ME_COOKIE)?.value === "true";
};

export const setRememberMeCookie = async (remember: boolean) => {
  const cookieStore = await cookies();
  if (remember) {
    cookieStore.set(REMEMBER_ME_COOKIE, "true", {
      maxAge: 90 * 24 * 60 * 60, // 90 days,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } else {
    cookieStore.delete(REMEMBER_ME_COOKIE);
  }
};
