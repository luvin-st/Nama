import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
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
    return redirectTo(request, "/welcome", response);
  }
  if (signedIn && isPublic) {
    return redirectTo(request, "/home", response);
  }
  return response;
}

function redirectTo(request: NextRequest, pathname: string, from: NextResponse) {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  target.search = "";
  const res = NextResponse.redirect(target);
  from.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}
