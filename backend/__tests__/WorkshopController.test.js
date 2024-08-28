const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Workshop = require("../models/WorkshopModel");
const Space = require("../models/SpaceModel");
const Event = require("../models/EventModel");
const Organizer = require("../models/OrganizerModel");
const Counter = require("../models/CounterModel");

let dbUri = process.env.DBURI;

describe("Workshop Controller - addWorkshop", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up the test data after each test
    await Workshop.deleteMany({});
    await Space.deleteMany({});
    await Event.deleteMany({});
    await Counter.deleteMany({ id: "autovalWorkshop" });
  });

  it("should create a new workshop", async () => {
    // Use the existing organizer
    const organizer = await Organizer.findOne({ id: 1 });
    if (!organizer) throw new Error("Organizer with id 1 not found");
  
    // Create an event
    const event = await Event.create({
      id: 3,
      name: "Test Event for Workshop",
      description: "This event is used for testing workshop creation.",
      location: "Test Location",
      startDate: new Date(),
      endDate: new Date(),
      organizerId: organizer.id,
    });
  
    // Create a space
    const space = await Space.create({
      id: 4,
      name: "Test Space",
      organizerId: organizer.id,
      eventId: event.id,
      capacity: 100,
    });
  
    // Create a counter for workshop IDs
    await Counter.create({
      id: "autovalWorkshop",
      seq: 1,
    });
  
    // Prepare workshop data
    const workshopData = {
      name: "Test Workshop",
      description: "This is a test workshop.",
      startTime: new Date(),
      endTime: new Date(),
      spaceId: space.id,
      eventId: event.id,
      organizerId: organizer.id,
      numberOfAttendees: 50,
    };
  
    // Send a POST request to create the workshop
    const res = await request(app)
      .post("/api/workshop/add")
      .send(workshopData);
  
    // Log the response for debugging
    console.log("Workshop creation response:", res.body);
  
    // Assertions
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.workshop.name).toBe("Test Workshop");
    expect(res.body.workshop.description).toBe("This is a test workshop.");
    expect(res.body.workshop.space.name).toBe("Test Space");
  
    // Verify that the workshop was created
    const workshop = await Workshop.findOne({ name: "Test Workshop" });
    console.log("Stored workshop:", workshop);
  
    expect(workshop).not.toBeNull();
    expect(workshop.name).toBe("Test Workshop");
    expect(workshop.description).toBe("This is a test workshop.");
  
    // Log and compare spaceId values
    console.log("Expected space ID:", space.id);
    console.log("Received space ID in workshop:", workshop.spaceId);
  
    // Assertions
    expect(workshop.spaceId).toBe(space.id); // Ensure this matches the expected value
    expect(workshop.eventId).toBe(event.id);
    expect(workshop.organizerId).toBe(organizer.id);
  });
  
});
