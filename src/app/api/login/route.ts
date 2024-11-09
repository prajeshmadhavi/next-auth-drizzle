// app/api/login/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/utils/auth';
import { createSession } from '@/utils/session';
import { z } from 'zod';

// Define Zod schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
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

    const { email, password } = validationSchema.data;

    // Check if the user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'These credentials do not match our records.' },
        { status: 401 },
      );
    }

    const user = existingUser[0];

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'These credentials do not match our records.' },
        { status: 401 },
      );
    }

    // Create a session
    const token = await createSession(user.id);

    // Optionally set the session ID as a cookie (for frontend session management)
    return NextResponse.json({ message: 'Login successful', token, user });
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
