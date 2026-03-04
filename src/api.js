// src/api.js — thin API wrapper

const BASE = "/api";

const req = async (method, path, body, token) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  login: (email, password) => req("POST", "/login", { email, password }),
  me: (token) => req("GET", "/me", null, token),
  invite: (token, body) => req("POST", "/invite", body, token),
  getInvite: (inviteToken) => req("GET", `/accept-invite?token=${inviteToken}`),
  acceptInvite: (inviteToken, password, name) =>
    req("POST", "/accept-invite", { token: inviteToken, password, name }),
};
