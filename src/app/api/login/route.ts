// app/api/login/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle/db';
import { clients } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { createSession } from '@/utils/session';
import { z } from 'zod';

// Define Zod schema for login
const loginSchema = z.object({
  userwaregno: z.string().min(1, 'Userware Registration Number is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
  try {
    // Validate request data
    const validationSchema = loginSchema.safeParse(await req.json());

    if (!validationSchema.success) {
      return NextResponse.json(
        { errors: validationSchema.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { userwaregno, password } = validationSchema.data;

    // Check if the client exists and is active
    const existingClient = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.userwaregno, userwaregno),
          eq(clients.status, 'active')
        )
      )
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json(
        { error: 'These credentials do not match our records.' },
        { status: 401 },
      );
    }

    const client = existingClient[0];

    // Verify password (plain text comparison)
    if (password !== client.password) {
      return NextResponse.json(
        { error: 'These credentials do not match our records.' },
        { status: 401 },
      );
    }

    // Create a session
    const token = await createSession(client.id);

    // Return response with client data
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: client.id,
        userwaregno: client.userwaregno,
        client_name: client.client,
        api_key: client.api_key,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
