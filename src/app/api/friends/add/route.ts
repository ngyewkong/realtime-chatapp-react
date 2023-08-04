import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/util";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) { // for POST requests (addFriend)
    try {
        const body = await req.json(); // acccess body of the request

        // revalidate client input
        const { email: emailToAdd } = addFriendValidator.parse(body.email);
        
        // who to add (check their userid)
        // db rest api call
        // get (in upstash the format is user:email:{useremail})
        // use redis helper function to prevent weird caching issues in nextjs
        const idToAdd = (await fetchRedis(
            'get',
            `user:email:${emailToAdd}`,
        )) as string | null;

        // if no user found
        if (!idToAdd) {
            return new Response("User not found. Bad Request.", { status: 400 });
        }

        // if session is not set, return 401
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // if user is trying to add themselves -> error
        if (idToAdd === session.user.id) {
            return new Response("You cannot add yourself as a friend.", { status: 400 });
        }

        // if user is trying to add someone they already added -> error
        // via a helper function to connect to redis and validate
        // sismember is a redis command that checks if a value is in a set
        // in this case we are checking if the user is in the set of incoming_friend_request
        const isAlreadyAdded = await fetchRedis(
            'sismember', 
            `user:${idToAdd}:incoming_friend_request`, 
            session.user.id
            ) as boolean;

        if (isAlreadyAdded) {
            return new Response("You already added this user.", { status: 400 });
        }

        // check if user is already in the set of friends 
        // then they shld not be able to add a friend request
        const isAlreadyFriends = await fetchRedis(
            'sismember', 
            `user:${session.user.id}:friends`, 
            idToAdd
            ) as boolean;

        if (isAlreadyFriends) {
            return new Response("Already friends with this user", { status: 400 });
        }

        // before persisting the friend request data to db
        // use pusherServer to notify all clients that firends has been added 
        // .trigger() takes in 3 arguments
        // the redis path
        // the function that was used to bind the pusherClient
        // the actual data 
        await pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_request`), 'incoming_friend_request',
            {
                senderId: session.user.id,
                senderEmail: session.user.email,
            }
        )

        // after all the validation, send the add friend request
        // able to call db here because POST are not cached by default only GET
        // sadd is a redis command that adds a value to a set
        // in this case we are adding the user id to the set of incoming_friend_request 
        // of the user we are trying to add
        db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id);
        
        // return 200 ok
        return new Response("Friend request sent.", { status: 200 });
    } catch (error) {
        // use zod to validate the error
        if (error instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }

        // generic error
        return new Response("Invalid request", { status: 400 });
        
    }
}