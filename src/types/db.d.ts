interface User {
    name: string,
    email: string,
    image: string,
    id: string,
}

interface Message {
    id: string,
    senderId: string,
    receiverId: string,
    message: string,
    timestamp: number,
}

interface Chat {
    id: string,
    messages: Message[],
}

// used in realtime portion
interface FriendRequest {
    id: string,
    senderId: string,
    receiverId: string,
}