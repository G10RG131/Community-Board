// src/__tests__/volunteers.search.spec.ts
import request from "supertest";
import createApp from "../app";
import { nearbySearch } from "../services/placesService";
import { getEvents } from "../data/eventsStore";
import type { Place } from "../services/placesService";
import type { Event } from "../types/event";

// mock the external dependencies
jest.mock("../services/placesService");
jest.mock("../data/eventsStore");

const mockedNearby = nearbySearch as jest.MockedFunction<typeof nearbySearch>;
const mockedGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

describe("GET /volunteers/search", () => {
  let app: ReturnType<typeof createApp>;

  const dummyEvents: Event[] = [
    {
      id: "e1",
      title: "Tree Planting",
      description: undefined,    // was null, now undefined
      date: "2025-07-01T10:00:00Z",
      location: "Central Park",
      image: undefined,
      volunteerPositions: ["planter", "waterer"],
      userId: 1,
      status: "pending",
      submittedAt: "2025-06-30T12:00:00Z",
      approvedBy: null,
    },
    {
      id: "e2",
      title: "Beach Cleanup",
      description: undefined,    // was null, now undefined
      date: "2025-07-02T09:00:00Z",
      location: "Rockaway Beach",
      image: undefined,
      volunteerPositions: ["picker"],
      userId: 2,
      status: "pending",
      submittedAt: "2025-06-30T13:00:00Z",
      approvedBy: null,
    },
  ];

  const dummyPlaces: Place[] = [
    {
      placeId: "p1",
      name: "Volunteer Center A",
      address: "123 Main St",
      lat: 40.0,
      lng: -73.0,
      types: ["volunteer_centre"],
    },
  ];

  beforeAll(() => {
    process.env.GOOGLE_API_KEY = "fake-key";
    app = createApp();
    mockedGetEvents.mockResolvedValue(dummyEvents);
    mockedNearby.mockResolvedValue(dummyPlaces);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("returns both events and places when lat/lng provided", async () => {
    const res = await request(app)
      .get("/volunteers/search")
      .query({ lat: "40.0", lng: "-73.0", radius: "1000" })
      .set("Authorization", "Bearer test-token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      places: dummyPlaces,
      events: dummyEvents,
    });
    expect(mockedNearby).toHaveBeenCalledWith(40.0, -73.0, 1000);
    expect(mockedGetEvents).toHaveBeenCalled();
  });

  it("filters events by date and tags", async () => {
    mockedNearby.mockClear();
    const res = await request(app)
      .get("/volunteers/search")
      .query({ date: "2025-07-01", tags: "planter,waterer" })
      .set("Authorization", "Bearer test-token");

    expect(res.status).toBe(200);
    expect(res.body.places).toEqual([]);
    expect(res.body.events).toEqual([dummyEvents[0]]);
  });

  it("returns 400 for invalid coords", async () => {
    const res = await request(app)
      .get("/volunteers/search")
      .query({ lat: "not-a-number", lng: "oops" })
      .set("Authorization", "Bearer test-token");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/lat must be a number/);
  });
});
