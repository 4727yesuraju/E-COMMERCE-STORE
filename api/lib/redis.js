import Redis from "ioredis"
import {config} from 'dotenv'
config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

//key -value store

// await client.set('fooi', 'bari');

// const data = await client.get('foo');

// console.log(data);

// process.exit(1);