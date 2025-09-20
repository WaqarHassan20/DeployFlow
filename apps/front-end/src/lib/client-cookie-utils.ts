export const REMEMBER_ME_COOKIE = "remember-me";
// Client side cookie functions
export const setClientRememberMeCookie = (remember: boolean) => {
  if (remember) {
    document.cookie = `${REMEMBER_ME_COOKIE}=true; Max-Age=${90 * 24 * 60 * 60}; Path=/; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
  } else {
    document.cookie = `${REMEMBER_ME_COOKIE}=; Max-Age=0; Path=/`;
  }
};

export const getClientRememberMeCookie = () => {
  if (typeof document === "undefined") {
    return false;
  }
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${REMEMBER_ME_COOKIE}=`))
      ?.split("=")[1] === "true"
  );
};
