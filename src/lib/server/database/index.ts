import { MongoClient, ObjectId, Binary, ServerApiVersion } from 'mongodb';
import { DatabaseConnectionError } from '$lib/model/src/errors';
import { EarthquakeEventSchema, type EarthquakeEvent, type EarthquakeFilters } from '$lib/model/src/event';
import { calculateDistanceinMeters, Collection, type Coordinates } from '$lib/model/src/util';
import { EvacCenterSchema, type EvacCenter } from '$lib/model/src/evac';
import { StationSchema } from '$lib/model/src/station';
import { PendingSchema, SessionSchema } from '../model/session';
import { v4 as uuidv4 } from 'uuid';
import { randomFillSync } from 'crypto';
import { ok } from 'assert';
import { UserSchema, type User } from '$lib/model/src/user';
import { z } from 'zod'
import type { Session } from '$lib/server/model/session';
import {
	MediaSchema,
	type Media,
} from '$lib/model/src/posts';
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
interface PipelineType extends Array<Record<string, any>> {};
/**
 * Attempts to connect to the MongoDB client with the following information.
 * @returns connect
 */
async function connect() {
	try {
		await client.connect();
		console.log(`Connected to ${uri}`);
		return client.db('sismika');
	} catch (err) {
		console.error('MongoDB connection error:', err);
		throw DatabaseConnectionError;
	}
}
/**
 * Adds EarthquakeEvent to the MongoDB database.
 * @param data : validated EarthquakeEvent
 * @returns insertedId: the ObjectId of the inserted entry
 */
export async function addEarthquakeData(data: EarthquakeEvent) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EARTHQUAKE);

		const { _id, ...entry } = data;
		
		const titledEntry = {
			...entry,
			title: await resolveEarthquakeTitle(data.coord)
		}
		const { insertedId } = await collection.insertOne(titledEntry);
		return insertedId;
	} catch (err) {
		throw err;
	}
}

/**
 * Gets all EarthquakeEvent from the MongoDB database.
 * @returns EarthquakeEventSchema[] an array of validated EarthquakeEvents
 * @returns false - if there is no earthquakeData in the database
 */
export async function getAllEarthquakeData(page?: number, limit?: number, filter?:EarthquakeFilters) {
	const db = await connect();

	const collection = db.collection(Collection.EARTHQUAKE);

	let matchConditions: Record<string, object> = {};
	if (filter) {
		if (filter.minDepth !== undefined) matchConditions['depth'] = { $gte: filter.minDepth };
        if (filter.maxDepth !== undefined) matchConditions['depth'] = { $lte: filter.maxDepth };
        if (filter.minIntensity !== undefined) matchConditions['mi'] = { $gte: filter.minIntensity };
        if (filter.maxIntensity !== undefined) matchConditions['mi'] = { $lte: filter.maxIntensity };
        if (filter.minTime !== undefined) matchConditions['time'] = { $gte: new Date(filter.minTime) };
        if (filter.maxTime !== undefined) matchConditions['time'] = { $lte: new Date(filter.maxTime) };
		if (filter.geographicBound !== undefined) {
            matchConditions['coord'] = {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [[
                            [filter.geographicBound.coordinates[0][0], filter.geographicBound.coordinates[0][1]],
                            [filter.geographicBound.coordinates[2][0], filter.geographicBound.coordinates[2][1]],
                            [filter.geographicBound.coordinates[3][0], filter.geographicBound.coordinates[3][1]],
							[filter.geographicBound.coordinates[1][0], filter.geographicBound.coordinates[1][1]],
                            [filter.geographicBound.coordinates[0][0], filter.geographicBound.coordinates[0][1]] // Closing the loop
                        ]]
                    }
                }
            };
        }
    }

	let sortConditions: Record<string, number> = {};
    if (filter && filter.orderDepth) sortConditions['depth'] = 1;
    if (filter && filter.orderIntensity) sortConditions['mi'] = 1;
    if (filter && filter.orderTime) sortConditions['time'] = 1;

	let pipeline: PipelineType = []
	
	if (Object.keys(matchConditions).length > 0) {
		pipeline = [...pipeline, {$match: matchConditions}]
	}
	if (Object.keys(sortConditions).length > 0) {
		pipeline = [...pipeline, {$sort: sortConditions}];
	}

	pipeline = [...pipeline,
		{ $addFields: {_id: { $toString: '$_id'}}},
		{
			$facet: {
				paginatedResults: [...(page !== undefined && limit !== undefined ? [{$skip: (page) * limit}, { $limit: limit}]: [])],
				totalCount: [{$count: 'total'}]
			}
		}
	]
	
	const [{paginatedResults, totalCount}] = await collection.aggregate(pipeline).toArray();
	try {
		return {
			equakes: EarthquakeEventSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0
		}
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Gets a singular entry of an EarthquakeEvent given an ObjectId
 * @param id an ObjectId of the EartquakeEvent to retrieve
 * @returns validated an single entry of an EartquakeEvent
 * @returns false if nothing was found
 */
export async function getEarthquakeData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: {_id: id}},
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	]

	const collection = db.collection(Collection.EARTHQUAKE);
	
	const [first, ...rest] = await collection.aggregate(pipeline).toArray()
	if (!first) return false;

	try {
		return EarthquakeEventSchema.parse(first);
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Removes a singular entry of an EarthquakeEvent given an ObjectId
 * @param id an ObjectId of the EarthquakeEvent to remove
 * @returns deletecCount a count on how many was removed
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
 * Gets all Stations in the MongoDB database.
 * @returns StationSchema[]: returns an array of validated StationSchemas
 * @returns false - if no StationData is found
 */
export async function getAllStationData(page?: number, limit?: number) {
	const db = await connect();

	let pipeline: PipelineType = [
		{
			$addFields: {_id: { $toString: '$_id'}}
		},
		{
			$facet: {
				paginatedResults: [...(page !== undefined && limit !== undefined ? [{$skip: (page) * limit}, {$limit: limit}] : [] )],
				totalCount: [{$count: 'total'}]
			}
		}
	];

	const collection = db.collection(Collection.STATION);
	const [{paginatedResults, totalCount}] = await collection.aggregate(pipeline).toArray()
	
	try {
		return {
			stations: StationSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0,
		}
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Adds a station to the MongoDB database.
 * @param data a validated StationSchema to add to the database
 * @returns insertedId a ObjectId of the inserted entry
 */
export async function addStationData(data: StationSchema) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Deletes a Station entry given a ObjectId
 * @param id a MongoDB ObjectId
 * @returns deletedCount a value indicating how many was removed
 */
export async function deleteStationData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.STATION);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Retrieve a StationData given an ObjectId
 * @param id a MongoDB ObjectId of the station to be found
 * @returns validated a validated StationData
 * @returns false - if no ObjectId of the StationData was found
 */
export async function getStationData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: {_id: id}},
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	]

	const collection = db.collection(Collection.STATION);
	
	const [first, ...rest] = await collection.aggregate(pipeline).toArray()

	if (!first) return false;

	try {
		return StationSchema.parse(first)
	} catch (err) {
		console.error("Validation error:", err)
		throw err;
	}
}

/**
 * Gets all entries in the MongoDB database for all Evacuation center entries
 * @returns EvacCenter[]: an array of EvacCenters
 * @false - if MongoDB does not have any EvacCenters
 */
export async function getAllEvacData(page?: number, limit?:number) {
	const db = await connect();

	const collection = db.collection(Collection.EVAC);

	let pipeline: PipelineType = [
		{
			$addFields: {_id: { $toString: '$_id'}}
		},
		{
			$facet: {
				paginatedResults: [...(page !== undefined && limit !== undefined ? [{$skip: (page) * limit}, { $limit: limit}]: [])],
				totalCount: [{$count: 'total'}]
			}
		}
	];
	const [{paginatedResults, totalCount}] = await collection.aggregate(pipeline).toArray()
		try {
		return {
			evacs: EvacCenterSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.total) : 0
		}
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Adds an EvacCenter entry to the MongoDB database
 * @param data an validated EvacCenter object
 * @returns insertedId - the ObjectID of the recently inserted EvacCenter
 */
export async function addEvacData(data: EvacCenter) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { _id, ...entry } = data;
		const { insertedId } = await collection.insertOne(entry);

		return insertedId;
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Deletes an EvacCenter entry given an ObjectId
 * @param id a validated ObjectId of the entry to deleted
 * @returns deletedCount - the amount of entries deleted
 */
export async function deleteEvacData(id: ObjectId) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.EVAC);
		const { deletedCount } = await collection.deleteOne({ _id: id });

		return deletedCount;
	} catch (err) {
		console.error("Validation error:", err);
		throw err;
	}
}

/**
 * Searches for an Evacuation center with the given ObjectId
 * @param id the ObjectId of the Evacuation center to find
 * @returns validated - the EvacCenter object of the found entry
 * @returns false - if the ObjectId cannot be found
 */
export async function getEvacData(id: ObjectId) {
	const db = await connect();

	const pipeline: PipelineType = [
		{ $match: {_id: id}},
		{
			$addFields: {
				_id: { $toString: '$_id' }
			}
		}
	]

	const collection = db.collection(Collection.EVAC);
	const [first, ...rest] = await collection.aggregate(pipeline).toArray()

	if (!first) return false;
	try {
		return EvacCenterSchema.parse(first);
	} catch (err) {
		console.error("Validation error:", err);
		throw (err)
	}
}

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

export async function upsertUser(data: User) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.USERS);
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
		return UserSchema.parse(userPointer);
	} catch (err) {
		throw err;
	}
}

export async function getMediaForEarthquake(equakeId: ObjectId, page?: number, limit?: number) {
	const db = await connect();

	try {
		const collection = db.collection(Collection.MEDIA);

		let pipeline: PipelineType = [ 
			{ $match: {equakeId: equakeId} },
			{ $addFields: {_id: {$toString: '$_id'}, equakeId: {$toString: '$equakeId'}}},
			{
				$facet: {
					paginatedResults: [...(page !== undefined && limit !== undefined ? [{$limit: limit}, {$skip: page * limit}] : [])],
					totalCount: [{$count: 'total'}]
				}
			}
		];

		const [{paginatedResults, totalCount}] = await collection.aggregate(pipeline).toArray();
		
		return {
			articles: MediaSchema.array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.count) : 0,
		}
	} catch (err) {
		console.error(err)
		throw err;
	}
}

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
							$centerSphere: [
								coord.coordinates, 
								distanceMeters / 6378137
							]
						}
					}
				}
			},
			{
				$project: {osmresult: 0, _id: 0}
			},
			{
				$facet: {
					paginatedResults: [...(page !== undefined && limit !== undefined ? [{$skip: limit * page}, {$limit: limit}] : [])],
					totalCount: [{$count: 'total'}],
					totalPopulation: [{$match: {geographicLevel: "Bgy"}}, {$group: {_id: null, sumPopulation: {$sum: "$population"}}}]
				}
			}
		]
		const locationTable = db.collection(Collection.LOCATION);
		const [{paginatedResults, totalCount, totalPopulation}] = await locationTable.aggregate(pipeline).toArray()

		return {
			locations: LocationData.array().parse(paginatedResults),
			totalCount: totalCount[0]?.total ? z.number().parse(totalCount[0]?.total) : 0,
			totalPopulation: totalPopulation[0]?.sumPopulation ? z.number().parse(totalPopulation[0]?.sumPopulation) : 0
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function collateNearbyEarthquakes(code: string, distanceMeters: number, limit?: number, page?: number) {
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

		let equakeResults = earthquakeTable.find(earthquakeQuery, {projection: {_id: {$toString: "$_id"}}});
		if (limit && page) equakeResults.skip((page - 1) * limit).limit(limit)
		
		const equakePointer = await equakeResults.toArray()

		if (equakePointer.length === 0) return [];
		return EarthquakeEventSchema.array().parse(equakePointer)
	} catch (err) {
		throw err;
	}
}

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

export async function getProvincialLocations(page?: number, limit?: number) {
	const db = await connect()

	try {
		const locationCollection = db.collection(Collection.LOCATION);

		let pipeline: PipelineType = [
			{
				$match: {geographicLevel: "Prov"}
			},
			{ $addFields: {_id: {$toString: '$_id'}}},
			{
				$project: { osmresult: 0, _id: 0}
			},
			{
				$facet: {
					paginatedResults: [...(page !== undefined && limit !== undefined ? [{$skip: page * limit}, {$limit: limit}] : [])],
					totalCount: [{$count: 'count'}]
				}
			}
		]
		
		const [{ paginatedResults, totalCount }] = await locationCollection.aggregate(pipeline).toArray()
		return {
			location: LocationData.omit({osmresult: true, _id: true}).array().parse(paginatedResults),
			totalCount: totalCount[0]?.count ? z.number().parse(totalCount[0]?.count) : 0	
		}
	} catch (err) {
		throw err;
	}
}

export async function getLocationFromPSGC(psgc: string) {
	const db = await connect();

	try {
		const locationCollection = db.collection(Collection.LOCATION);

		const pipeline: PipelineType = [
			{$match: {psgc: psgc}},
			{$project: {_id: 0}},
		]

		const [first, ...rest] = await locationCollection.aggregate(pipeline).toArray()

		if (!first) return false

		return LocationData.parse(first)
	} catch (err) {
		console.error(err);
		throw err
	}
}

export async function getUsers() {
	const db = await connect()	

	const userCollection = db.collection(Collection.USERS)
	const pipeline: PipelineType = [
		{$facet: {
			"user": [{$match: {permission: 0}}],
			"researcher": [{$match: {permission: 1}}],
			"admin": [{$match: {permission: 2}}]
		}}
	]

	try {
		const [{user, researcher, admin}] = await userCollection.aggregate(pipeline).toArray()

		return {
			user: UserSchema.array().parse(user),
			researcher: UserSchema.array().parse(researcher),
			admin: UserSchema.array().parse(admin)
		}
	} catch (err) {
		console.error("Error occured:", err);
		throw err;
	}
}

export async function deleteUser(user: string) {
	const db = await connect()

	const userCollection = db.collection(Collection.USERS);
	const { deletedCount } = await userCollection.deleteOne({user_id: user});
	if (deletedCount) return true;
	return false

}
export async function updatePermissions(user: string, perm: number) {
	const db = await connect();

	try {
		const userCollection = db.collection(Collection.USERS);
		const { modifiedCount } = await userCollection.updateOne({user_id: user}, {$set: { permission: perm }})
		if (modifiedCount) return true;
		return false;
	} catch (err) {
		console.error("Error occured", err);
		throw err;
	}
}

export async function resolveEarthquakeTitle(locCoord: Coordinates) {
	const db = await connect();

	try {
		const pipeline: PipelineType = [
			{
				$geoNear: {
					near: locCoord,
					distanceField: "distance",
					includeLocs: "coord",
					spherical: true,
				}
			},
			{$limit: 1},
			{
				$project: {
					longname: 1,
					coord: 1, 
					distance: 1
				}
			}
		]

		const locationCollection = db.collection(Collection.LOCATION)
		const res = await locationCollection.aggregate(pipeline).toArray();

		const [first, ...rest] = res;

		const parsedLocation = LocationData.pick({coord: true, longname: true}).parse(first.nearestLocation);
		ok(parsedLocation.coord)

		const [startLng, startLat] = parsedLocation.coord.coordinates.map((coord:number) => coord * Math.PI / 180);
        const [endLng, endLat] = locCoord.coordinates.map((coord:number) => coord * Math.PI / 180);
        
        const dLng = endLng - startLng;

        const y = Math.sin(dLng) * Math.cos(endLat);
        const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
        const bearing = Math.atan2(y, x) * 180 / Math.PI;

        const norm = (bearing + 360) & 360

        const directions = [
            "South", "South-South-West", "South-West", "West-South-West",
            "West", "West-North-West", "North-West", "North-North-West",
			"North", "North-North-East", "North-East", "East-North-East", 
            "East", "East-South-East", "South-East", "South-South-East",
        ];
        const index = Math.round(norm / 22.5) % 16; // There are 16 segments
        
        const cardinality = directions[index];
        const distanceMeters = calculateDistanceinMeters(parsedLocation.coord, locCoord);

        return `${(distanceMeters/1000).toPrecision(2)}km ${cardinality} of ${parsedLocation.longname}` 
	} catch (err) {
		console.error(err);
		throw err;
	}
}