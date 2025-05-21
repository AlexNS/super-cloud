import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import {RedisStore} from "connect-redis";
import {createClient} from "redis";

export default function sessionSetup(app) {
    // Initialize client.
    const redisClient = createClient()
    redisClient.connect().catch(console.error)

    // Initialize store.
    const redisStore = new RedisStore({
        client: redisClient,
        prefix: "myapp:",
    })

    app.use(cookieParser());
    app.use(expressSession({ secret: ';kljsdfjkl;sdf', resave: false, saveUninitialized: false, store: redisStore }));
}