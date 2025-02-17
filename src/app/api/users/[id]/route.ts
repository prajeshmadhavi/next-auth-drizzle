import db from '@/drizzle/db';
import { clients } from '@/drizzle/schema';
import { checkValidToken } from '@/utils/session';
import { and, eq } from 'drizzle-orm';
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

  const clientId = parseInt(id, 10);

  const client = await db.query.clients.findFirst({
    where: and(
      eq(clients.id, clientId),
      eq(clients.status, 'active')
    ),
    columns: {
      id: true,
      client: true,
      userwaregno: true,
      api_key: true,
    },
  });
  return NextResponse.json(client ? {
    ...client,
    client_name: client.client,
  } : null);
}
