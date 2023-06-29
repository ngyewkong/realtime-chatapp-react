'use client'

import { chatHrefConstructor } from '@/lib/util';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
  friends: User[],
  sessionId: string,
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
        )}`}>
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