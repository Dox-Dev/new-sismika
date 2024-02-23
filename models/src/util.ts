import { z } from 'zod';

export const CoordinatesSchema = z.object({
    long: z.number(),
    lat: z.number()
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
