// app/api/protected/route.ts
import { checkValidToken } from '@/app/actions/auth-action';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { isValid, session, error } = await checkValidToken(req);

  if (!isValid) {
    return NextResponse.json({ error }, { status: 401 });
  }

  return NextResponse.json({ message: 'Protected content', session });
}
