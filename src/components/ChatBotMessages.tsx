'use client'

import { ChatBotMessagesContext } from '@/context/ChatBotMessages'
import { cn } from '@/lib/util'
import { FC, HTMLAttributes, useContext } from 'react'
import MarkdownLite from './MarkdownLite'

interface ChatBotMessagesProps extends HTMLAttributes<HTMLDivElement> {

}

const ChatBotMessages: FC<ChatBotMessagesProps> = ({ className, ...props }) => {
    // access the messages from the context
    const { chatBotMessages } = useContext(ChatBotMessagesContext);

    // inverse message order (spread and reverse method)
    const inversedMessages = [...chatBotMessages].reverse();

    return (
        <div
            {...props}
            className={cn(
                'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch',
                className
            )}>
            <div className='flex-1 flex-grow' />
            {inversedMessages.map((message) => {
                return (
                    <div className='chat-message' key={`${message.id}-${message.id}`}>
                        <div
                            className={cn('flex items-end', {
                                'justify-end': message.isUserMessage,
                            })}>
                            <div
                                className={cn('flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden', {
                                    'order-1 items-end': message.isUserMessage,
                                    'order-2 items-start': !message.isUserMessage,
                                })}>
                                <p
                                    className={cn('px-4 py-2 rounded-lg', {
                                        'bg-lightinteractive dark:bg-darkinteractive text-darkinline dark:text-gray': message.isUserMessage,
                                        'bg-darkinteractive dark:bg-lightinteractive text-darkinline dark:text-gray': !message.isUserMessage,
                                    })}>
                                    <div>{message.text}</div>
                                    {/* <MarkdownLite text={message.text} /> */}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatBotMessages;