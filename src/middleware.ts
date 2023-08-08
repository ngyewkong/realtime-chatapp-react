import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from './lib/rate-limiter';

export default withAuth(
    async function middleware(req: NextRequest) {
        const pathname = req.nextUrl.pathname

        // check pathname & protect routes
        // getToken() automatically use the next-auth secret key from .env
        // to decrypt the jwt token (req)
        const isAuth = await getToken( {req} );
        const isLoginPage = pathname.startsWith("/login");

        // sensitive route (dashboard - user must be logged in)
        const sensitiveRoutes = ["/dashboard", "/api/message/chatbot"];

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
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // handle auth and rate limit on the openai api endpt
        if (isAuth && isAccessSensitiveRoute) {
            // setup ratelimit on expensive api calls
            // if no ip set to localhost or 127.0.0.1
            const ip = req.ip ?? 'localhost:3000';

            try {
                const { success } = await rateLimiter.limit(ip);
                if (!success) {
                    return new NextResponse('Too many requests sent in a short period. Please try again later.');
                } 
                return NextResponse.next();
            } catch (error) {
                return new NextResponse('Sorry, something went wrong during processing. Please try again later.')   
            }
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
// added api route to openai end pt to rate limit the api call (costs)
export const config = {
    matcher: ["/", "/login", "/dashboard/:path*", "/api/message/chatbot/:path*"],

}
