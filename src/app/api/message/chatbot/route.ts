import { chatbotPrompt } from "@/helpers/constants/chatbot-prompt";
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream";
import { chatBotMessageArraySchema } from "@/lib/validations/message";

export async function POST(req: Request) {
    const {messages} = await req.json();

    // parse the input messages to validate the client input
    const parsedMessages = chatBotMessageArraySchema.parse(messages);

    // messages to send to ChatGPT
    const outboundMesaages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? 'user' : 'system',
        content: message.text,
    }))

    // reverse order the messages
    outboundMesaages.unshift({
        role: 'system',
        content: chatbotPrompt
    });
    
    // OpenAI API
    // set the readable stream to consume the OpenAI api
    // return the output in realtime
    // payload is what we send to OpenAI api
    // stream attribute -> get back the response as stream not the full response all at once
    // documetation: https://platform.openai.com/docs/api-reference/chat/create
    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outboundMesaages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1,
    }

    // get the stream back
    const stream = await OpenAIStream(payload);

    console.log('test endpoint');
    // return the stream in the api response
    return new Response(stream);
}