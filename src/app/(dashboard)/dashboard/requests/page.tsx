import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { FC } from 'react'

const page = async ({ }) => {
    const session = await getServerSession(authOptions);

    // if no session return not found
    if (!session) {
        notFound();
    }

    // ids of people who sent the current logged in user a friend request
    // as a string array with all the ids
    const incomingSenderIds = (await fetchRedis(
        'smembers',
        `user:${session.user.id}:incoming_friend_request`
    )) as string[];

    // user.id is not very readable information to users
    // need to get the user's email from redis with the user id map function
    // use Promise.all to get all the user emails with higher performance
    // Promise.all takes an array of promises simultaneously
    // each incomingFriendRequest will be fetched at the same time
    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            // using the get command to get the user email based on the senderId
            // which is from the await earlier for incomingSenderIds
            // redis format is user:userId
            // redis is returning JSON string, so need parsify it
            // if not email will be undefined
            const sender = (await fetchRedis('get', `user:${senderId}`)) as string;
            const parsedSender = JSON.parse(sender);

            return {
                senderId,
                senderEmail: parsedSender.email,
            }
        })
    );

    // FriendRequests is needed to be client side rendered so that it can be updated or interacted
    // so separating it out into a component with 'use client' side rendering
    return (
        <main className='pt-8 px-6'>
            <h1 className='font-bold text-5xl mb-8 text-indigo-600'>Your Pending Friend Requests</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests
                    incomingFriendRequests={incomingFriendRequests}
                    sessionId={session.user.id} />
            </div>
        </main>
    )
}

export default page