import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { start } from "repl";

export type ChatGPTAgent = "user" | "system"

export interface ChatGPTMessage {
    role: ChatGPTAgent,
    content: string,
}

export interface OpenAIStreamPayload {
    model: string,
    messages: ChatGPTMessage[],
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number,
    max_tokens: number,
    stream: boolean,
    n: number,
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
    // setup the text encoder and decoder
    // to handle the OpenAI api response buffer object
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
    })

    // create the readable stream
    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data;

                    // check if data stream is done
                    // close the controller if done
                    if (data === '[DONE]') {
                        controller.close();
                        return
                    }

                    try {
                        const json = JSON.parse(data)
                        console.log("json: ", json);

                        const text = json.choices[0].delta?.content || '';
                        console.log("text: ", text);

                        // check if the prefix character eg \n at the start or any empty array of line if so do nothing 
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return
                        }

                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        
                        counter++;
                    } catch (error) {
                        controller.error(error);
                    }
                }
            }

            const parser = createParser(onParse);

            // decode the encoded response body, chunk by chunk
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
            } 
        },
    })
    
    // return the stream
    return stream;
}