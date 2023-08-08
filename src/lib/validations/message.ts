import {z} from 'zod';

// to validate a single message
export const messageSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

// chatbot message validation schema
export const chatBotMessageSchema = z.object({
    id: z.string(),
    isUserMessage: z.boolean(),
    text: z.string(),
})

// to validate the whole array
export const messageArraySchema = z.array(messageSchema);

// chatbot message validator array
export const chatBotMessageArraySchema = z.array(chatBotMessageSchema);

// to infer the type of a single message that is properly validated
// similar to the Message interface in src/types/db.d.ts
export type Message = z.infer<typeof messageSchema>;

export type ChatBotMessage = z.infer<typeof chatBotMessageSchema>;