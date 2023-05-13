import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { TokenClass } from "typescript";

// check if we set the environment variables
function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    // check if clientId and clientSecret are defined
    if (!clientId || clientId.length === 0) {
        throw new Error(
            "Missing GOOGLE_CLIENT_ID environment variable"
        );
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(
            "Missing GOOGLE_CLIENT_SECRET environment variable"
        );
    }
    // return the credentials object
    return { clientId, clientSecret };
}

// adapter: handles auth data persistence in database
// NextAuthOptions is a type that defines the options that we can pass to NextAuth
export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt', 
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    // callbacks are actions that are executed when certain next auth events happen
    callbacks: {
        async jwt({token, user}) {
            // check if this is a newly created user
            // db.get(`user:${token.id}`) follows redis convention 
            const dbUser = (await db.get(`user:${token.id}`)) as User | null;

            // if no dbUser, this is a new user
            if (!dbUser) {
                // set the user object in the database
                token.id = user!.id;
                return token;
            }

            // if there is a dbUser, return it
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
            }
        },
        // check if user has a valid session
        async session({session, token}) {
            // check if the session is valid
            // if the session is valid, return it
            // default jwt use picture as variable for image
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            // return the session
            return session;
        }

    },
};