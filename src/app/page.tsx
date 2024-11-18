'use client';

import CopyToClipboard from '@/components/copy-to-clipboard';
import { getCookie } from 'cookies-next/client';
import { GithubIcon, LockKeyholeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const githubUrl = 'https://github.com/faisalfjri/next-auth-drizzle';

  useEffect(() => {
    // Retrieve the token on client side after component mounts
    const token = getCookie('token');
    setToken(token as string);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="max-w-[480px] text-muted-foreground text-center md:text-md font-[family-name:var(--font-geist-mono)]">
          A Next.js Authentication starter template. Includes Drizzle, MySql,
          TanStack Query, TailwindCSS, shadcn/ui, zod and React Hook Form.
        </p>
        <div className="w-full max-w-[420px]">
          <CopyToClipboard
            title={`Clone Project`}
            text={'git clone ' + githubUrl}
          />
        </div>

        <div className="flex gap-4 items-center flex-row">
          {!token ? (
            <>
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-32 sm:min-w-44"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-32 sm:min-w-44"
                href="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
        >
          <LockKeyholeIcon className="w-5" />
          Protected Page
        </Link>
        ·
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/faisalfjri/next-auth-drizzle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="w-5" />
          GitHub
        </a>
      </footer>
    </div>
  );
}
