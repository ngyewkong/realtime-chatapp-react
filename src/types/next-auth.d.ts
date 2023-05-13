import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

// declare module jwt from next-auth
declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId;
    }
} 

// allow us to use Session interface when we use next-auth
declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId;
        }
    }
}
