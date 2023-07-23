import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server';

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname

        // check pathname & protect routes
        // getToken() automatically use the next-auth secret key from .env
        // to decrypt the jwt token (req)
        const isAuth = await getToken( {req} );
        const isLoginPage = pathname.startsWith("/login");

        // sensitive route (dashboard - user must be logged in)
        const sensitiveRoutes = ["/dashboard"];

        // return true if the route in sensitiveRoutes startswith /dashboard
        const isAccessSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route));

        // check if user is accessing login page
        if (isLoginPage) {
            // check if the user is authenticated
            if (isAuth) {
                // the user should be able to access the login page
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // if user is not authenticated, allow the user to access the login page
            // tell middleware to pass along the request to login page
            return NextResponse.next();
        }

        // handle the case for not authenticated & accessing sensitive routes
        if (!isAuth && isAccessSensitiveRoute) {
            // redirect the user to login page
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // handle the case for pathname / & redirect to dashboard
        if (pathname === "/") {
            // redirect the user to login page
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }, {
        // handle callback to prevent too many redirects
        callbacks: {
            async authorized() {
                return true;
            },
        },
    }
)

// match all the routes to withAuth middleware function
// :path* is a catch-all route
export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"],

}
