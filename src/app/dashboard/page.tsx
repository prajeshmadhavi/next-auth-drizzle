'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie, deleteCookie } from 'cookies-next';
import React from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Dashboard() {
  const token = getCookie('token');
  const user = JSON.parse((getCookie('user') as string) ?? '{}');
  const router = useRouter();
  console.log(token);

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post('/api/logout'),
    onSuccess: () => {
      console.log('logout success');
      router.push('/login');
      deleteCookie('token');
    },
  });

  const { data } = useQuery({
    queryKey: ['user', user],
    queryFn: () => api.get(`/api/users/${user?.id}`),
  });

  return (
    <div>
      <div>{data?.data.name}</div>
      <button onClick={() => logout()} type="button">
        Logout
      </button>
    </div>
  );
}
