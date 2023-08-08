'use client'

// need to use context which is a client side only feature
// so we need to add 'use client' to the top of the page
// context pass some state to the entire app

import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ChatBotMessagesProvider } from '@/context/ChatBotMessages'

interface ProvidersProps {
    children: ReactNode
}

// need to pass children to the providers component (which is the whole app in this case)
// also need to render the children if not nth will be rendered
// wrap the QueryClientProvider from react-qeury to the children
// need to wrap the children with the Context Provider as well
const Providers: FC<ProvidersProps> = ({ children }) => {
    const queryClient = new QueryClient();
    return (
        <>
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <QueryClientProvider client={queryClient}>
                <ChatBotMessagesProvider>{children}</ChatBotMessagesProvider>
            </QueryClientProvider>
        </>
    )
}

export default Providers