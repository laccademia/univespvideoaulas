import { createApp } from '../server/_core/index';

// Vercel Serverless Function Handler
export default async function handler(req, res) {
    const { app } = await createApp();
    app(req, res);
}
