# Appily Next

A powerful TypeScript coding agent that uses AI to generate and modify Next.js web projects based on natural language prompts. Built for both local development and cloud deployment.

Two ways to access the code generation experience:
1. Through the web app, available on https://www.appily.dev
2. Via the native mobile app, I just submitted to the App Store so it can take a few days.

## TLDR for the hackathon, if you should read one thing:

- The user enters a prompt, it will get enhanced with a checklist to refine the features
- This agent receives this enhanced prompt
- then it will git clone this Next.js template: [https://github.com/papay0/appily-template-next-js](https://github.com/papay0/appily-template-next-js)
- do 5 loops of code generation with LLM like
```
while (npm run build !== success && number of try <= 5) {
    new project files = await llm.send(files)
      .streamToFirebase()
    npm run lint --fix // just to fix the most basic warnings
    numner of try += 1
}
```
- upload the `out/` directory to R2 (Cloudflare)
- upload everything to firebase to that so that the web and mobile native client can have the streaming of the code gen, logs, messages, and metadata

## Demo

### Mobile

[![IMAGE ALT TEXT](http://img.youtube.com/vi/YMkLgnCzAD0/0.jpg)](http://www.youtube.com/watch?v=YMkLgnCzAD0 "
Appily mobile demo")

### Web

[![IMAGE ALT TEXT](http://img.youtube.com/vi/FRugepeYY9g/0.jpg)](http://www.youtube.com/watch?v=FRugepeYY9g "
Appily web demo")

## Link of the 4 repos
- [Appily-agent](https://github.com/papay0/nextjs-hackahton-appily-agent)
- [Appily-expo](https://github.com/papay0/nextjs-hackahton-appily-expo)
- [Appily-next](https://github.com/papay0/nextjs-hackahton-appily-next)
- [Appily-firebase](https://github.com/papay0/nextjs-hackahton-appily-firebase)

## More details

- I'm using Nextjs for the web client, using Shadcn for the UI
- I'm using Expo for the mobile app
- I'm generating Nextjs projects with Appily agent because it looks like it has the best LLM code gen results, and it's the easier to configure Shadcn and Claude Sonnet 3.7 understands it very well.
- I'm using Clerk for authentication with Google Auth
- I have 4 repos to make it works
  - Appily-agent: this one, hosted on a Google Cloud Run environment that auto-scales with amount of users
  - Appily-expo: the Expo mobile app code
  - Appily-next: the web client, with landing page + code gen
  - Appily-firebase: for Cloud Functions to enhance the prompt from the user
- I was initially using the AI SDK but found that it was hard to get good error handlings, too generic, and didn't find a good way to understand all the different errors from different models, so I switched to OpenRouter implementation using the OpenAI SDK

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
