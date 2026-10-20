import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { safeNext } from "@/lib/next-path";
import { supabaseEnv } from "./env";

const PUBLIC_PATHS = ["/welcome", "/login", "/signup"];

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
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  if (path === "/") {
    return redirectTo(request, signedIn ? "/home" : "/welcome", response);
  }
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
