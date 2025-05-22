import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbPort: process.env.DB_PORT ?? 5432,
    dbUser: process.env.DB_USER ?? 'postgres',
    dbPassword: process.env.DB_PASSWORD ?? 'postgres',
    dbDatabaseName: process.env.DB_DATABASE ?? 'sc',
};

export default config;