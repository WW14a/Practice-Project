import axios from "axios";

const Backend_URL = process.env.BACKEND_URL;

const api = axios.create({
  baseURL: Backend_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.split("=").slice(1).join("="))
    : null;
}

function setCookie(name, value, maxAge = 60 * 60 * 24 * 7) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function findTokens(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  if (payload.accessToken || payload.refreshToken) {
    return payload;
  }

  return findTokens(payload.data);
}

export function saveTokens(payload) {
  const tokens = findTokens(payload);

  if (tokens.accessToken) {
    setCookie("accessToken", tokens.accessToken);
  }
  if (tokens.refreshToken) {
    setCookie("refreshToken", tokens.refreshToken);
  }
}

export function clearTokens() {
  removeCookie("accessToken");
  removeCookie("refreshToken");
}

function handleAuthExpired() {
  clearTokens();
  window.dispatchEvent(new Event("auth:expired"));

  if (window.location.pathname !== "/auth/login") {
    window.location.assign("/auth/login");
  }
}

export async function login(credentials) {
  return await api.post("/auth/login", credentials, {
    _skipAuthRefresh: true,
  });
}

api.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalError = error.config;

    if (
      error.response?.status === 401 &&
      originalError &&
      !originalError._retry &&
      !originalError._skipAuthRefresh
    ) {
      originalError._retry = true;
      const refreshed = await refreshToken();

      if (refreshed) {
        const newAccessToken = getCookie("accessToken");
        originalError.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalError);
      }

      handleAuthExpired();
    }

    throw error;
  },
);

export async function refreshToken() {
  const refreshTokenValue = getCookie("refreshToken");

  if (!refreshTokenValue) {
    return false;
  }

  try {
    const response = await axios.post(
      `${Backend_URL}/auth/refresh`,
      { refreshToken: refreshTokenValue },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`,
        },
      },
    );

    if (
      response.data?.success === false ||
      !findTokens(response.data).accessToken
    ) {
      clearTokens();
      return false;
    }

    saveTokens(response.data);
    return true;
  } catch (error) {
    console.error(
      "Refresh token failed:",
      error.response?.data || error.message,
    );
    clearTokens();
    return false;
  }
}

export default api;
