'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type User = {
  id: number;
  email: string;
  name: string;
};

export async function setSession(token: string, user: User) {
  (await cookies()).set('token', token);
  (await cookies()).set('user', JSON.stringify(user));
}

export async function removeSession() {
  (await cookies()).delete('token');
  (await cookies()).delete('user');

  redirect('/');
}
