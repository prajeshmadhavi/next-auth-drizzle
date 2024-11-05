// app/api/register/route.ts
import { NextResponse } from 'next/server';
import db from '@/drizzle/db';
import { hashPassword } from '@/utils/auth';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/utils/session';
import { z } from 'zod';

// Define Zod schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(req: Request) {
  try {
    const validationSchema = registerSchema.safeParse(await req.json());

    if (!validationSchema.success) {
      return NextResponse.json(
        {
          errors: validationSchema.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validationSchema.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const data = await db
      .insert(users)
      .values({ name, email, password: hashedPassword });

    const userId = data[0].insertId; // Check if `data` includes the new ID
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    // console.log(user[0]); // Get t
    if (!user) {
      return NextResponse.json(
        { error: 'User registration failed' },
        { status: 500 },
      );
    }
    // 3. Create a session
    // await createSession(user.id);

    return NextResponse.json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
