import { type NextRequest, type MiddlewareConfig, NextResponse } from "next/server";

const publicRoutes = [
  { path: '/login', whenAutenticated: 'redirect' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE = '/login';

function isValidToken(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get("token")?.value;

  if (authToken) {
    if (!isValidToken(authToken)) {
      
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE;
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATION_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }


  if (authToken && publicRoute && publicRoute.whenAutenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/backoffice';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Filtra todas as rotas, exceto as que iniciam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt (arquivos de metadados)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};