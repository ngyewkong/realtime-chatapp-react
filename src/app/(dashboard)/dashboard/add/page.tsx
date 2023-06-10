import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
    return <main className='pt-8 px-6'>
        <h1 className='font-bold text-5xl mb-8 text-indigo-800'>Add a Friend to begin chatting.</h1>
        <AddFriendButton />
    </main>
}

export default page