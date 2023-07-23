'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/util'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
// this requires client side rendering
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[],
    sessionId: string,
}

// incomingFriendRequests will be passed from the parent component
const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
        incomingFriendRequests,
    )

    // import and use the useRouter hook from next/navigation
    const router = useRouter();

    useEffect(() => {
        // use pusher client to subscribe for incoming friend request for each user
        // using utils helper function to replace : to __
        pusherClient.subscribe(toPusherKey(
            `user:${sessionId}:incoming_friend_request`
        ));

        // tell Pusher to bind the incoming_friend_request to a frontend function 
        // friendRequestHandler

        const friendRequestHandler = ({ senderId, senderEmail }: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
        }
        pusherClient.bind('incoming_friend_request', friendRequestHandler);

        return () => {
            // cleanup after the action/s are done
            pusherClient.unsubscribe(toPusherKey(
                `user:${sessionId}:incoming_friend_request`
            ));
            pusherClient.unbind('incoming_friend_request', friendRequestHandler);
        }
    }, [sessionId, router])

    // functions to handle the friend requests (accept or reject)
    const handleAcceptFriendRequest = async (senderId: string) => {
        // make a post request to the backend to accept the friend request
        await axios.post('/api/friends/accept', { id: senderId });

        // put into state and render
        // check if the friednRequest senderId is not the same as the senderId
        setFriendRequests((prevFriendRequests) => {
            return prevFriendRequests.filter((friendRequest) => {
                friendRequest.senderId !== senderId
            })
        });

        // refresh the page using the router hook
        router.refresh();
    }

    // function to handle the reject friend request
    const handleRejectFriendRequest = async (senderId: string) => {
        // make a post request to the backend to reject the friend request
        await axios.post('/api/friends/reject', { id: senderId });

        // put into state and render
        // check if the friednRequest senderId is not the same as the senderId
        setFriendRequests((prevFriendRequests) => {
            return prevFriendRequests.filter((friendRequest) => {
                friendRequest.senderId !== senderId
            })
        });

        // refresh the page using the router hook
        router.refresh();
    };


    // conditional rendering with fragment
    // using map to render a div for each friend request that shows the friend request sender's email
    // render the buttons if there is friend request
    return (<>
        {
            friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendRequests.map((friendRequest) => (
                    <div key={friendRequest.senderId} className='flex gap-4 items-center'>
                        <UserPlus className='text-black' />
                        <p className='font-medium text-lg'>{friendRequest.senderEmail}</p>
                        <button onClick={() => handleAcceptFriendRequest(friendRequest.senderId)} aria-label='accept friend' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md' >
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                        <button onClick={() => handleRejectFriendRequest(friendRequest.senderId)} aria-label='reject friend' className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md' >
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                    </div>
                ))
            )
        }
    </>)
}

export default FriendRequests