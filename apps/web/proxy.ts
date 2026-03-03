import { NextRequest, NextResponse } from "next/server";

const publicUrls = ["/"];
const authUrls = ["/auth/signin", "/auth/signup"];
// const privateUrls = ["/orgs"];

// 서버 사이드에서는 NEXT_PUBLIC_ 없이 내부 URL 사용 가능
const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenance && !pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;

  let res = NextResponse.next();

  // accessToken이 없지만 refreshToken이 있을 때 → 모든 페이지에서 서버단 refresh 시도
  if (!isAuthenticated && refreshToken) {
    try {
      const refreshRes = await fetch(`${INTERNAL_API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (refreshRes.ok) {
        const setCookieHeaders = refreshRes.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
          setCookieHeaders.forEach((cookie) => res.headers.append("set-cookie", cookie));
        }
        isAuthenticated = true;
      } else {
        res.cookies.delete("refreshToken");
      }
    } catch {
      res.cookies.delete("refreshToken");
    }
  }

  // 로그인 상태에서 auth/public 페이지 접근 → /orgs로
  // if (
  //   isAuthenticated &&
  //   (authUrls.some((url) => pathname.startsWith(url)) || publicUrls.some((url) => pathname === url))
  // ) {
  //   const redirectUrl = new URL("/orgs", req.url);
  //   const redirectRes = NextResponse.redirect(redirectUrl);
  //   // 이전 res에 저장된 set-cookie 헤더들을 리다이렉트 응답으로 복사
  //   res.headers.getSetCookie().forEach((cookie) => {
  //     redirectRes.headers.append("set-cookie", cookie);
  //   });
  //   return redirectRes;
  // }

  // 비로그인 상태에서 private 페이지 접근 → 로그인 페이지로
  // if (!isAuthenticated && privateUrls.some((url) => pathname.startsWith(url))) {
  //   const redirectUrl = new URL("/auth/signin", req.url);
  //   const redirectRes = NextResponse.redirect(redirectUrl);
  //   return redirectRes;
  // }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
