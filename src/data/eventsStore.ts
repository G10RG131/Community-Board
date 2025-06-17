// src/data/eventsStore.ts

import { Event } from "../types/event";

/**
 * In-memory store of events.
 * We’ll swap this out for a JSON file later.
 */
export const events: Event[] = [];
