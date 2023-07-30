import { chatHrefConstructor, cn } from '@/lib/util'
import Image from 'next/image'
import { FC } from 'react'
import toast, { Toast } from 'react-hot-toast'

interface UnseenChatToastProps {
    t: Toast,
    sessionId: string,
    senderId: string,
    senderImg: string,
    senderName: string,
    senderMessage: string,
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({ t, sessionId, senderId, senderImg, senderName, senderMessage }) => {
    return (
        <div className={cn('max-w-md w-full bg-lightprimary dark:bg-darkprimary shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-lightinline dark:ring-darkinline ring-opacity-5',
            {
                'animate-enter': t.visible,
                'animate-leave': !t.visible,
            }
        )}>
            {/* a tag is used to force render the chat screen with the latest messages after user click on toast notification */}
            <a
                onClick={() => toast.dismiss(t.id)}
                href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
                className='flex-1 w-0 p-4'>
                <div className='flex items-start'>
                    <div className='flex-shrink-0 pt-0.5'>
                        <div className='relative h-10 w-10'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                className='rounded-full'
                                src={senderImg}
                                alt={`${senderName} profile picture`}
                            />
                        </div>
                    </div>

                    <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-darkgray'>{senderName}</p>
                        <p className='mt-1 text-sm text-gray'>{senderMessage}</p>
                    </div>
                </div>
            </a>

            <div className='flex border-l border-gray'>
                <button
                    onClick={() => { toast.dismiss(t.id) }}
                    className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-lightinteractive dark:text-darkinteractive hover:text-lightinteractive dark:hover:text-darkinteractive focus:outline-none focus:ring-2 focus:ring-lightinteractive dark:focus:ring-darkinteractive'>
                    Close
                </button>
            </div>
        </div>
    )
}

export default UnseenChatToast