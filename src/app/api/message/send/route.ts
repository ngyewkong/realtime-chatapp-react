import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message, messageSchema } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const {text, chatId}: {text: string, chatId: string} = await req.json();
        const session = await getServerSession(authOptions);

        // check for valid session
        if (!session) {
            return new Response("Unauthorized", {status: 401});
        }

        // split the chat id to get back the 2 user ids
        const [userId1, userId2] = chatId.split('--');
        console.log(userId1, userId2);

        // check for if session user is any of the 2 chat id
        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', {status: 401});
        }

        // set the friend id by checking if session user is either id 1 or 2
        const friendId = session.user.id === userId1 ? userId2 : userId1;

        // check if they are friends
        const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`)
        const isFriend = friendList.includes(friendId);

        // if they are not friends they not supposed to be able to send each other messages
        if (!isFriend) {
            return new Response('Unathorized', {status: 401});
        }

        // get sender info so that we can pass it as notification popup later for users who are not already in the chat with the sender
        // return a json string need change to user type
        const senderResponse = await fetchRedis('get', `user:${session.user.id}`)
        const sender = JSON.parse(senderResponse) as User;

        const timestamp = Date.now()

        // using nanoid package to gen id
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp,
        }

        const actualMessage = messageSchema.parse(messageData);

        // all validations passed, send the message
        // persist in db -> zadd: add to a sorted list
        // score is the sorting condition
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(actualMessage),
        })

        return new Response('OK');

    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }

        return new Response('Internal Server Error', {status: 500});
    }
}