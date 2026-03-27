import { cookies } from "next/headers";
import sql from "./db";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("carmog_session")?.value;
  if (!token) return null;

  const sessions = await sql`
    SELECT s.user_id, u.* FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
    LIMIT 1
  `;

  return sessions.length > 0 ? sessions[0] : null;
}

export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
