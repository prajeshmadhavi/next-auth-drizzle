# Next.js + Drizzle Auth Starter

A Next.js Authentication starter template. Includes Drizzle, MySql, TanStack Query, TailwindCSS, shadcn/ui, zod and React Hook Form.

## Getting Started

copy the `.env.example` file to `.env`

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=next-drizzle

SESSION_SECRET_KEY=your-secret-key
```

Install dependencies

```bash
pnpm install
```

Generate the Drizzle

```
pnpm db:generate
```

Migrate Database with Drizzle

```
pnpm db:migrate
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Reference

- [Delba Youtube Channel](https://youtu.be/N_sUsq_y10U?si=HAwjMK-irISHpWpm) - Next.js: Authentication (Best Practices for Server Components, Actions, Middleware)
- [Next.js Documentation](https://nextjs.org/docs/app/building-your-application/authentication) - Authentication

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
