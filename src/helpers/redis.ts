// function to interact with redis
const redisURL = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// setup Commands that are allowed with redis
type Command = "zrange" | "sismember" | "get" | "smembers"

export async function fetchRedis(
    command: Command,
    ...args: (string | number)[] // takes in any number of arguments as strings or numbers array
) {
    // join all the arguments with a / and add it to the url
    // see upstash rest api endpt docs for more info
    const commandUrl = `${redisURL}/${command}/${args.join("/")}`; 

    const response = await fetch(`${redisURL}/${command}/${args.join("/")}`, {
        headers: {
            Authorization: `Bearer ${redisToken}`,
        },
        cache: 'no-store',
    });

    // check if response return 200 ok
    if (!response.ok) {
        throw new Error(`Redis Command failed to execute: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.result;
}