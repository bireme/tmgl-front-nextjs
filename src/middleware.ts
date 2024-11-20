import { GlobalConfigApi } from "./services/globalConfig/GlobalConfigApi";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const fullUrl = request.nextUrl.pathname;
  const _configApi = new GlobalConfigApi();
  const data = await _configApi.getGlobalConfig();

  const rule = data.acf.route.find((r) => r.url === fullUrl);
  if (rule) {
    return NextResponse.redirect(rule.redirect);
  }

  const lang = request.nextUrl.searchParams.get("lang");

  if (lang) {
    //Caso o parametro esteja na URL ele vai para o cookie
    const response = NextResponse.next();
    response.cookies.set("lang", lang, {
      httpOnly: false,
      path: "/",
    });
    return response;
  } else {
    //Caso não tenha parametro na url mas tenha no cookie vamos verificar o cookie
    const langFromCookie = request.cookies.get("lang")?.value;
    const fullUrl = request.nextUrl.toString();
    //Caso exista parametro no cookie e ele não en que é o padrão, também verifico se não são rotas externas ou de api
    //Se a condição for atendida significa que o usuário veio de uma página traduzida então ele vai querer continuar vendo conteúdo traduzido.
    if (
      langFromCookie != "en" &&
      (fullUrl.includes(
        process.env.BASE_URL ? process.env.BASE_URL : "http://localhost:3000"
      ) ||
        fullUrl.includes("http://localhost:3000")) &&
      !fullUrl.includes("api") &&
      !fullUrl.includes("customRoute")
    ) {
      const url = request.nextUrl.clone();
      if (langFromCookie) {
        url.searchParams.set("lang", langFromCookie);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next|local).*)"],
};
