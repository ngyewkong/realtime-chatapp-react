'use client'

// need to use context which is a client side only feature
// so we need to add 'use client' to the top of the page
// context pass some state to the entire app

import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
    children: ReactNode
}

// need to pass children to the providers component (which is the whole app in this case)
// also need to render the children if not nth will be rendered
const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <>
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            {children}
        </>
    )
}

export default Providers