import { VercelRequest, VercelResponse } from '@vercel/node';
import postgres from 'postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const dbUrl = process.env.DATABASE_URL;

        if (!dbUrl) {
            return res.status(500).json({
                status: 'error',
                message: 'DATABASE_URL is missing from environment variables'
            });
        }

        const sql = postgres(dbUrl);
        const result = await sql`SELECT count(*) FROM videoaulas`;

        return res.status(200).json({
            status: 'ok',
            message: 'Connection successful',
            count: result[0].count,
            env: {
                node_env: process.env.NODE_ENV,
                has_url: true
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            details: error.message,
            stack: error.stack
        });
    }
}
