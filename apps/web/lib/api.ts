// lib/api.ts
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// refreshToken 쿠키로 새 accessToken 발급 요청 (동시 호출 중복 방지)
async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) return refreshPromise!;

  isRefreshing = true;
  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include", // refreshToken 쿠키 자동 첨부
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response | undefined> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include", // accessToken 쿠키 자동 첨부
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // accessToken 만료(401) → refresh 시도 후 원래 요청 재시도
  if (res.status === 401) {
    const refreshed = await tryRefresh();

    if (refreshed) {
      return fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    }

    // refresh도 실패 → 로그인 페이지로
    window.location.href = "/auth/signin";
    return undefined;
  }

  return res;
}
