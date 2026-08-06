import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Run middleware only for /admin routes
  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check and update auth session
  const { supabaseResponse, supabase, user } = await updateSession(request);

  const isLoginPage = url.pathname === "/admin/login";

  if (!user) {
    if (!isLoginPage) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Query profile table to check administrative privileges
  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null };

  const isAuthorized = profile && (profile.role === "admin" || profile.role === "viewer");

  if (!isAuthorized) {
    // Explicitly sign out unauthorized sessions to prevent infinite loop checking
    await supabase.auth.signOut();
    if (!isLoginPage) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Redirect authenticated admin/viewers away from the login page
  if (isLoginPage) {
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
