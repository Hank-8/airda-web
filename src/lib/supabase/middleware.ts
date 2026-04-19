import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const SUPABASE_URL = "https://apncpvvgvysgtjrvnxbw.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmNwdnZndnlzZ3RqcnZueGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NzMzNjIsImV4cCI6MjA5MjE0OTM2Mn0.5sElk1V01SZs1umKEO4lS-Or-0OnfOkeePw5MPlrvo4";

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未登入 → 教案產生器導向登入頁
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/lesson-generator")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 已登入 → 不要停留在登入/註冊頁
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/lesson-generator";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
