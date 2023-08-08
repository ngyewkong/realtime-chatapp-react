import Link from 'next/link';
import React from 'react';

const MarkdownLite = ({ text }: { text: string }) => {
    // check if the text is link
    const linkRegex = /\[(.+?)\]\((.+?)\)/g
    const parts = []

    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, linkUrl] = match;
        const matchStart = match.index;
        const matchEnd = matchStart + fullMatch.length;

        if (lastIndex < matchStart) {
            parts.push(text.slice(lastIndex, matchStart));
        }

        parts.push(
            <Link
                href={linkUrl}
                key={linkUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='break-words underline underline-offset-2 text-gray'>
                {linkText}
            </Link>
        )

        lastIndex = matchEnd;
    }

    // check for lastIndex smaller than text length
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    console.log("text: ", text);
    console.log("parts: ", parts);

    // return react fragment so that we can assign a key to each fragment rendered
    return (
        <>
            {parts.map((part, i) => {
                <React.Fragment key={i}>{part}</React.Fragment>
                // <div key={i}>{JSON.stringify(part)}</div>
            })}
        </>
    )
}

export default MarkdownLite