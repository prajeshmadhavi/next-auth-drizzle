import { deleteCookie, setCookie } from 'cookies-next';
import { redirect } from 'next/navigation';

type User = {
  id: number;
  email: string;
  name: string;
};

export async function setSession(token: string, user: User) {
  setCookie('token', token);
  setCookie('user', user);
}

export async function removeSession() {
  deleteCookie('token');
  deleteCookie('user');

  redirect('/');
}
