# Realtime Chatapp using React with AI ChatBot

## Tech Stack

    - React
    - TypeScript
    - Next.js
    - TailwindCSS
    - NextAuth (to handle OAuth)
    - WebSockets (Using Pusher)
    - Redis (Using Upstash)
    - OpenAI API (ChatGPT-3.5 Turbo for ChatBot)

## Generating own secret key for use in Next Auth decrypt of JWT

    - openssl genrsa 2048 in terminal
    - store in .env file

## Next.js Routing (Filebased System instead of Client Side)

    - /app/page.tsx: Default Page (localhost:3000/)
    Note: the (dashboard) or (auth) do not affect the endpoint url -> just helps with readability of codebase
    - /app/(dashboard)/dashboard/page.tsx: dashboard page (localhost:3000/dashboard)
    - /app/(auth)/login/page.tsx: login page (localhost:3000/login)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
