// src/routes/places.ts
import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { nearbySearch, Place } from "../services/placesService";
import { ApiError } from "../utils/ApiError";

const router = Router();

const QuerySchema = z.object({
  lat:    z.string().refine(s => !isNaN(Number(s)), { message: "lat must be a number" }),
  lng:    z.string().refine(s => !isNaN(Number(s)), { message: "lng must be a number" }),
  radius: z.string().refine(s => !isNaN(Number(s)), { message: "radius must be a number" }),
  type:   z.string().optional(),
});

router.get(
  "/nearby",
  asyncHandler(async (req, res) => {
    const q = QuerySchema.parse(req.query);
    const lat = Number(q.lat),
          lng = Number(q.lng),
          radius = Number(q.radius),
          type = q.type;

    if (!process.env.GOOGLE_API_KEY) {
      throw new ApiError(500, "Google API key not configured");
    }

    const places: Place[] = await nearbySearch(lat, lng, radius, type);
    res.json(places);
  })
);

export default router;
