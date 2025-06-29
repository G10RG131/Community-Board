// src/routes/places.ts
import { Router, Request, Response, NextFunction } from "express";
import { cache } from "../utils/cache";

const router = Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!GOOGLE_API_KEY) {
        return res
          .status(500)
          .json({ error: "Google API key not configured" });
      }

      const { lat, lng, radius = "500" } = req.query;
      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "lat and lng query parameters are required" });
      }

      const key = `places_${lat}_${lng}_${radius}`;
      // let TypeScript infer the JSON type from the fetcher
      const data = await cache(key, 60, async () => {
        const url = `${BASE_URL}?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Places API error: ${response.statusText}`);
        }
        return response.json();
      });

      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
