'use client'

import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ChatInputProps {
    chatPartner: User,
    chatId: string,
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    // using useRef to be able to focus on the textarea
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    // use state to check for loading
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // use state to store the input
    const [input, setInput] = useState<string>('');

    // function to send the message
    const sendMessage = async () => {
        setIsLoading(true);

        try {
            // mock a fake succ post req
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // await axios.post('/api/message/send', { text: input, chatId: chatId });

            // set input back to empty
            setInput('');

            // reset focus back on to the text box after sending a message 
            // allow multiple sends right after submission (like how chat supposed to work)
            textareaRef.current?.focus();
        } catch (error) {
            toast.error("Something went wrong. Please try again later.")
        } finally {
            // set loading button to false at the end
            setIsLoading(false);
        }
    };
    return <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <TextareaAutosize ref={textareaRef} onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('Message Submitted');
                    sendMessage();
                }
            }}
                className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py1.5 sm:text-sm sm:leading-6'
                rows={1}
                value={input}
                placeholder={`Send a message to ${chatPartner.name}`}
                onChange={(e) => {
                    setInput(e.target.value);
                }} />

            <div onClick={() => textareaRef.current?.focus()} className='py-2' aria-hidden='true'>
                <div className='py-px'>
                    <div className='h-9' />
                </div>
            </div>

            <div className='absolute right-0 bottom-0 flex justify-between py-2 pt-3 pr-2'>
                <div className='flex-shrink-0'>
                    <Button isLoading={isLoading} onClick={sendMessage} type='submit'>Send</Button>
                </div>
            </div>
        </div>
    </div>
}

export default ChatInput