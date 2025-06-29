// src/services/placesService.ts
import axios from "axios";
import { config } from "../config";

export interface Place {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
}

// simple in-memory cache with 5-minute TTL
const cache = new Map<string, { ts: number; data: Place[] }>();
const TTL = 5 * 60 * 1000;

export async function nearbySearch(
  lat: number,
  lng: number,
  radius: number,
  type?: string
): Promise<Place[]> {
  const key = `${lat}|${lng}|${radius}|${type || ""}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < TTL) {
    return cached.data;
  }

  const res = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
    params: {
      key: config.googleApiKey,
      location: `${lat},${lng}`,
      radius,
      ...(type ? { type } : {}),
    },
  });

  if (res.data.status !== "OK") {
    throw new Error(`Google Places error: ${res.data.status}`);
  }

  const places: Place[] = res.data.results.map((r: any) => ({
    placeId:  r.place_id,
    name:     r.name,
    address:  r.vicinity,
    lat:      r.geometry.location.lat,
    lng:      r.geometry.location.lng,
    types:    r.types,
  }));

  cache.set(key, { ts: Date.now(), data: places });
  return places;
}
