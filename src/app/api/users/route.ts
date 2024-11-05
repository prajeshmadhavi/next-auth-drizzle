import db from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const users = await db.select().from(schema.users)
    return NextResponse.json(users)
}