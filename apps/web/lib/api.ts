// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export function getToken() {
  return localStorage.getItem('accessToken')
}

export function removeToken() {
  localStorage.removeItem('accessToken')
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken()

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/auth/signin'
    return
  }

  return res.json()
}