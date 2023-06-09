import { Icon, Icons } from '@/components/Icons'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestsSidebarOption from '@/components/FriendRequestsSidebarOption'
import Link from 'next/link'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChatList'

interface LayoutProps {
    children: ReactNode
}

interface SideBarOption {
    id: number,
    name: string,
    href: string,
    Icon: Icon,
}

// need to know what user actions are available
const sideBarOptions: SideBarOption[] = [
    {
        id: 1,
        name: 'Add a friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    }
]

// Layout component takes children prop from all the pages that are rendered through the layout
// children props has type of ReactNode
// refactor the type safety at the children to make use of async await
const Layout = async ({ children }: LayoutProps) => {
    // get the session first
    const session = await getServerSession(authOptions);
    // if no session, they shld not be able to access the dashboard
    if (!session) {
        return notFound();
    }

    // get friends by user id
    // function in helpers
    const friends = await getFriendsByUserId(session.user.id);

    // unseenRequestCount logic
    // use fetchRedis to get the unseen friend requests
    // incoming_friend_request is the set that contains all the friend requests
    // fetchRedis return an object, so need to cast it to User[] to get the length
    const unseenRequestCount = (
        await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_request`
        ) as User[]
    ).length;

    // layout
    return (
        <div className='w-full flex h-screen'>
            {/* sidebar */}
            <div className='md:flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                    {/* logo */}
                    <Icons.Logo className='h-8 w-auto text-indigo-600' />
                </Link>
                {/* sidebar content - display chat information */}
                {/* show friend list if there is more than 1 friend */}
                {friends.length > 0 ?
                    (<div className='text-xs font-semibold leading-6 text-gray-400'>Your Chats</div>)
                    : null}
                {/* sidebar content - display actual chat information */}
                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>/ Placeholder - Chats that this user has /</li>
                        {/* actual sidebar chat friend list component - client component */}
                        <li>
                            <SidebarChatList sessionId={session.user.id} friends={friends} />
                        </li>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>
                            {/* sidebar content - display user actions that user can perform
                                1st user action - add friend */}
                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sideBarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-text-[0.625rem] font-medium bg-white'>
                                                    <Icon className='h-4 w-4' />
                                                </span>

                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                            {/* 2nd user action - friend requests navigation 
                            client component */}
                            <li className='-mx-2 mt-2 space-y-1'>
                                <FriendRequestsSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                            </li>
                        </li>




                        {/* sidebar content - user profile information at bottom of sidebar with signout button */}
                        <li className='-mx-6 mt-auto flex items-center'>
                            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image || ''}
                                        alt='Your Profile Picture'
                                    />
                                </div>
                                {/* user profile information - hidden if using screen reader */}
                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className='text-sm text-zinc-400' aria-hidden='true'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <SignOutButton className='h-full aspect-square' />
                        </li>
                    </ul>
                </nav>
            </div>

            {/* main content - outside of the sidebar */}
            {children}
        </div>
    )
}

export default Layout