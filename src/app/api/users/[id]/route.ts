import db from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const user = await db.query.users.findFirst({
        where: eq(schema.users.id, parseInt(params.id)),
        columns: {
            id: true,
            name: true,
            email: true,
        },
    });
    return NextResponse.json(user)
}