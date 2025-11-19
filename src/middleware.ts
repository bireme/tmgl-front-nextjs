import { GlobalConfigApi } from "./services/globalConfig/GlobalConfigApi";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirect } from "next/dist/server/api-utils";

export async function middleware(request: NextRequest) {
  // const fullUrl = request.nextUrl.pathname;
  // const _configApi = new GlobalConfigApi();
  // const data = await _configApi.getGlobalConfig();

  // const rule = data.acf.route.find((r) => r.url === fullUrl);
  // const rule = [
  //   {
  //     url: "/en",
  //     redirect: "https://teste.tmgl.org"
  //   }
  // ]

  // if (rule) {
  //   return NextResponse.redirect(rule.redirect);
  // }

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
