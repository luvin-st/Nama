import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { safeNext } from "@/lib/next-path";
import { supabaseEnv } from "./env";

const PUBLIC_PATHS = ["/welcome", "/login", "/signup"];
/** The login portal: open to everyone. Its pages send logged-in people to their own side. */
const PORTAL_PATHS = ["/portal"];
/** Restaurant and Nama staff apps: logged out → that side's login, then back here. */
const SIDE_APPS: { prefix: string; login: string }[] = [
  { prefix: "/restaurant", login: "/portal/restaurant" },
  { prefix: "/nama-staff", login: "/portal/staff" },
];

const under = (path: string, p: string) => path === p || path.startsWith(`${p}/`);

/** Refreshes the login session cookie and sends people to the right side of the app. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = supabaseEnv();

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  let signedIn = false;
  try {
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    signedIn = false;
  }

  const path = request.nextUrl.pathname;
  // NAMA now serves restaurant groups: the main link opens the login portal.
  // The earlier household app still lives at /welcome and /home, but nothing links to it.
  if (path === "/" || PORTAL_PATHS.some((p) => under(path, p))) return response;

  // Which side someone is on is checked by each app's layout (it needs the database).
  const app = SIDE_APPS.find((a) => under(path, a.prefix));
  if (app) {
    if (signedIn) return response;
    const next = safeNext(path + request.nextUrl.search);
    return redirectTo(request, app.login, response, next ? { next } : undefined);
  }

  const isPublic = PUBLIC_PATHS.some((p) => under(path, p));
  if (!signedIn && !isPublic) {
    // Remember where they were going (e.g. a scanned bin sticker) so login can send them back.
    const next = safeNext(path + request.nextUrl.search);
    return redirectTo(request, "/welcome", response, next ? { next } : undefined);
  }
  if (signedIn && isPublic) {
    return redirectTo(request, safeNext(request.nextUrl.searchParams.get("next")) ?? "/home", response);
  }
  return response;
}

function redirectTo(request: NextRequest, to: string, from: NextResponse, params?: Record<string, string>) {
  const target = new URL(to, request.nextUrl.origin);
  Object.entries(params ?? {}).forEach(([k, v]) => target.searchParams.set(k, v));
  const res = NextResponse.redirect(target);
  from.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}
