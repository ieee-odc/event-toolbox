const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Path to your Express app
const Event = require("../models/EventModel"); // Adjust the path as necessary

let dbUri = process.env.DBURI;

beforeAll(async () => {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Clear existing events before starting the tests
  await Event.deleteMany({});
  
});

afterAll(async () => {
  await mongoose.disconnect();
});

// Example test cases
describe("Event Controller", () => {
  let eventId;
  let duplicateEventId; // To store the ID of the duplicated event

  // Create a new event before running tests
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/events/add")
      .send({
        id: 73, // Use a unique ID for the test,
        name: "Test Event",
        description: "This is a test event",
        location: "Test Location",
        startDate: "2024-09-01",
        endDate: "2024-09-02",
        organizerId: 1,
      });
    eventId = res.body.id; // Save the event ID for update and delete tests
    console.log('Created Event ID:', eventId); // Debug log
  });

  it("should create a new event", async () => {
    const res = await request(app)
      .post("/api/events/add")
      .send({
        name: "Another Test Event",
        description: "This is another test event",
        location: "Another Test Location",
        startDate: "2024-09-10",
        endDate: "2024-09-11",
        organizerId: 1,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Another Test Event");
  });

  // Test to update an existing event
  it("should update an existing event", async () => {
    const res = await request(app)
      .post(`/api/events/edit/${eventId}`) // Adjust the endpoint according to your route
      .send({
        name: "Updated Test Event",
        description: "This is an updated test event",
        location: "Updated Test Location",
        startDate: "2024-09-15",
        endDate: "2024-09-16",
      });
    

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("event");
    expect(res.body.event.name).toBe("Updated Test Event");
    expect(res.body.event.description).toBe("This is an updated test event");
    expect(res.body.event.location).toBe("Updated Test Location");
  });
  //Test to duplicate an existing event 
  it("should duplicate an existing event", async () => {
    const res = await request(app)
      .post(`/api/events/duplicate/${eventId}`);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("event");
    expect(res.body.event.name).toContain("Duplicate");
    expect(res.body.event.id).not.toBe(eventId); // Ensure it's a new ID
    duplicateEventId = res.body.event.id; // Save the ID of the duplicated event

  });
   // Test to get an existing event
   it("should get an existing event", async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`);
      console.log('Get Event Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("event");
    expect(res.body.event).toHaveProperty("id", eventId);
  });

   // Test to delete an existing event
  it("should delete an existing event", async () => {
    // First, delete the event
    const deleteRes = await request(app)
      .delete(`/api/events/delete/${eventId}`);
  
    console.log('Delete Response:', deleteRes.body); // Log the delete response for debugging
  
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty("message");
    expect(deleteRes.body.message).toBe("Deleted event successfully");
  
    // Verify that the event is deleted
    const checkRes = await request(app)
      .get(`/api/events/${eventId}`);
    
    console.log('Check Response:', checkRes.body); // Log the response body for debugging
  
    // Adjust the expected status code based on your actual response
    expect(checkRes.statusCode).toEqual(400); // This should match your actual API behavior
  });

  it("should get a list of events sorted by creation date in descending order", async () => {
    // Add more events to ensure there is data to retrieve
    await Event.create({
      id: 1, // Provide a unique ID
      name: "Past Event",
      description: "This event is in the past",
      location: "Past Location",
      startDate: "2023-08-01",
      endDate: "2023-08-02",
      organizerId: 1,
    });

    await Event.create({
      id: 2, // Provide a unique ID
      name: "Current Event",
      description: "This event is happening now",
      location: "Current Location",
      startDate: "2024-08-01",
      endDate: "2024-08-02",
      organizerId: 1,
    });

    await Event.create({
      id: 3, // Provide a unique ID
      name: "Future Event",
      description: "This event is in the future",
      location: "Future Location",
      startDate: "2025-08-01",
      endDate: "2025-08-02",
      organizerId: 1,
    });

    const res = await request(app)
      .get("/api/events");

    console.log('Get Events Response:', res.body); // Log the response body for debugging

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Check that events are sorted by creation date in descending order
    const events = res.body;
    expect(events[0].name).toBe("Future Event");
    expect(events[1].name).toBe("Current Event");
    expect(events[2].name).toBe("Past Event");
  });

   
    
     
  
  // Additional test cases will go here
});
