import { GlobalConfigApi } from "./services/globalConfig/GlobalConfigApi";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const fullUrl = request.nextUrl.href;
  const _configApi = new GlobalConfigApi();
  const data = await _configApi.getGlobalConfig();
  console.log("middleware chamado");
  const rule = data.acf.route.find((r) => r.url === fullUrl);

  if (rule) {
    return NextResponse.redirect(rule.redirect);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next|local).*)"],
};
