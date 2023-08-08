import { ChatBotMessage } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { createContext, ReactNode, useState } from "react";

// setup context so that ChatBot Popup, ChatBot Input, ChatBot Messages Components can access the props without needing to pass it
// set the type for the context
// set the default values for each type if no value received 
export const ChatBotMessagesContext = createContext<{
    chatBotMessages: ChatBotMessage[],
    isMessageUpdating: boolean,
    addMessage: (message: ChatBotMessage) => void,
    removeMessage: (id: string) => void,
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void,
    setIsMessageUpdating: (isUpdating: boolean) => void,
}>({
    chatBotMessages: [],
    isMessageUpdating: false,
    addMessage: () => { },
    removeMessage: () => { },
    updateMessage: () => { },
    setIsMessageUpdating: () => { },
});

// define main provider to wrap the components with
export function ChatBotMessagesProvider({ children }: { children: ReactNode }) {
    // need to use state to pass into the context provider
    const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);

    const [chatBotMessages, setChatBotMessages] = useState<ChatBotMessage[]>([
        {
            id: nanoid(),
            text: 'Hi there, how can I help you?',
            isUserMessage: false,
        },
    ]);

    // set the other values state
    const addMessage = (message: ChatBotMessage) => {
        setChatBotMessages((prev) => [...prev, message]);
    }

    const removeMessage = (id: string) => {
        // filter out the message that we want to remove
        // set the state to the previous version that is without the removed message
        setChatBotMessages((prev) => prev.filter((message) => message.id !== id));
    }

    // take a prev text into the callback func updateFn
    // allow us to pass the response from OpenAI to an existing string instead of chunk by chunk
    const updateMessage = (id: string, updateFn: (prevText: string) => string) => {
        // map all the messages
        // if the message is the same id
        // update the message with the new text
        // add to state as well
        setChatBotMessages((prev) => prev.map((message) => {
            if (message.id === id) {
                return { ...message, text: updateFn(message.text) }
            }

            // return message as is if it is not the same id (do not update not the same chunk id)
            return message
        }))
    }


    return <ChatBotMessagesContext.Provider
        value={{
            chatBotMessages,
            addMessage,
            removeMessage,
            updateMessage,
            isMessageUpdating,
            setIsMessageUpdating,
        }}>{children}</ChatBotMessagesContext.Provider>
}