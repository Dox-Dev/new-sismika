import { MongoClient } from 'mongodb';
import { DatabaseConnectionError } from '$lib/model/src/errors';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

/**
 * Attempts to connect to the MongoDB client with the following information.
 * @returns connect
 */
async function connect() {
    try {
        await client.connect();
        return client.db('sismika');
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw DatabaseConnectionError;
    }
}

export { connect }

