// utils/session.ts
import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import db from '@/drizzle/db';
import { sessions, clients } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY);

const cookieConfig = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  },
  duration: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};

export async function encrypt(payload: {
  sessionId: string;
  userId: string;
  expires: Date;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function decrypt(session: string) {
  try {
    return await jwtVerify(session, secretKey, { algorithms: ['HS256'] });
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export async function createSession(userId: number) {
  const expires = new Date(Date.now() + cookieConfig.duration);
  const sessionId = uuidv4(); // Generate a unique session ID

  const session = await encrypt({
    sessionId,
    userId: userId.toString(),
    expires,
  });

  // Insert the session into the database
  await db.insert(sessions).values({
    sessionId,
    userId,
  });

  return session;
}

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

  // Get client data
  const client = await db
    .select({
      id: clients.id,
      client_name: clients.client,
      userwaregno: clients.userwaregno,
      api_key: clients.api_key,
    })
    .from(clients)
    .where(
      and(
        eq(clients.id, session[0].userId),
        eq(clients.status, 'active')
      )
    )
    .limit(1);

  if (client.length === 0) {
    return null; // Client not found or not active
  }

  return { ...session[0], client: client[0] };
}

export async function deleteSession(token: string) {
  const decoded = await decrypt(token);

  if (!decoded) {
    return false;
  }

  const userId = decoded.payload.userId;
  const sessionId = decoded.payload.sessionId;

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
    return false;
  }

  // Delete the session from the database
  await db
    .delete(sessions)
    .where(
      and(
        eq(sessions.sessionId, sessionId as string),
        eq(sessions.userId, userId as number),
      ),
    )
    .limit(1);

  return true;
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
