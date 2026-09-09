import { siteConfig } from "@/lib/site-config";

/** Client-side helper for the admin API (Bearer token in localStorage). */

const TOKEN_KEY = "alterique-admin-token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function unwrap(res, path) {
  if (res.status === 401 && !path.endsWith("/login")) {
    clearToken();
    const err = new Error("Session expired — please sign in again.");
    err.unauthorised = true;
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed.");
    err.status = res.status;
    // Some errors carry detail with them — a duplicate customer's id, say
    err.data = data;
    throw err;
  }
  return data;
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return unwrap(res, path);
}

/**
 * Multipart upload (journal pictures). No Content-Type header — the browser
 * sets it along with the multipart boundary.
 */
export async function apiUpload(path, formData) {
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });
  return unwrap(res, path);
}
