// app/api/protected/route.ts
import { NextResponse } from 'next/server';
import { verifySession } from '@/utils/session';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify the session
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  // Access granted; return protected resource
  return NextResponse.json({ message: 'Protected content', session });
}
