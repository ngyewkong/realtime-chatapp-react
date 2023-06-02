import { z } from "zod";

// zod uses schema to validate the data
// we can use zod to validate the data that we get from the client
// we can also use zod to validate the data that we get from the database

// z object can be used to check input by parsing the object to be validated
export const addFriendValidator = z.object({
    // z.string().email() checks if the input is a string and an email
    email: z.string().email(),
})