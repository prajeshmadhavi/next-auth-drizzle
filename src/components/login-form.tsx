'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setSession } from '@/app/actions/auth-action';

const formSchema = z.object({
  userwaregno: z.string().min(1, {
    message: 'Userware Registration Number is required.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    userwaregno: string;
    client_name: string;
    api_key: string;
  };
};

export function LoginForm() {
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userwaregno: '',
      password: '',
    },
  });

  // Mutation
  const { mutate, error, isPending } = useMutation({
    mutationFn: async (values: FormSchema) => {
      const response = await axios.post('/api/login', values);
      return response.data;
    },
    onSuccess: async (response: LoginResponse) => {
      await setSession(response.token, response.user);
      router.push('/dashboard');
    },
  });

  function onSubmit(values: FormSchema) {
    console.log(values);
    mutate(values);
  }

  console.log(error);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="userwaregno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Userware Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your userware registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                    {error && (
                      <FormMessage>
                        {
                          (
                            error as unknown as {
                              response: { data: { error: string } };
                            }
                          ).response.data.error
                        }
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Loading...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
