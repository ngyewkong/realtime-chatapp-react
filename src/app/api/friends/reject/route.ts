import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    // POST request to /api/friends/reject
    try {
        const body = await req.json();

        // validate the id if it's valid
        const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

        // check if request if valid (user is logged in)
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // remove the friend request from set incoming_friend_request
        await db.srem(`user:${session.user.id}:incoming_friend_request`, idToDeny);

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.log(error);
        
        // use zod to validate the error
        if (error instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }

        // generic error
        return new Response("Invalid request", { status: 400 });
    }

}