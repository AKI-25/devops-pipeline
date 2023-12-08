import { createClient } from 'redis';
import { promisify } from 'util';
const client = await createClient({
    url: 'redis://votingDB:6379'
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
const incrAsync = promisify(client.incr).bind(client);

export default async function handler(req, res) {
    const option = req.body;
    if (!option) {
        return res.status(400).json({ error: 'Option not provided' });
    }
    try {
        const key = `votes:${option}`;
        const result = await incrAsync(key);
        res.status(200).json({ success: true, votes: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}