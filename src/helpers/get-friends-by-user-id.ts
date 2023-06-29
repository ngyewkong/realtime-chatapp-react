import { parse } from "path";
import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
    // retrieve friends for current user
    const friendIds = (await fetchRedis(
        'smembers', 
        `user:${userId}:friends`
        )) as string[];

    // get user info for each friend
    // Promise.all (call all promises at once)
    const friends = await Promise.all(
        friendIds.map(async (friendId) => {
            // fetch all information about the friend
            // return a string
            const friend = (await fetchRedis('get', `user:${friendId}`)) as string;
            const parsedFriend = JSON.parse(friend) as User;
            return parsedFriend;
        })
    );

    // return the friends
    return friends;
};