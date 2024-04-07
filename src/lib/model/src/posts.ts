import { z } from 'zod';
import { ObjectIDSchema } from './util';
import { GoogleUserId } from './user';
import { ObjectId } from 'mongodb';

export enum MEDIATYPE {
	Image,
	Video,
	Article,
	Comment
}

export const MediaSchema = z.object({
	_id: ObjectIDSchema,
	equakeId: ObjectIDSchema,
	type: z.number(),
	time: z.string().datetime(),
	url: z.string(),
	content: z.string(),
	submitter_id: GoogleUserId
});

export type Media = z.infer<typeof MediaSchema>;
export const MediaArraySchema = z.array(MediaSchema);
