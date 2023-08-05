'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/util'
// this requires client side rendering
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsSidebarOptionProps {
    sessionId: string,
    initialUnseenRequestCount: number
}

// sessionId is used to get the user's friend requests from redis
// initialUnseenRequestCount is going to be inherited from the dashboard layout component
// which is the parent component which is also a server side rendered component (real time data)
const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({ sessionId, initialUnseenRequestCount }) => {

    // useState to check if unseen friend requests is more than 0
    const [unseenFriendRequestCount, setUnseenFriendRequestCount] = useState<number>(
        initialUnseenRequestCount,
    )

    useEffect(() => {
        // use pusher client to subscribe for incoming friend request for each user
        // using utils helper function to replace : to __
        pusherClient.subscribe(toPusherKey(
            `user:${sessionId}:incoming_friend_request`
        ));

        // subscribe to another event to make the friend requests tracker real time
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

        // tell Pusher to bind the incoming_friend_request to a frontend function 
        // friendRequestHandler

        const friendRequestHandler = () => {
            // do not need the data as we just updating the friend req count 
            setUnseenFriendRequestCount((prev) => prev + 1)
        }

        const addedFriendHandler = () => {
            setUnseenFriendRequestCount((prev) => prev - 1)
        }

        pusherClient.bind('incoming_friend_request', friendRequestHandler);
        pusherClient.bind(`new_friend`, addedFriendHandler);

        return () => {
            // cleanup after the action/s are done
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:incoming_friend_request`
            ));
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:friends`
            ));
            pusherClient.unbind('incoming_friend_request', friendRequestHandler);
            pusherClient.unbind('new_friend', addedFriendHandler);
        }
    }, [sessionId])

    // handle the side notifcation of count after the Friend Requests p tag
    return (<Link href='/dashboard/requests' className='border-lightinline dark:border-darkinline hover:text-lightinteractive dark:hover:text-darkinteractive hover:border-lightinteractive dark:hover:border-darkinteractive group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <div className='text-lightinline dark:text-darkinline group border-lightinline dark:border-darkinline group-hover:border-lightinteractive dark:group-hover:border-darkinteractive group-hover:text-lightinteractive dark:group-hover:text-darkinteractive flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-text-[0.625rem] font-medium ring-lightinline dark:ring-darkinline'>
            <User className='h-4 w-4' />
        </div>
        <p className='truncate group-hover:border-lightinteractive dark:group-hover:border-darkinteractive group-hover:text-lightinteractive dark:group-hover:text-darkinteractive'>Friend Requests</p>

        {unseenFriendRequestCount > 0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-gray bg-lightinteractive dark:bg-darkinteractive'>
                {unseenFriendRequestCount}
            </div>
        ) : (null)}
    </Link>)
}

export default FriendRequestsSidebarOption