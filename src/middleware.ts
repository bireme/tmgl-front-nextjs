import { canonicalPath } from "./helpers/seo";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const targetPath = canonicalPath(pathname);
  if (pathname !== targetPath) {
    const target = request.nextUrl.clone();
    target.pathname = targetPath;
    return NextResponse.redirect(target, 308);
  }

  const lang = request.nextUrl.searchParams.get("lang");

  if (lang) {
    //Caso o parametro esteja na URL ele vai para o cookie (DESATIVADO TEMPORARIAMENTE)
    const response = NextResponse.next();
    // response.cookies.set("lang", lang, {
    //   httpOnly: false,
    //   path: "/",
    // });
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Permissions-Policy", 'vibrate=(self); usermedia=*; microphone=(); payment=(); sync-xhr=(self "teste.tmgl.org")');
    return response;
  }
  // Removido o redirect com lang na URL, pois o cookie já é suficiente
  // e o parâmetro na URL estava sendo propagado para as requisições de API

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Permissions-Policy", 'vibrate=(self); usermedia=*; microphone=(); payment=(); sync-xhr=(self "teste.tmgl.org")');
  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|local).*)"],
};
