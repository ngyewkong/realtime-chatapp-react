import Button from '@/components/ui/Button'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'


const page = async ({ }) => {

    const session = await getServerSession(authOptions)

    if (!session) {
        notFound();
    }
    return <div>Welcome {!session ? "Unknown User" : session.user.name}!</div>
}

export default page