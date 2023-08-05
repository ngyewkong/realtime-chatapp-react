import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";
import { toPusherKey } from "@/lib/util";
import { pusherServer } from "@/lib/pusher";


export async function POST(req: Request) {
    try {
        const body = await req.json();

        // validate the id if it's valid
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body); 

        // check if request if valid (user is logged in)
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // if have session, check if user is adding an existing friend
        const isAlreadyFriends = await fetchRedis(
            'sismember', 
            `user:${session.user.id}:friends`,
            idToAdd
        );

        if (isAlreadyFriends) {
            return new Response("You are already friends", { status: 400 });
        }

        // check if user has friend request from the user they are trying to add
        const hasIncomingFriendRequest = await fetchRedis(
            'sismember',
            `user:${session.user.id}:incoming_friend_request`,
            idToAdd
        );

        if (!hasIncomingFriendRequest) {
            return new Response("No Friend Request", { status: 400 });
        }

        // to handle friend request notification counter (realtime)
        // use Promise.all() to handle simultaneously 
        const [userRaw, friendRaw] = (await Promise.all(
            [
                fetchRedis(`get`, `user:${session.user.id}`),
                fetchRedis(`get`, `user:${idToAdd}`),
            ]
        )) as [string, string]

        // json.parse the raw user and friend
        const user = JSON.parse(userRaw) as User
        const friend = JSON.parse(friendRaw) as User

        // trigger pusher function to refresh
        // notify added user
        // wrap with a Promise.all
        await Promise.all([
            pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), 'new_friend', user),
            pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), 'new_friend', friend),
            // after validations add user (idToAdd) to friends set of user (session.user.id)
            db.sadd(`user:${session.user.id}:friends`, idToAdd),
            // add user (session.user.id) to friends set of idToAdd
            db.sadd(`user:${idToAdd}:friends`, session.user.id),
            // remove user (idToAdd) from incoming_friend_request set of session.user.id
            db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd),
        ]);

        // optional remove outbound_friend_request set for idToAdd 

        console.log("has incoming friend request?", hasIncomingFriendRequest);

        // Need to return a Response if all validations pass
        // if not will have internal server error
        return new Response("OK", { status: 200 });


    } catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            return new Response("Invalid Request Payload", { status: 422 });
        }

        return new Response("Invalid Request", { status: 400 });
        
    }
}