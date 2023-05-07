import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx is a library that allows you to conditionally join classNames together
// tailwind-merge is a library that allows you to conditionally join tailwind classes together
export function cn(...input: ClassValue[]) {
    return twMerge(clsx(input))
}