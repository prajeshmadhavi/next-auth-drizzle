// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { deleteSession } from '@/utils/session';

export async function POST(req: Request) {
  // Extract the session ID (e.g., from cookies or authorization headers)
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Session ID missing' }, { status: 400 });
  }

  // Delete the session
  const result = await deleteSession(token);

  console.log('xxx', result);

  if (result) {
    return NextResponse.json({ message: 'Logged out successfully' });
  } else {
    return NextResponse.json(
      { error: 'Invalid or expired session' },
      { status: 401 },
    );
  }
}
