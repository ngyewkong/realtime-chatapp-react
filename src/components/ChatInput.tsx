import { FC } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface ChatInputProps {

}

const ChatInput: FC<ChatInputProps> = ({ }) => {
    return <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <TextareaAutosize />
        </div>
    </div>
}

export default ChatInput