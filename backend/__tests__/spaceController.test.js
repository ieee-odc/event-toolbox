const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Space = require("../models/SpaceModel");
const Counter = require("../models/CounterModel");
const Organizer = require("../models/OrganizerModel");
const Event = require("../models/EventModel");

let dbUri = process.env.DBURI;

describe("Space Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Create an organizer if it doesn't exist
  const existingOrganizer = await Organizer.findOne({ id: 1 });
  if (!existingOrganizer) {
    await Organizer.create({
      id: 1,
      username: 'testorganizer',
      email: 'testorganizer@example.com',
      password: 'password123',
      provider: 'local'
    });
  }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new space", async () => {
    // Use the existing organizer
    const organizer = await Organizer.findOne({ id: 1 });
    if (!organizer) throw new Error("Organizer with id 1 not found");

    // Create an event
    const event = await Event.create({
      id: 1,
      name: "Test Event",
      description: "This is a test event.",
      location: "Test Location",
      startDate: new Date(),
      endDate: new Date(),
      organizerId: organizer.id,
    });

    // Create a counter for space IDs
    await Counter.create({
      id: "autovalSpaces",
      seq: 1,
    });

    // Prepare space data
    const spaceData = {
      organizerId: organizer.id,
      eventId: event.id,
      capacity: 100,
      name: "Main Hall",
    };

    // Send a POST request to create the space
    const res = await request(app)
      .post("/api/space/add")
      .send(spaceData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.space.name).toBe("Main Hall");
    expect(res.body.space.capacity).toBe(100);
    expect(res.body.space.organizerId).toBe(organizer.id);
    expect(res.body.space.eventId).toBe(event.id);

    // Verify that the space was created
    const space = await Space.findOne({ name: "Main Hall" });
    expect(space).not.toBeNull();
    expect(space.name).toBe("Main Hall");
    expect(space.capacity).toBe(100);
    expect(space.organizerId).toBe(organizer.id);
    expect(space.eventId).toBe(event.id);
  });

//   it("should retrieve spaces by organizer ID", async () => {
//     // Use the existing organizer
//     const organizer = await Organizer.findOne({ id: 1 });
//     if (!organizer) throw new Error("Organizer with id 1 not found");

//     // Create an event
//     const event = await Event.create({
//       id: 2,
//       name: "Test Event for Space",
//       description: "This event is used for testing spaces retrieval.",
//       location: "Test Location",
//       startDate: new Date(),
//       endDate: new Date(),
//       organizerId: organizer.id,
//     });

//     // Create spaces for the organizer
//     const spaceData = [
//       {
//         id: 1,
//         organizerId: organizer.id,
//         eventId: event.id,
//         capacity: 50,
//         name: "Conference Room",
//       },
//       {
//         id: 2,
//         organizerId: organizer.id,
//         eventId: event.id,
//         capacity: 200,
//         name: "Exhibition Hall",
//       },
//     ];
//     await Space.insertMany(spaceData);

//     // Send a GET request to retrieve spaces by organizer ID
//     const res = await request(app).get(`/api/space/organizer/${organizer.id}`);

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.status).toBe("success");
//     expect(res.body.spaces.length).toBe(2);
//     expect(res.body.spaces[0].name).toBe("Conference Room");
//     expect(res.body.spaces[1].name).toBe("Exhibition Hall");

//     // Verify that the spaces were retrieved correctly
//     const spaces = await Space.find({ organizerId: organizer.id });
//     expect(spaces.length).toBe(2);
//     expect(spaces[0].name).toBe("Conference Room");
//     expect(spaces[1].name).toBe("Exhibition Hall");
//   });

});
