'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import React, { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { removeSession } from '../actions/auth-action';
import { usePathname } from 'next/navigation';

export default function Dashboard() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const userStr = getCookie('user');
    if (userStr) {
      setUser(JSON.parse(userStr as string));
    }
  }, []);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/logout');
      return response.data;
    },
    onSuccess: () => {
      removeSession();
    },
  });

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={21}
                priority
              />
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'
                }`}
                href="/dashboard"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link className="flex items-center" href="/">
                <Image
                  className="dark:invert"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={100}
                  height={21}
                  priority
                />
              </Link>
              <div className="my-4 w-full">
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/dashboard"
                    className={`text-muted-foreground transition-colors hover:text-foreground ${
                      pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* <CommandMenu /> */}
            </div>
            <nav className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${user?.userwaregno}.png`}
                        alt={user?.client_name}
                      />
                      <AvatarFallback>
                        {user?.client_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.client_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.userwaregno}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto my-8 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.client_name}</p>
                <p><strong>Reg No:</strong> {user?.userwaregno}</p>
                <p><strong>API Key:</strong> {user?.api_key}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
