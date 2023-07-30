'use client'

import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {

}

// override the default FormData type
// using .infer method from zod to infer the type of the validator to FormData
// can observe FormData has email property of type string
type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

    // useForm from react-hook-form
    // use zod to validate the form
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    })

    // logic for adding a friend
    const addFriend = async (email: string) => {
        try {
            // validate user input is correct
            const validatedEmail = addFriendValidator.parse({ email })

            // post the validated email to the api using await axios
            await axios.post('/api/friends/add', {
                email: validatedEmail,
            })

            // when axios return 200 ok, set the showSuccessState to true
            setShowSuccessState(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                // let form handle the validation error
                setError('email', { message: error.message })
                return
            }

            if (error instanceof AxiosError) {
                // handle axios error (api error)
                setError('email', { message: error.response?.data })
                return
            }

            // for other unforeseen errors
            setError('email', { message: 'Something went wrong. Please try again in a few minutes.' })
        }
    }

    // logic for form submission
    const onSubmit = (data: FormData) => {
        // onsubmit of form call addFriend function with email as input
        addFriend(data.email)
    }

    return <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
        <label
            htmlFor="email"
            className='block text-sm font-medium leading-6 text-gray-900'>
            Add Friend by Email
        </label>

        <div className='mt-2 flex gap-4'>
            <input
                {...register('email')}
                type="text"
                className='block w-full rounded-md border-0 py-1.5 text-lightinline dark:text-darkinline
                shadow-sm ring-1 ring-inset ring-lightprimarysubtle dark:ring-darkprimarysubtle placeholder:text-gray
                focus:ring-2 focus:ring-inset focus:ring-lightinteractive dark:focus:ring-darkinteractive
                sm:text-sm sm:leading-6'
                placeholder='johndoe@email.com' />
            <Button>Add</Button>
        </div>
        {/** p tag to handle display of errors */}
        <p className='mt-1 text-wrong text-sm'>{errors.email?.message}</p>
        {/** p tag to handle display of success message only if success state is true then render */}
        {showSuccessState ? (<p className='mt-1 text-correct text-sm'>Friend Request sent!</p>) : null}
    </form>
}

export default AddFriendButton