import db from "@/drizzle/db";
import { clients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const clientsList = await db
        .select({
            id: clients.id,
            client_name: clients.client,
            userwaregno: clients.userwaregno,
            api_key: clients.api_key,
        })
        .from(clients)
        .where(eq(clients.status, 'active'));
    return NextResponse.json(clientsList)
}