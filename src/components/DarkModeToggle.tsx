'use client'
import { FC, useEffect, useState } from 'react'
import { DarkModeSwitch } from 'react-toggle-dark-mode';

interface DarkModeToggleProps {

}

const DarkModeToggle: FC<DarkModeToggleProps> = ({ }) => {
    function useDarkSide() {
        const systemTheme = localStorage.getItem("theme")!;
        const [theme, setTheme] = useState(systemTheme);
        const colorTheme: string = theme === "light" ? "dark" : "light";

        useEffect(() => {
            const root = window.document.documentElement;
            root.classList.remove(colorTheme);
            root.classList.add(theme);

            localStorage.setItem("theme", theme);
        }, [theme, colorTheme]);

        return [colorTheme, setTheme] as const;
    }
    const [colorTheme, setTheme] = useDarkSide();
    const darkModeChecker: boolean = JSON.parse(localStorage.getItem("theme")! === "dark" ? "true" : "false");
    const [isDarkMode, setDarkMode] = useState(darkModeChecker);


    const toggleDarkMode = (checked: boolean) => {
        setTheme(colorTheme);
        setDarkMode(checked);
    };

    return (
        <div className="inline-flex items-center justify-center border rounded-lg hover:bg-lightinteractive dark:hover:bg-darkinteractive border-lightinteractive dark:border-darkinteractive">
            <DarkModeSwitch
                style={{
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem"
                }}
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={30}
                moonColor="#FFEFD5"
                sunColor="#23272A"
            />


            {/* tailwindcss utility works from smallest to largest screensize */}
            {/* hidden -> mobile screen hide the text */}
            {/* uppercase md:inline-flex text-sm -> medium screen size show text in uppercase, small font and gray color */}
            {/* <div id="navbartext" className="cursor-none uppercase hidden md:inline-flex text-sm text-lightinline dark:text-darkinline mx-4">
                <span className="mx-1">{colorTheme === "light" ? "In Dark Mode!" : "In Light Mode!"}</span>
            </div> */}
        </div>
    )
}

export default DarkModeToggle