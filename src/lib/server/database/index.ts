import { MongoClient, ObjectId, Binary, ServerApiVersion } from 'mongodb';
import { DatabaseConnectionError } from '$lib/model/src/errors';
import {
	EarthquakeEventSchema,
	type EarthquakeEvent,
	type EarthquakeFilters
} from '$lib/model/src/event';
import { calculateDistanceinMeters, Collection, type Coordinates } from '$lib/model/src/util';
import { EvacCenterSchema, type EvacCenter } from '$lib/model/src/evac';
import { StationSchema } from '$lib/model/src/station';
import { PendingSchema, SessionSchema } from '../model/session';
import { v4 as uuidv4 } from 'uuid';
import { randomFillSync } from 'crypto';
import { ok } from 'assert';
import { UserSchema, type User } from '$lib/model/src/user';
import { z } from 'zod';
import type { Session } from '$lib/server/model/session';
import { MediaSchema, type Media } from '$lib/model/src/posts';
import { LocationData } from '$lib/model/src/locations';
import MongoEnv from '$lib/model/src/env/mongodb';

const { MONGODB_CONNECTION_STRING } = MongoEnv;
const uri = MONGODB_CONNECTION_STRING;
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});
interface PipelineType extends Array<Record<string, any>> {}

/**
 * Connects to the MongoDB client and returns the database object for the specified database.
 *
 * This function attempts to establish a connection to the MongoDB server using the provided client instance.
 * Upon successful connection, it returns the database object for the 'sismika' database.
 * If the connection fails, it logs the error and throws a custom `DatabaseConnectionError`.
 *
 * @async
 * @function connect
 * @returns {Promise<Db>} A promise that resolves to the MongoDB database object for 'sismika'.
 * @throws {Error} Throws `DatabaseConnectionError` if the connection to MongoDB fails.
 */
async function connect() {
	try {
		// Attempt to establish a connection to the MongoDB server.
		await client.connect();
		
		// Uncomment the following line to log a successful connection message for debugging purposes.
		// console.log(`Connected to ${uri}`);
		
		// Return the database object for the 'sismika' database.
		return client.db('sismika');
	} catch (err) {
		// Log the connection error for debugging purposes.
		console.error('MongoDB connection error:', err);
		
		// Throw a custom error to indicate a failure in establishing a database connection.
		throw DatabaseConnectionError;
	}
}
/**
 * Adds a validated EarthquakeEvent to the MongoDB database.
 * @param {EarthquakeEvent} data - An object containing validated earthquake event data.
 * @returns {Promise<ObjectId>} The ObjectId of the inserted document.
 * @throws Will throw an error if there is an issue with the database operation.
 */
export async function addEarthquakeData(data: EarthquakeEvent): Promise<ObjectId> {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EARTHQUAKE);

		const { _id, ...entry } = data;

		const { insertedId } = await collection.insertOne(entry);
		return insertedId;
	} catch (err) {
		throw err;
	}
}


/**
 * Gets all EarthquakeEvents from the MongoDB database with optional pagination and filtering.
 * @param {number} [page] - The page number for pagination (0-indexed).
 * @param {number} [limit] - The number of items per page for pagination.
 * @param {EarthquakeFilters} [filter] - Optional filters for querying earthquake events.
 * @returns {Promise<{ equakes: EarthquakeEventSchema[], totalCount: number }>} An object containing an array of validated EarthquakeEvents and the total count of events.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const filters = {
 *   minDepth: 10,
 *   maxDepth: 100,
 *   minIntensity: 4.0,
 *   maxIntensity: 6.0,
 *   minTime: '2022-01-01T00:00:00Z',
 *   maxTime: '2023-01-01T00:00:00Z',
 *   geographicBound: {
 *     coordinates: [
 *       [longitude1, latitude1],
 *       [longitude2, latitude2],
 *       [longitude3, latitude3],
 *       [longitude4, latitude4]
 *     ]
 *   },
 *   orderDepth: true,
 *   orderIntensity: false,
 *   orderTime: true
 * };
 * 
 * try {
 *   const { equakes, totalCount } = await getAllEarthquakeData(0, 10, filters);
 *   console.log('Earthquakes:', equakes);
 *   console.log('Total count:', totalCount);
 * } catch (error) {
 *   console.error('Error getting earthquake data:', error);
 * }
 * ```
 */
export async function getAllEarthquakeData(
	page?: number,
	limit?: number,
	filter?: EarthquakeFilters
) {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);

	let matchConditions: Record<string, object> = {};
	if (filter) {
		if (filter.minDepth !== undefined) matchConditions['depth'] = { $gte: filter.minDepth };
		if (filter.maxDepth !== undefined) matchConditions['depth'] = { $lte: filter.maxDepth };
		if (filter.minIntensity !== undefined) matchConditions['mw'] = { $gte: filter.minIntensity };
		if (filter.maxIntensity !== undefined) matchConditions['mw'] = { $lte: filter.maxIntensity };
		if (filter.minTime !== undefined)
			matchConditions['time'] = { $gte: new Date(filter.minTime).toISOString() };
		if (filter.maxTime !== undefined)
			matchConditions['time'] = { $lte: new Date(filter.maxTime).toISOString() };
		if (filter.geographicBound !== undefined) {
			matchConditions['coord'] = {
				$geoWithin: {
					$geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[
									filter.geographicBound.coordinates[0][0],
									filter.geographicBound.coordinates[0][1]
								],
								[
									filter.geographicBound.coordinates[2][0],
									filter.geographicBound.coordinates[2][1]
								],
								[
									filter.geographicBound.coordinates[3][0],
									filter.geographicBound.coordinates[3][1]
								],
								[
									filter.geographicBound.coordinates[1][0],
									filter.geographicBound.coordinates[1][1]
								],
								[filter.geographicBound.coordinates[0][0], filter.geographicBound.coordinates[0][1]] // Closing the loop
							]
						]
					}
				}
			};
		}
	}

	let sortConditions: Record<string, number> = {};
	if (filter && filter.orderDepth) sortConditions['depth'] = 1;
	if (filter && filter.orderIntensity) sortConditions['mi'] = 1;
	if (filter && filter.orderTime) sortConditions['time'] = 1;

	let pipeline: PipelineType = [];

	if (Object.keys(matchConditions).length > 0) {
		pipeline = [...pipeline, { $match: matchConditions }];
	}
	if (Object.keys(sortConditions).length > 0) {
		pipeline = [...pipeline, { $sort: sortConditions }];
	}

	pipeline = [
		...pipeline,
		{ $addFields: { _id: { $toString: '$_id' } } },
		{
			$facet: {
				paginatedResults: [
					...(page !== undefined && limit !== undefined
						? [{ $skip: page * limit }, { $limit: limit }]
						: [])
				],
				totalCount: [{ $count: 'total' }]
			}
		}
	];

	const [{ paginatedResults, totalCount }] = await collection.aggregate(pipeline).toArray();
	try {
		return {
			equakes: EarthquakeEventSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0
		};
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Gets a specific EarthquakeEvent from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the earthquake event to retrieve.
 * @returns {Promise<EarthquakeEventSchema | false>} The validated EarthquakeEvent if found, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 */
export async function getEarthquakeData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: { _id: id } },
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	];

	const collection = db.collection(Collection.EARTHQUAKE);

	const [first, ...rest] = await collection.aggregate(pipeline).toArray();
	if (!first) return false;

	try {
		return EarthquakeEventSchema.parse(first);
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Deletes a specific EarthquakeEvent from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the earthquake event to delete.
 * @returns {Promise<number>} The number of documents deleted (0 if none were deleted).
 * @throws Will throw an error if there is an issue with the database operation.
 */
export async function deleteEarthquakeData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EARTHQUAKE);
		const { deletedCount } = await collection.deleteOne({ _id: id });
		return deletedCount;
	} catch (err) {
		throw err;
	}
}

/**
 * Gets all Station data from the MongoDB database with optional pagination.
 * @param {number} [page] - The page number for pagination (0-indexed).
 * @param {number} [limit] - The number of items per page for pagination.
 * @returns {Promise<{ stations: StationSchema[], totalCount: number }>} An object containing an array of validated Stations and the total count of stations.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 */
export async function getAllStationData(page?: number, limit?: number) {
	const db = await connect();

	let pipeline: PipelineType = [
		{
			$addFields: { _id: { $toString: '$_id' } }
		},
		{
			$facet: {
				paginatedResults: [
					...(page !== undefined && limit !== undefined
						? [{ $skip: page * limit }, { $limit: limit }]
						: [])
				],
				totalCount: [{ $count: 'total' }]
			}
		}
	];

	const collection = db.collection(Collection.STATION);
	const [{ paginatedResults, totalCount }] = await collection.aggregate(pipeline).toArray();

	try {
		return {
			stations: StationSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0
		};
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Adds a validated Station data entry to the MongoDB database.
 * @param {StationSchema} data - An object containing validated station data.
 * @returns {Promise<ObjectId>} The ObjectId of the inserted document.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 */
export async function addStationData(data: StationSchema) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Deletes a specific Station data entry from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the station data entry to delete.
 * @returns {Promise<number>} The number of documents deleted (0 if none were deleted).
 * @throws Will throw an error if there is an issue with the database operation.
 */
export async function deleteStationData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Gets a specific Station data entry from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the station data entry to retrieve.
 * @returns {Promise<StationSchema | false>} The validated Station data entry if found, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const id = new ObjectId("60c72b2f9b1d8b3b4c4e5d7a");
 * 
 * try {
 *   const station = await getStationData(id);
 *   if (station) {
 *     console.log('Station:', station);
 *   } else {
 *     console.log('No Station found with the given ID.');
 *   }
 * } catch (error) {
 *   console.error('Error retrieving station data:', error);
 * }
 * ```
 */
export async function getStationData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: { _id: id } },
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	];

	const collection = db.collection(Collection.STATION);

	const [first, ...rest] = await collection.aggregate(pipeline).toArray();

	if (!first) return false;

	try {
		return StationSchema.parse(first);
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Gets all Evacuation Center data from the MongoDB database with optional pagination.
 * @param {number} [page] - The page number for pagination (0-indexed).
 * @param {number} [limit] - The number of items per page for pagination.
 * @returns {Promise<{ evacs: EvacCenterSchema[], totalCount: number }>} An object containing an array of validated Evacuation Centers and the total count of centers.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * try {
 *   const { evacs, totalCount } = await getAllEvacData(0, 10);
 *   console.log('Evacuation Centers:', evacs);
 *   console.log('Total count:', totalCount);
 * } catch (error) {
 *   console.error('Error getting evacuation center data:', error);
 * }
 * ```
 */
export async function getAllEvacData(page?: number, limit?: number) {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);

	let pipeline: PipelineType = [
		{
			$addFields: { _id: { $toString: '$_id' } }
		},
		{
			$facet: {
				paginatedResults: [
					...(page !== undefined && limit !== undefined
						? [{ $skip: page * limit }, { $limit: limit }]
						: [])
				],
				totalCount: [{ $count: 'total' }]
			}
		}
	];
	const [{ paginatedResults, totalCount }] = await collection.aggregate(pipeline).toArray();
	try {
		return {
			evacs: EvacCenterSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.total) : 0
		};
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Adds a validated Evacuation Center data entry to the MongoDB database.
 * @param {EvacCenter} data - An object containing validated evacuation center data.
 * @returns {Promise<ObjectId>} The ObjectId of the inserted document.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const evacCenter = {
 *   name: "Evac Center 1",
 *   location: "Location 1",
 *   capacity: 500,
 *   // other evacuation center properties
 * };
 * 
 * try {
 *   const insertedId = await addEvacData(evacCenter);
 *   console.log('Inserted ID:', insertedId);
 * } catch (error) {
 *   console.error('Error inserting evacuation center data:', error);
 * }
 * ```
 */
export async function addEvacData(data: EvacCenter) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Deletes a specific Evacuation Center data entry from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the evacuation center data entry to delete.
 * @returns {Promise<number>} The number of documents deleted (0 if none were deleted).
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const id = new ObjectId("60c72b2f9b1d8b3b4c4e5d7a");
 * 
 * try {
 *   const deletedCount = await deleteEvacData(id);
 *   console.log('Number of documents deleted:', deletedCount);
 * } catch (error) {
 *   console.error('Error deleting evacuation center data:', error);
 * }
 * ```
 */
export async function deleteEvacData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Gets a specific Evacuation Center data entry from the MongoDB database by its ObjectId.
 * @param {ObjectId} id - The ObjectId of the evacuation center data entry to retrieve.
 * @returns {Promise<EvacCenterSchema | false>} The validated Evacuation Center data entry if found, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const id = new ObjectId("60c72b2f9b1d8b3b4c4e5d7a");
 * 
 * try {
 *   const evacCenter = await getEvacData(id);
 *   if (evacCenter) {
 *     console.log('Evacuation Center:', evacCenter);
 *   } else {
 *     console.log('No Evacuation Center found with the given ID.');
 *   }
 * } catch (error) {
 *   console.error('Error retrieving evacuation center data:', error);
 * }
 * ```
 */
export async function getEvacData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: { _id: id } },
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	];

	const collection = db.collection(Collection.EVAC);
	const [first, ...rest] = await collection.aggregate(pipeline).toArray();

	if (!first) return false;
	try {
		return EvacCenterSchema.parse(first);
	} catch (err) {
		console.error('Validation error:', err);
		throw err;
	}
}

/**
 * Creates a new pending session entry in the MongoDB database.
 * @returns {Promise<PendingSchema>} The validated pending session entry.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * try {
 *   const pendingSession = await createPending();
 *   console.log('Pending session created:', pendingSession);
 * } catch (error) {
 *   console.error('Error creating pending session:', error);
 * }
 * ```
 */
export async function createPending() {
	const db = await connect();

	const randomnonce = new Uint8Array(8);
	randomFillSync(randomnonce);
	const genPending = {
		session_id: uuidv4(),
		expiration: Date.now() + 15 * 60 * 1000,
		nonce: randomnonce
	};
	const parsedPending = PendingSchema.parse(genPending);
	try {
		const collection = db.collection(Collection.PENDINGS);
		const { _id, ...entry } = parsedPending;
		const { insertedId } = await collection.insertOne(entry);

		ok(insertedId);
		return entry;
	} catch (err) {
		throw err;
	}
}

/**
 * Deletes a pending session entry from the MongoDB database by its session ID.
 * @param {string} sid - The session ID of the pending session to delete.
 * @returns {Promise<PendingSchema | false>} The validated pending session entry if found and deleted, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const sessionId = "some-session-id";
 * 
 * try {
 *   const deletedSession = await deletePending(sessionId);
 *   if (deletedSession) {
 *     console.log('Deleted pending session:', deletedSession);
 *   } else {
 *     console.log('No pending session found with the given session ID.');
 *   }
 * } catch (error) {
 *   console.error('Error deleting pending session:', error);
 * }
 * ```
 */
export async function deletePending(sid: string) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.PENDINGS);
		const session = await collection.findOneAndDelete({ session_id: sid });

		if (session === null) return false;
		if (!(session.nonce instanceof Binary)) return false;
		session.nonce = session.nonce.read(0, 64);
		return PendingSchema.parse(session);
	} catch (err) {
		throw err;
	}
}

/**
 * Upserts a user data entry in the MongoDB database. If the user exists, the data is updated; otherwise, a new entry is created.
 * @param {User} data - An object containing the user data to upsert.
 * @returns {Promise<boolean>} Returns true if the operation is successful.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const userData = {
 *   user_id: "12345",
 *   name: "John Doe",
 *   email: "john.doe@example.com",
 *   // other user properties
 * };
 * 
 * try {
 *   const result = await upsertUser(userData);
 *   console.log('Upsert successful:', result);
 * } catch (error) {
 *   console.error('Error upserting user data:', error);
 * }
 * ```
 */
export async function upsertUser(data: User) {
	const db = await connect();

	try {
		let pipeline: PipelineType = [
			{
				$match: {user_id: data.user_id}
			},
			{
				$addFields: {
					new_data: {
						$mergeObjects: [
							{permission: 0},
							"$$ROOT",
							data,
							{permission: "$permission"}
						]
					}
				}
			},
			{ $replaceRoot: { newRoot: "$new_data"}},
			{
				$merge: {
					into: Collection.USERS,
					on: "_id",
					whenMatched: "replace",
					whenNotMatched: "insert"
				}
			}
		]
		
		const collection = db.collection(Collection.USERS);
		const res = await collection.aggregate(pipeline).toArray()
		return true
	} catch (err) {
		throw err;
	}
}

/**
 * Upgrades or inserts a session entry in the MongoDB database. If a session with the given user ID exists, it is replaced; otherwise, a new session is created.
 * @param {Session} data - An object containing the session data to upsert.
 * @returns {Promise<boolean>} Returns true if the session is successfully upserted or upgraded, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const sessionData = {
 *   user_id: "12345",
 *   session_token: "token123",
 *   expiration: new Date(Date.now() + 3600 * 1000), // 1 hour from now
 *   // other session properties
 * };
 * 
 * try {
 *   const result = await upgradeSession(sessionData);
 *   console.log('Session upgrade successful:', result);
 * } catch (error) {
 *   console.error('Error upgrading session:', error);
 * }
 * ```
 */
export async function upgradeSession(data: Session) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.SESSIONS);
		const { matchedCount, upsertedId } = await collection.replaceOne(
			{ user_id: data.user_id },
			data,
			{ upsert: true }
		);

		if (matchedCount || upsertedId) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

/**
 * Deletes a session entry from the MongoDB database by its session ID.
 * @param {string} sid - The session ID of the session to delete.
 * @returns {Promise<boolean>} Returns true if the session was successfully deleted, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const sessionId = "session-id-12345";
 * 
 * try {
 *   const result = await deleteSession(sessionId);
 *   console.log('Session deletion successful:', result);
 * } catch (error) {
 *   console.error('Error deleting session:', error);
 * }
 * ```
 */
export async function deleteSession(sid: string) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.SESSIONS);
		const { deletedCount } = await collection.deleteOne({ session_id: sid });

		if (deletedCount) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves a user based on the provided session ID. First, it fetches the session to get the user ID, then retrieves the corresponding user data.
 * @param {string} sid - The session ID used to find the associated user.
 * @returns {Promise<User | false>} Returns the user data if found and valid, otherwise returns false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const sessionId = "session-id-12345";
 * 
 * try {
 *   const user = await getUserFromSession(sessionId);
 *   if (user) {
 *     console.log('User retrieved:', user);
 *   } else {
 *     console.log('Session or user not found.');
 *   }
 * } catch (error) {
 *   console.error('Error retrieving user from session:', error);
 * }
 * ```
 */
export async function getUserFromSession(sid: string) {
	const db = await connect();

	try {
		const sessioncol = db.collection(Collection.SESSIONS);
		const sessionPointer = await sessioncol.findOne({ session_id: sid });

		//find session
		if (sessionPointer === null) return false;
		const { user_id } = SessionSchema.parse(sessionPointer);

		const usercol = db.collection(Collection.USERS);
		const userPointer = await usercol.findOne({ user_id: user_id });

		if (userPointer === null) return false;
		console.log(userPointer)
		return UserSchema.parse(userPointer);
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves media entries related to a specific earthquake from the MongoDB database, with optional pagination.
 * @param {ObjectId} equakeId - The ID of the earthquake to retrieve media for.
 * @param {number} [page] - The page number for pagination (optional).
 * @param {number} [limit] - The number of items per page for pagination (optional).
 * @returns {Promise<{ articles: Media[], totalCount: number }>} An object containing an array of media articles and the total count of media entries.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const earthquakeId = new ObjectId("60c72b2f5f1b2c001c8d4e44");
 * const page = 1;
 * const limit = 10;
 * 
 * try {
 *   const result = await getMediaForEarthquake(earthquakeId, page, limit);
 *   console.log('Media articles:', result.articles);
 *   console.log('Total count:', result.totalCount);
 * } catch (error) {
 *   console.error('Error retrieving media for earthquake:', error);
 * }
 * ```
 */
export async function getMediaForEarthquake(equakeId: ObjectId, page?: number, limit?: number) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.MEDIA);

		let pipeline: PipelineType = [
			{ $match: { equakeId: equakeId } },
			{ $addFields: { _id: { $toString: '$_id' }, equakeId: { $toString: '$equakeId' } } },
			{
				$facet: {
					paginatedResults: [
						...(page !== undefined && limit !== undefined
							? [{ $limit: limit }, { $skip: page * limit }]
							: [])
					],
					totalCount: [{ $count: 'total' }]
				}
			}
		];

		const [{ paginatedResults, totalCount }] = await collection.aggregate(pipeline).toArray();

		return {
			articles: MediaSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.count) : 0
		};
	} catch (err) {
		console.error(err);
		throw err;
	}
}

/**
 * Deletes a media entry from the MongoDB database by its media ID.
 * @param {ObjectId} mediaId - The ID of the media entry to delete.
 * @returns {Promise<boolean>} Returns true if the media entry was successfully deleted, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const mediaId = new ObjectId("60c72b2f5f1b2c001c8d4e44");
 * 
 * try {
 *   const result = await deleteMedia(mediaId);
 *   console.log('Media deletion successful:', result);
 * } catch (error) {
 *   console.error('Error deleting media:', error);
 * }
 * ```
 */
export async function deleteMedia(mediaId: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.MEDIA);
		const { deletedCount } = await collection.deleteOne({ _id: mediaId });

		if (deletedCount) return true;
		return false;
	} catch (err) {
		throw err;
	}
}

/**
 * Inserts a new media entry into the MongoDB database.
 * @param {Media} media - The media object to be inserted.
 * @returns {Promise<ObjectId>} The ObjectId of the inserted media entry.
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const media = {
 *   title: "Earthquake Coverage",
 *   description: "Detailed report on the recent earthquake.",
 *   url: "http://example.com/earthquake-coverage",
 *   equakeId: new ObjectId("60c72b2f5f1b2c001c8d4e44"),
 *   // other media fields...
 * };
 * 
 * try {
 *   const insertedId = await postMedia(media);
 *   console.log('Media inserted with ID:', insertedId);
 * } catch (error) {
 *   console.error('Error posting media:', error);
 * }
 * ```
 */
export async function postMedia(media: Media) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.MEDIA);
		const { _id, ...payload } = media;
		const { insertedId } = await collection.insertOne(payload);

		return insertedId;
	} catch (err) {
		throw err;
	}
}


export async function collateNearbyLocations(equakeId: ObjectId, limit?: number, page?: number) {
	const db = await connect();

	try {
		const earthquakeTable = db.collection(Collection.EARTHQUAKE);
		const event = await earthquakeTable.findOne({ _id: equakeId });

		const parsedEarthquake = EarthquakeEventSchema.parse(event);
		const { coord } = parsedEarthquake;
		const distanceMeters = await retrieveFurthestIntensityRadius(equakeId);

		const pipeline: PipelineType = [
			{
				$match: {
					coord: {
						$geoWithin: {
							$centerSphere: [coord.coordinates, distanceMeters / 6378137]
						}
					}
				}
			},
			{
				$project: { osmresult: 0, _id: 0 }
			},
			{
				$facet: {
					paginatedResults: [
						...(page !== undefined && limit !== undefined
							? [{ $skip: limit * page }, { $limit: limit }]
							: [])
					],
					totalCount: [{ $count: 'total' }],
					totalPopulation: [
						{ $match: { geographicLevel: 'Bgy' } },
						{ $group: { _id: null, sumPopulation: { $sum: '$population' } } }
					]
				}
			}
		];
		const locationTable = db.collection(Collection.LOCATION);
		const [{ paginatedResults, totalCount, totalPopulation }] = await locationTable
			.aggregate(pipeline)
			.toArray();


		return {
			locations: LocationData.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0,
			totalPopulation: totalPopulation[0]?.sumPopulation
				? z.number().parse(totalPopulation[0]?.sumPopulation)
				: 0
		};
	} catch (err) {
		console.error(err);
		throw err;
	}
}

/**
 * Collates nearby locations for a given earthquake based on its coordinates and the furthest intensity radius.
 * @param {ObjectId} equakeId - The ID of the earthquake to find nearby locations for.
 * @param {number} [limit] - The number of items per page for pagination (optional).
 * @param {number} [page] - The page number for pagination (optional).
 * @returns {Promise<{ locations: LocationData[], totalCount: number, totalPopulation: number }>} An object containing an array of nearby locations, the total count of locations, and the total population of the matched locations.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const earthquakeId = new ObjectId("60c72b2f5f1b2c001c8d4e44");
 * const page = 1;
 * const limit = 10;
 * 
 * try {
 *   const result = await collateNearbyLocations(earthquakeId, limit, page);
 *   console.log('Nearby locations:', result.locations);
 *   console.log('Total count of locations:', result.totalCount);
 *   console.log('Total population of matched locations:', result.totalPopulation);
 * } catch (error) {
 *   console.error('Error collating nearby locations:', error);
 * }
 * ```
 */
export async function collateNearbyEarthquakes(
	code: string,
	distanceMeters: number,
	limit?: number,
	page?: number
) {
	const db = await connect();

	try {
		const locationTable = db.collection(Collection.LOCATION);
		const loc = await locationTable.findOne(
			{ psgc: code },
			{ projection: { osmresult: 0, _id: 0 } }
		);

		const parsedLoc = LocationData.parse(loc);
		const { coord } = parsedLoc;

		const earthquakeQuery = {
			coord: {
				$near: {
					$geometry: coord,
					$maxDistance: distanceMeters
				}
			}
		};

		const earthquakeTable = db.collection(Collection.EARTHQUAKE);

		let equakeResults = earthquakeTable.find(earthquakeQuery, {
			projection: { _id: { $toString: '$_id' } }
		});
		if (limit && page) equakeResults.skip((page - 1) * limit).limit(limit);

		const equakePointer = await equakeResults.toArray();

		if (equakePointer.length === 0) return [];
		return EarthquakeEventSchema.array().parse(equakePointer);
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves the furthest intensity radius for a given earthquake based on its magnitude, depth, and other properties.
 * @param {ObjectId} equakeId - The ID of the earthquake to calculate the intensity radius for.
 * @returns {Promise<number>} The calculated furthest intensity radius in meters.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const earthquakeId = new ObjectId("60c72b2f5f1b2c001c8d4e44");
 * 
 * try {
 *   const radius = await retrieveFurthestIntensityRadius(earthquakeId);
 *   console.log('Furthest intensity radius:', radius);
 * } catch (error) {
 *   console.error('Error retrieving intensity radius:', error);
 * }
 * ```
 */
export async function retrieveFurthestIntensityRadius(equakeId: ObjectId) {
	const db = await connect();

	try {
		const earthquakeCollection = db.collection(Collection.EARTHQUAKE);
		const earthquake = await earthquakeCollection.findOne({ _id: equakeId });

		const parsedEvent = EarthquakeEventSchema.parse(earthquake);
		const { coord, mw, li, depth } = parsedEvent;

		const baseRadius = Math.pow(10, 0.5 * mw - 1.8);
		const depthFactor = 1 + depth / 100;
		return Math.floor(baseRadius * depthFactor * 1000);
		// let matchHit = false
		// const regex = /INTENSITY [XIV]*\s?-\s?(.*?)(?=; INTENSITY|$)/gi
		// const results = {};
		// let match;

		// const locationTable = db.collection(Collection.LOCATION);

		// while ((match = regex.exec(li)) !== null) {
		// 	matchHit = true;
		// 	const intensity = match[1];
		// 	const locations = match[2].split(/;|,|&/,).map(loc => loc.trim()).filter(loc => loc !== '')

		// 	for (const location of locations) {
		// 		const searchResult = locationTable.findOne({
		// 			$text: {$search: location},
		// 		},{
		// 			projection: {coord: 1}
		// 		}
		// 		).
		// 	}
		// 	//get the location string of every in
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves provincial locations from the MongoDB database with optional pagination.
 * @param {number} [page] - The page number for pagination (optional).
 * @param {number} [limit] - The number of items per page for pagination (optional).
 * @returns {Promise<{ location: LocationData[], totalCount: number }>} An object containing an array of provincial locations and the total count of locations.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const page = 1;
 * const limit = 10;
 * 
 * try {
 *   const result = await getProvincialLocations(page, limit);
 *   console.log('Provincial locations:', result.location);
 *   console.log('Total count of locations:', result.totalCount);
 * } catch (error) {
 *   console.error('Error retrieving provincial locations:', error);
 * }
 * ```
 */
export async function getProvincialLocations(page?: number, limit?: number) {
	const db = await connect();

	try {
		const locationCollection = db.collection(Collection.LOCATION);

		let pipeline: PipelineType = [
			{
				$match: { geographicLevel: 'Prov' }
			},
			{ $addFields: { _id: { $toString: '$_id' } } },
			{
				$project: { osmresult: 0, _id: 0 }
			},
			{
				$facet: {
					paginatedResults: [
						...(page !== undefined && limit !== undefined
							? [{ $skip: page * limit }, { $limit: limit }]
							: [])
					],
					totalCount: [{ $count: 'count' }]
				}
			}
		];

		const [{ paginatedResults, totalCount }] = await locationCollection
			.aggregate(pipeline)
			.toArray();
		return {
			location: LocationData.omit({ osmresult: true, _id: true }).array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.count) : 0
		};
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves a location from the MongoDB database based on the provided PSGC code.
 * @param {string} psgc - The PSGC code of the location to retrieve.
 * @returns {Promise<LocationData | false>} The validated location data if found, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const psgcCode = "1234567890";
 * 
 * try {
 *   const location = await getLocationFromPSGC(psgcCode);
 *   if (location) {
 *     console.log('Location retrieved:', location);
 *   } else {
 *     console.log('No location found with the given PSGC code.');
 *   }
 * } catch (error) {
 *   console.error('Error retrieving location from PSGC:', error);
 * }
 * ```
 */
export async function getLocationFromPSGC(psgc: string) {
	const db = await connect();

	try {
		const locationCollection = db.collection(Collection.LOCATION);

		const pipeline: PipelineType = [{ $match: { psgc: psgc } }, { $project: { _id: 0 } }];

		const [first, ...rest] = await locationCollection.aggregate(pipeline).toArray();

		if (!first) return false;

		return LocationData.parse(first);
	} catch (err) {
		console.error(err);
		throw err;
	}
}

/**
 * Retrieves users from the MongoDB database, categorizing them by their permission levels.
 * @returns {Promise<{ user: User[], researcher: User[], admin: User[] }>} An object containing arrays of users categorized by their permission levels.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * try {
 *   const users = await getUsers();
 *   console.log('Regular users:', users.user);
 *   console.log('Researchers:', users.researcher);
 *   console.log('Admins:', users.admin);
 * } catch (error) {
 *   console.error('Error retrieving users:', error);
 * }
 * ```
 */
export async function getUsers() {
	const db = await connect();

	const userCollection = db.collection(Collection.USERS);
	const pipeline: PipelineType = [
		{
			$facet: {
				user: [{ $match: { permission: 0 } }],
				researcher: [{ $match: { permission: 1 } }],
				admin: [{ $match: { permission: 2 } }]
			}
		}
	];

	try {
		const [{ user, researcher, admin }] = await userCollection.aggregate(pipeline).toArray();

		return {
			user: UserSchema.array().parse(user),
			researcher: UserSchema.array().parse(researcher),
			admin: UserSchema.array().parse(admin)
		};
	} catch (err) {
		console.error('Error occured:', err);
		throw err;
	}
}

/**
 * Deletes a user from the MongoDB database by their user ID.
 * @param {string} user - The user ID of the user to delete.
 * @returns {Promise<boolean>} Returns true if the user was successfully deleted, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const userId = "12345";
 * 
 * try {
 *   const result = await deleteUser(userId);
 *   console.log('User deletion successful:', result);
 * } catch (error) {
 *   console.error('Error deleting user:', error);
 * }
 * ```
 */
export async function deleteUser(user: string) {
	const db = await connect();

	const userCollection = db.collection(Collection.USERS);
	const { deletedCount } = await userCollection.deleteOne({ user_id: user });
	if (deletedCount) return true;
	return false;
}

/**
 * Updates the permissions of a user in the MongoDB database.
 * @param {string} user - The user ID of the user whose permissions are to be updated.
 * @param {number} perm - The new permission level to be set.
 * @returns {Promise<boolean>} Returns true if the permissions were successfully updated, otherwise false.
 * @throws Will throw an error if there is an issue with the database operation.
 * 
 * @example
 * ```typescript
 * const userId = "12345";
 * const newPermissionLevel = 1;
 * 
 * try {
 *   const result = await updatePermissions(userId, newPermissionLevel);
 *   console.log('Permission update successful:', result);
 * } catch (error) {
 *   console.error('Error updating permissions:', error);
 * }
 * ```
 */
export async function updatePermissions(user: string, perm: number) {
	const db = await connect();

	try {
		const userCollection = db.collection(Collection.USERS);
		const { modifiedCount } = await userCollection.updateOne(
			{ user_id: user },
			{ $set: { permission: perm } }
		);
		if (modifiedCount) return true;
		return false;
	} catch (err) {
		console.error('Error occured', err);
		throw err;
	}
}

/**
 * Resolves a descriptive title for an earthquake based on the provided coordinates.
 * The title includes the distance and cardinal direction from a nearby location.
 * @param {Coordinates} locCoord - The coordinates of the earthquake.
 * @returns {Promise<string>} A string describing the distance and direction from the nearest location.
 * @throws Will throw an error if there is an issue with the database operation or data validation.
 * 
 * @example
 * ```typescript
 * const earthquakeCoord = {
 *   type: "Point",
 *   coordinates: [123.456, -23.456]
 * };
 * 
 * try {
 *   const title = await resolveEarthquakeTitle(earthquakeCoord);
 *   console.log('Earthquake title:', title);
 * } catch (error) {
 *   console.error('Error resolving earthquake title:', error);
 * }
 * ```
 */
export async function resolveEarthquakeTitle(locCoord: Coordinates) {
	const db = await connect();

	try {
		const pipeline: PipelineType = [
			{
				$geoNear: {
					near: locCoord,
					distanceField: 'distance',
					includeLocs: 'coord',
					spherical: true
				}
			},
			{ $limit: 1 },
			{
				$project: {
					longname: 1,
					coord: 1,
					distance: 1
				}
			}
		];

		const locationCollection = db.collection(Collection.LOCATION);
		const res = await locationCollection.aggregate(pipeline).toArray();

		const [first, ...rest] = res;
		const parsedLocation = LocationData.pick({ coord: true, longname: true }).parse(
			first
		);
		ok(parsedLocation.coord);

		const [startLng, startLat] = parsedLocation.coord.coordinates.map(
			(coord: number) => (coord * Math.PI) / 180
		);
		const [endLng, endLat] = locCoord.coordinates.map((coord: number) => (coord * Math.PI) / 180);

		const dLng = endLng - startLng;

		const y = Math.sin(dLng) * Math.cos(endLat);
		const x =
			Math.cos(startLat) * Math.sin(endLat) -
			Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
		const bearing = (Math.atan2(y, x) * 180) / Math.PI;

		const norm = (bearing + 360) & 360;

		const directions = [
			'South',
			'South-South-West',
			'South-West',
			'West-South-West',
			'West',
			'West-North-West',
			'North-West',
			'North-North-West',
			'North',
			'North-North-East',
			'North-East',
			'East-North-East',
			'East',
			'East-South-East',
			'South-East',
			'South-South-East'
		];
		const index = Math.round(norm / 22.5) % 16; // There are 16 segments

		const cardinality = directions[index];
		const distanceMeters = calculateDistanceinMeters(parsedLocation.coord, locCoord);

		return `${(distanceMeters / 1000).toPrecision(2)}km ${cardinality} of ${parsedLocation.longname}`;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
