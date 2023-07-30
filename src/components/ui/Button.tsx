import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/util";

// using class-variance-authority to create variants of buttons for the whole ui
// cva("TAILWINDCSS CLASSNAME", "VARIANT NAME") to specify the css styling and the variant name
const buttonVariants = cva(
    "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            // whatever you want to name the different variants of buttons
            variant: {
                default: 'bg-lightprimary dark:bg-darkprimary text-lightinline dark:text-darkinline hover:bg-lightinteractive dark:hover:bg-darkinteractive ring-lightinteractive dark:ring-darkinteractive ring-1',
                ghost: 'bg-transparent hover:text-lightinline hover:bg-lightprimary',
                hover: 'hover:bg-lightprimarysubtle dark:hover:bg-darkprimarysubtle hover:border-lightinteractive dark:hover:border-darkinteractive hover:text-lightinteractive dark:hover:text-darkinteractive',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg: 'h-11 px-8',
            }
        },
        // setting the default variants letting cva which to use as default
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

// cannot use type as variant name because it is a reserved word (conflict with typescript)
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    // add any props you want to add to the button
    isLoading?: boolean;

}

// pass in the props, ...props to pass in the rest of the props acts as a catch all
// using lucide-react for icons
// children is the text inside the button
const Button: FC<ButtonProps> = ({ className, children, variant, isLoading, size, ...props }) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
    </button>;
};

export default Button;
