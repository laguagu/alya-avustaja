import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/_auth/sessions";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/alya", "/api"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const requestHeaders = new Headers(req.headers);

  // Set x-body-class header based on the route
  if (path === "/") {
    requestHeaders.set("x-body-class", "");
  } else {
    requestHeaders.set("x-body-class", "overflow-hidden");
  }

  if (
    process.env.NODE_ENV === "development" &&
    req.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Kevyt tarkistus: Tarkista vain, onko session-eväste olemassa
  const sessionCookie = req.cookies.get("session");

  if (
    !sessionCookie &&
    protectedRoutes.some((route) => path.startsWith(route))
  ) {
    // Jos ei ole sessiota ja reitti on suojattu, ohjaa kirjautumissivulle
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jos on sessio-eväste, jatka normaalia prosessia
  if (sessionCookie) {
    try {
      const session = await decrypt(sessionCookie.value);

      if (session?.userId) {
        // Jos käyttäjä on kirjautunut ja yrittää päästä julkiselle reitille, ohjaa /alya
        if (publicRoutes.includes(path)) {
          return NextResponse.redirect(new URL("/alya", req.url));
        }
      } else if (protectedRoutes.some((route) => path.startsWith(route))) {
        // Jos sessio on vanhentunut tai virheellinen ja reitti on suojattu
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Error decrypting session:", error);
      // Jos dekryptaus epäonnistuu, käsittele kuin sessiota ei olisi
      if (protectedRoutes.some((route) => path.startsWith(route))) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// export default async function middleware(req: NextRequest) {
//   // 1. Skip middleware in development
//   const development = process.env.NODE_ENV === "development";
//   if (development) {
//     return NextResponse.next();
//   }

//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     path.startsWith(route),
//   );
//   const isPublicRoute = publicRoutes.includes(path);

//   // 3. Decrypt the session from the cookie
//   const cookie = cookies().get("session")?.value;
//   const session = await decrypt(cookie);

//   // 4. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.userId) {
//     if (path.startsWith("/api/")) {
//       return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     return NextResponse.redirect(new URL("/", req.nextUrl));
//   }
//   // API-reittien suojaus
//   // Jos kyseessä on POST-pyyntö, varmista että käyttäjä on kirjautunut
//   // if (req.method === 'POST' && !session?.userId) {
//   //   return new NextResponse(
//   //     JSON.stringify({ message: 'Unauthorized for POST requests' }),
//   //     { status: 401, headers: { 'Content-Type': 'application/json' } }
//   //   );
//   // }

//   // 5. Redirect to /alya if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.userId &&
//     !req.nextUrl.pathname.startsWith("/alya")
//   ) {
//     return NextResponse.redirect(new URL("/alya", req.nextUrl));
//   }

//   return NextResponse.next();
// }

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
