'use client'

import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey } from '@/lib/util';
import { Message } from '@/lib/validations/message';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';

interface SidebarChatListProps {
  friends: User[],
  sessionId: string,
}

// extended Message interface
interface ExtendedMessage extends Message {
  senderImg: string,
  senderName: string,
}

// friends list should not flood over the whole sidebar for users with a lot of friends
// setting the scroll bar to appear if the list is too long
// SidebarChatList take friends as props which is an array of User type
// show how many unseen messages for each friend
const SidebarChatList: FC<SidebarChatListProps> = ({ sessionId, friends }) => {
  // access to the router
  const router = useRouter();
  // get the current pathname (relative to the domain name)
  const pathname = usePathname();
  // set up state to track unseen messages
  // initial value is an empty array
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  // handle realtime notification when new chat messages are sent
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:chats`)
    );
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:friends`)
    );

    const newMessagehandler = (message: ExtendedMessage) => {
      console.log("logging", message);
      // only send toast notifications if user is not in the chat screen with the sender
      const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) {
        return
      }

      // should notify 
      toast.custom((t) => (
        // impl custom notification component
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    const newFriendHandler = () => {
      // just need to reload the window without hard reload
      router.refresh();
    }

    // bind the new events
    pusherClient.bind('new-message', newMessagehandler)
    pusherClient.bind('new-friend', newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
    }
    // setting the dependency array so that useEffect tracks if user went from chat screen to another page
    // and the toast notif will still behave correctly and send out notification
  }, [pathname, sessionId, router])

  // useEffect to update the unseenMessages state
  // with dependency array on pathname
  // whenever the pathname changes, the useEffect will run
  useEffect(() => {
    // check if pathname is on the chat page / whatever chatid specific page the user is on
    if (pathname?.includes('chat')) {
      setUnseenMessages((prevMsg) => {
        // check if the message pathname contains the sender id
        // if it does, then the message is seen
        // if it doesn't, then the message is unseen
        return prevMsg.filter((message) => {
          !pathname.includes(message.senderId)
        })
      })
    }
  }, [pathname]);

  return <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
    {friends.sort().map((friend) => {
      // check how many unseen messages for each friend
      // only take the length of the array of unseen messages that have the same sender id as the friend id
      const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
        return unseenMsg.senderId === friend.id
      }).length;
      return (<li key={friend.id}>
        {/* anchor tag used instead of link tag as it enforce hard refresh everytime */}
        {/* which is the desired behaviour wanted */}
        {/* using a util helper to help sort the senderid--friendid to match the format used for chat id */}
        {/* sessionId & friend.id are being passed in as props from layout.tsx */}
        <a href={`/dashboard/chat/${chatHrefConstructor(
          sessionId, friend.id
        )}`}
          className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
          {friend.name}
          {/* the small notification count besides name */}
          {unseenMessagesCount > 0 ?
            (<div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
              {unseenMessagesCount}
            </div>)
            : null}
        </a>
      </li>)
    })}
  </ul>
}

export default SidebarChatList