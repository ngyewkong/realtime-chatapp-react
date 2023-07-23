import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx is a library that allows you to conditionally join classNames together
// tailwind-merge is a library that allows you to conditionally join tailwind classes together
export function cn(...input: ClassValue[]) {
    return twMerge(clsx(input))
}

// This function is used to construct the chat id for the chat href
export function chatHrefConstructor (id1:string, id2:string) {
    const sortedIds = [id1, id2].sort();
    return `${sortedIds[0]}--${sortedIds[1]}`;
}

// helper function to map : to __ to use in Pusher 
// Pusher do not take : as arguments -> while redis uses it
export function toPusherKey(key: string) {
    return key.replace(/:/g, '__')
}