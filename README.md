This is a end-to-end typesaftey [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install all project dependencies:

```bash
npm run install
```
Second, run the following commands to generate `prisma` client and seed your `db`:
```
npx prisma generate && npx migrate dev && npx prisma seed db
```
after seeding your `db`, you'll have a default user to log into the app.

Last, start the project:
```
npm run dev
```

And that's it, to get your project up and running!
