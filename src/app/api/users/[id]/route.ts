import { checkValidToken } from '@/app/actions/auth-action';
import db from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { isValid, error } = await checkValidToken(request);

  if (!isValid) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const userId = parseInt(id, 10);

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });
  return NextResponse.json(user);
}
