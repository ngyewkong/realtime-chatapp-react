'use client'

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/util';
import { Message } from '@/lib/validations/message';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react'

interface MessagesProps {
    initialMessages: Message[],
    sessionId: string,
    chatId: string,
    sessionImg: string | null | undefined,
    otherUser: User
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, chatId, sessionImg, otherUser }) => {

    // initial messages as we will add more messages to the page
    // need to use state to render the messages
    // initialising the state with the initialMessages prop
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    // handle real time messaging using useEffect
    useEffect(() => {
        // use pusher client to subscribe for incoming friend request for each user
        // using utils helper function to replace : to __
        pusherClient.subscribe(toPusherKey(
            `chat:${chatId}:messages`
        ));

        // tell Pusher to bind the incoming_message to a frontend function 
        // messageHandler to handle real time update of message
        // since messages are in reversed order
        // we need to add to the front of the message array

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev]);
        }
        pusherClient.bind('incoming-message', messageHandler);

        return () => {
            // cleanup after the action/s are done
            pusherClient.unsubscribe(toPusherKey(
                `chat:${chatId}:messages`
            ));
            pusherClient.unbind('incoming-message', messageHandler);
        }
    }, [])

    // rmb the content messages are in reverse chronological order
    // we want to scroll to the bottom of the page when we receive a new message
    // using useRef -> client side rendering component

    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    // timestamp convert to HH:MM using date-fns helper package
    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
    }

    return (
        <div id='messages' className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef} />

            {messages.map((message, index) => {
                // check for sender
                const isCurrentUser = message.senderId === sessionId;

                //check for new message from sender
                // so that the image for the sender will only be shown once at the end
                const hasNewMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;

                // always need a key when using map
                // key with the message id and timestamp for an unique key
                // classname for easy debugging in chrome devtools
                // using cn helper util to do condition rendering in classname using isCurrentUser
                return (
                    <div className='chat-message' key={`${message.id}-${message.timestamp}`}>
                        <div className={cn('flex items-end', {
                            'justify-end': isCurrentUser,
                        })}>
                            <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start': !isCurrentUser,
                            })}>
                                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-indigo-600 text-white': isCurrentUser,
                                    'bg-gray-200 text-gray-900': !isCurrentUser,
                                    'rounded-br-none': !hasNewMessageFromSameUser && isCurrentUser,
                                    'rounded-bl-none': !hasNewMessageFromSameUser && !isCurrentUser,
                                })}>
                                    {message.text}{' '}
                                    <span className='ml-2 text-xs text-gray-400'>{formatTimestamp(message.timestamp)}</span>
                                </span>
                            </div>

                            <div className={cn('relative w-6 h-6', {
                                'order-2': isCurrentUser,
                                'order-1': !isCurrentUser,
                                'invisible': hasNewMessageFromSameUser
                            })}>
                                <Image
                                    fill
                                    src={isCurrentUser ? (sessionImg as string) : otherUser.image}
                                    alt='Profile Picture'
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                />
                            </div>
                        </div>
                    </div>)
            })}
        </div >
    )
}

export default Messages