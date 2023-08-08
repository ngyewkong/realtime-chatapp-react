'use client'

import { ChatBotMessagesContext } from '@/context/ChatBotMessages'
import { cn } from '@/lib/util'
import { ChatBotMessage } from '@/lib/validations/message'
import { useMutation } from '@tanstack/react-query'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

interface ChatBotInputProps extends HTMLAttributes<HTMLDivElement> {

}

const ChatBotInput: FC<ChatBotInputProps> = ({ className, ...props }) => {
    const [input, setInput] = useState<string>('');

    // to access the context properties
    const {
        chatBotMessages,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
    } = useContext(ChatBotMessagesContext);

    // set up a ref for focusing the text area
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    // collect the text from chat input and send to api
    // call the mutate hook by using sendMessage
    const { mutate: sendMessage, isLoading } = useMutation({
        // mutationFn -> async function (axios function)
        mutationFn: async (message: ChatBotMessage) => {
            const response = await fetch('/api/message/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [message] }),
            })

            return response.body
        },
        // this fire off once mutation function runs 
        // whether success or not
        onMutate(message) {
            addMessage(message);
        },
        onSuccess: async (stream) => {
            // getting the readable string from server to the client
            if (!stream) throw new Error('No stream found...');

            const id = nanoid();
            const responseMessage: ChatBotMessage = {
                id,
                isUserMessage: false,
                text: '',
            }

            addMessage(responseMessage);

            setIsMessageUpdating(true);

            // get the stream reader and decoder to transform to readable text
            const reader = stream.getReader();
            const decoder = new TextDecoder();

            let done: boolean = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading
                const chunkValue = decoder.decode(value);

                // this will add the chunkValue to the prev message (showing as a single message)
                updateMessage(id, (prev) => prev + chunkValue);

            }

            // clean up
            setIsMessageUpdating(false);
            setInput('');

            // force the text area to focus after send
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 10);
        },
        // error handling
        onError(_, message) {
            // toast notification to user on error with OpenAI api
            toast.error('Something went wrong. please try again.')
            // remove the message that failed to send to the api endpoint
            removeMessage(message.id);
            textareaRef.current?.focus();
        }
    });

    return <div {...props} className={cn('border-t border-lightinteractive dark:border-darkinteractive', className)}>
        <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
            <TextareaAutosize
                ref={textareaRef}
                rows={2}
                maxRows={4}
                disabled={isLoading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()

                        const message = {
                            id: nanoid(),
                            isUserMessage: true,
                            text: input
                        }

                        sendMessage(message);
                    }
                }}
                autoFocus
                placeholder='Send a message to begin'
                className='overflow-hidden peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-gray dark:bg-darkgray py-1.5 text-lightinline dark:text-darkinline focus:ring-0 text-sm sm:leading-6 placeholder:text-darkgray dark:placeholder:text-gray'
            />
            <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
                <kbd className='inline-flex items-center rounded border bg-lightprimary dark:bg-darkprimary px-1 font-sans border-darkgray dark:border-gray text-xs text-lightinline dark:text-darkinline '>
                    {isLoading ? (<Loader2 className='w-3 h-3 animate-spin' />) : (<CornerDownLeft className='w-3 h-3' />)}
                </kbd>
            </div>
            <div aria-hidden='true' className='absolute inset-x-0 bottom-0 border-t border-darkgray dark:border-gray peer-focus:border-t-2 peer-focus:border-lightinteractive dark:peer-focus:border-darkinteractive' />
        </div>
    </div>
}

export default ChatBotInput