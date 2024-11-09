'use server';

import db from '@/drizzle/db';
import { sessions } from '@/drizzle/schema';
import { decrypt } from '@/utils/session';
import { and, eq } from 'drizzle-orm';

export async function verifySession(token: string) {
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
