'use client'

import { FC } from 'react'
import ChatBotHeader from './ChatBotHeader'
import ChatBotInput from './ChatBotInput'
import ChatBotMessages from './ChatBotMessages'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './ui/accordion'

interface ChatBotPopupProps {

}

const ChatBotPopup: FC<ChatBotPopupProps> = ({ }) => {
    return (
        <Accordion
            type='single'
            collapsible
            className='relative bg-lightprimary dark:bg-darkprimary z-40 shadow'>
            <AccordionItem value='item-1'>
                <div className='fixed right-8 w-80 bottom-8 bg-lightprimary dark:bg-darkprimary border border-lightinteractive dark:border-darkinteractive rounded-md overflow-hidden'>
                    <div className='w-full h-full flex flex-col'>
                        <AccordionTrigger className='px-6 border-b border-lightinteractive dark:border-darkinteractive'>
                            <ChatBotHeader />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='flex flex-col h-80'>
                                <ChatBotMessages className='px-2 py-3 flex-1' />
                                <ChatBotInput className='px-4' />
                            </div>
                        </AccordionContent>
                    </div>
                </div>
            </AccordionItem>
        </Accordion>
    )
}

export default ChatBotPopup