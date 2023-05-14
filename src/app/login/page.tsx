'use client'

import Button from '@/components/ui/Button'
import { FC, useState } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface pageProps {

}
// by default in nextjs this is server side rendered
// cannot pass onclick events to server side rendered pages
// so if you want to make it client side rendered you need to add 'use client' to the top of the page
const page: FC<pageProps> = ({ }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDiscordLoading, setIsDiscordLoading] = useState<boolean>(false);

    async function loginWithGoogle() {
        // set loading state to true
        setIsLoading(true);
        try {
            // using signIn from next-auth/react lib to sign in with google
            await signIn('google');
        } catch (error) {
            // display error message to user
            toast.error("Something went wrong with your Google login!");
        } finally {
            // set loading state to false
            setIsLoading(false);
        }
    }

    async function loginWithDiscord() {
        // set loading state to true
        setIsDiscordLoading(true);
        try {
            // using signIn from next-auth/react lib to sign in with google
            await signIn('discord');
        } catch (error) {
            // display error message to user
            toast.error("Something went wrong with your Discord login!");
        } finally {
            // set loading state to false
            setIsDiscordLoading(false);
        }
    }

    // setting a ternary operator to check if google login is loading on line 43
    // if so change the google logo to a loading spinner
    return (<>
        <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full flex flex-col items-center max-w-md space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    logo
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Sign in to your account
                    </h2>
                </div>

                <Button
                    isLoading={isLoading}
                    type='button'
                    className='max-w-sm mx-auto w-full'
                    onClick={loginWithGoogle}>
                    {isLoading ? null : (<svg
                        className='mr-2 h-4 w-4'
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='github'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'>
                        <path
                            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                            fill='#4285F4'
                        />
                        <path
                            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                            fill='#34A853'
                        />
                        <path
                            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                            fill='#FBBC05'
                        />
                        <path
                            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                            fill='#EA4335'
                        />
                        <path d='M1 1h22v22H1z' fill='none' />
                    </svg>)}
                    Google
                </Button>
                <Button
                    isLoading={isDiscordLoading}
                    type='button'
                    className='max-w-sm mx-auto w-full'
                    onClick={loginWithDiscord}>
                    {isLoading ? null : (<svg
                        className='mr-2 h-4 w-4'
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='github'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 16 16'>
                        <path
                            d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
                            fill='#7289d9'
                        />
                    </svg>)}
                    Discord
                </Button>
            </div>
        </div>
    </>)
}

export default page