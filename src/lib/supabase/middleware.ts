import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // 未登入 → 受保護頁面導向登入頁
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/lesson-generator") ||
     request.nextUrl.pathname.startsWith("/wukong-dashboard"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 未登入 → 擋住 Vision-AI API 直接存取
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/wukong-api") ||
     request.nextUrl.pathname.startsWith("/ws"))
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
