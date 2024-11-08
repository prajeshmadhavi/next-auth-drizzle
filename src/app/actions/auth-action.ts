'use server';

import db from '@/drizzle/db';
import { sessions } from '@/drizzle/schema';
import { decrypt, verifySession } from '@/utils/session';
import { setCookie } from 'cookies-next';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function setToken(token: string) {
  setCookie('token', token);
}

export async function logout() {
  setCookie('token', '');

  redirect('/');
}

export async function verifyToken(token: string) {
  const decoded = await decrypt(token);

  if (!decoded) {
    return null;
  }

  const userId = decoded.payload.userId;
  const sessionId = decoded.payload.sessionId;

  // Retrieve session from the database
  const session = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.sessionId, sessionId as string),
        eq(sessions.userId, userId as number),
      ),
    )
    .limit(1);

  if (session.length === 0) {
    return null; // Session not found or invalid
  }

  return session[0]; // Return session if valid
}

export async function checkValidToken(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return { isValid: false, error: 'Unauthorized' };
  }

  // Verify the session
  const session = await verifySession(token);

  if (!session) {
    return { isValid: false, error: 'Invalid session' };
  }

  return { isValid: true, session };
}
