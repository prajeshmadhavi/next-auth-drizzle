import { checkValidToken } from '@/utils/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { isValid, session, error } = await checkValidToken(req);

  if (!isValid) {
    return NextResponse.json({ error }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Protected content',
    session,
    client: session?.client,
  });
}
