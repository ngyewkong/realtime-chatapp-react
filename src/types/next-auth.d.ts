import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

// declare module jwt from next-auth
// need to set image to be of type string since we are getting from google
// if not set, the default is for token to use picture as variable for image
declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId;
        image: string;
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
