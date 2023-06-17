import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import AzureADProvider from "next-auth/providers/azure-ad";
import { fetchRedis } from "@/helpers/redis";

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

// check if we set the discord environment variables
function getDiscordCredentials() {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    
    // check if clientId and clientSecret are defined
    if (!clientId || clientId.length === 0) {
        throw new Error(
            "Missing DISCORD_CLIENT_ID environment variable"
        );
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(
            "Missing DISCORD_CLIENT_SECRET environment variable"
        );
    }
    // return the credentials object
    return { clientId, clientSecret };
}

// check if we set the discord environment variables
function getAzureCredentials() {
    const clientId = process.env.AZURE_AD_CLIENT_ID;
    const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
    const tenantId = process.env.AZURE_AD_TENANT_ID;
    
    // check if clientId and clientSecret are defined
    if (!clientId || clientId.length === 0) {
        throw new Error(
            "Missing AZURE_AD_CLIENT_ID environment variable"
        );
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(
            "Missing AZURE_AD_CLIENT_SECRET environment variable"
        );
    }

    if (!tenantId || tenantId.length === 0) {
        throw new Error(
            "Missing AZURE_AD_TENANT_ID environment variable"
        );
    }
    // return the credentials object
    return { clientId, clientSecret, tenantId };
}

// Discord Scopes
// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
const scopes = ['identify'].join(' ');

// adapter: handles auth data persistence in database
// helps to store all the useful user data from login into redis
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
        DiscordProvider({
            clientId: getDiscordCredentials().clientId,
            clientSecret: getDiscordCredentials().clientSecret,
            authorization: {params: {scope: scopes}},
        }),
        AzureADProvider({
            clientId: getAzureCredentials().clientId,
            clientSecret: getAzureCredentials().clientSecret,
            tenantId: getAzureCredentials().tenantId,
          }),
    ],
    // callbacks are actions that are executed when certain next auth events happen
    callbacks: {
        async jwt({token, user}) {
            // check if this is a newly created user
            // db.get(`user:${token.id}`) follows redis convention 
            // weird caching behavior when using db.get(`user:${user.id}`)
            // use fetchRedis instead of db.get
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null;
            // if no dbUser, this is a new user
            if (!dbUserResult) {
                // set the user object in the database
                token.id = user!.id;
                return token;
            }

            // parse the dbUserResult into a User object
            const dbUser = JSON.parse(dbUserResult) as User;

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
            // set token.image to be of type string in src/types/next-auth.d.ts
            // so as to use image as variable for image
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.image;
            }

            // return the session
            return session;
        },
        redirect() {
            return '/dashboard'
        },
    },
};