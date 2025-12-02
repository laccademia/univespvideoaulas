import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "./drizzle/schema";
import "dotenv/config";

async function checkData() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }

    console.log("Connecting to:", process.env.DATABASE_URL.split("@")[1]); // Log host only for safety

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema });

    try {
        const [videoaulasCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.videoaulas);
        const [cursosCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.cursos);
        const [disciplinasCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.disciplinas);

        console.log("\n--- Database Stats ---");
        console.log(`Videoaulas: ${videoaulasCount.count}`);
        console.log(`Cursos: ${cursosCount.count}`);
        console.log(`Disciplinas: ${disciplinasCount.count}`);
        console.log("----------------------\n");

    } catch (error) {
        console.error("Error querying database:", error);
    } finally {
        await client.end();
    }
}

checkData();
