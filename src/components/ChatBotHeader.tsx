import { FC } from 'react'

interface ChatBotHeaderProps {

}

const ChatBotHeader: FC<ChatBotHeaderProps> = ({ }) => {
    return <div className='w-full flex gap-3 justify-start items-center text-lightinline dark:text-darkinline'>
        <div className='flex flex-col items-start text-sm'>
            <p className='text-xs'>Chat with</p>
            <div className='flex gap-1.5 items-center'>
                <p className='w-2 h-2 rounded-full bg-correct'></p>
                <p className='font-medium'>Chatbot Support</p>
            </div>
        </div>
    </div>
}

export default ChatBotHeader