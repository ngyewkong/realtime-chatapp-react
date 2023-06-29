import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArraySchema } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react'

interface PageProps {
  params: {
    chatId: string,
  }
}

async function getChatMessages(chatId: string) {
  // get all messages from db with zrange
  try {
    // result is an array of strings (from json)
    // chat is another set that contains all the messages
    // zrange index of 0 to last index (-1)
    const result: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1,
    )

    // take the result and parse it into a Message object
    // most recent messages at the top
    const messages = result.map((message) => {
      JSON.parse(message) as Message;
    })

    // display the messages in reverse order (reverse chronological order)
    // most recent messages at the bottom
    const reversedMessages = messages.reverse();

    // validate the messages
    const chatMessages = messageArraySchema.parse(reversedMessages);

    return chatMessages;

  } catch (error) {
    return notFound();
  }
}

// we want to have dynamic page for each chat
// /dashboard/chat/[chatId] -> will open the chat with the chatId
// nextjs will automatically create a page for each chat 
// by setting up folder structure /dashboard/chat/[chatId]/page.tsx
// we can access the chatId using the params prop
const page = async ({ params }: PageProps) => {
  const { chatId } = params;

  // check for session
  const session = await getServerSession(authOptions);

  // user shld be logged in to access chat
  if (!session) {
    return notFound();
  }

  // deconstruct the session
  const { user } = session;

  // construct the chatId and sort it 
  // eg. chatId = 'user1--user2' or 'user2--user1' => 'user1--user2'
  const [userId1, userId2] = chatId.split('--');

  // user can only access the chat if they are part of the chatId
  if (user.id !== userId1 && user.id !== userId2) {
    return notFound();
  }

  // use ternary operator to find which chatId is the current user
  const otherUserId = user.id === userId1 ? userId2 : userId1;
  const otherUser = (await db.get(`user:${otherUserId}`)) as User;

  // get the chat messages
  const chatMessages = await getChatMessages(chatId);


  return <div>{params.chatId}</div>
}

export default page