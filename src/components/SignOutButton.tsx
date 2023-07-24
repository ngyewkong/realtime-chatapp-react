"use client"

import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button';
import { toast } from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    return <Button {...props} variant='hover' onClick={async () => {
        setIsSigningOut(true);
        try {
            // set callbackUrl 
            await signOut();
        } catch (error) {
            toast.error("Something went wrong with your logout!");
        } finally {
            setIsSigningOut(false);
        }

    }}>{isSigningOut ? (<Loader2 className='animate-spin h-4 w-4' />) : (<LogOut className='h-4 w-4' />)}</Button>
}

export default SignOutButton