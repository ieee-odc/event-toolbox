const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Participant = require("../models/ParticipantModel");
const Event = require("../models/EventModel");
const Counter = require("../models/CounterModel");
const Organizer = require("../models/OrganizerModel");
const Email = require("../controllers/sendEmailController");

jest.mock("../controllers/sendEmailController"); // Mock the Email controller
let dbUri = process.env.DBURI;

describe("Participant Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await Participant.deleteMany({});
    await Event.deleteMany({});
    await Counter.deleteMany({});
    await Organizer.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should add a new participant to an event", async () => {
    // Mock email sending
    Email.sendEventEmail.mockResolvedValue(true);

    // Create an organizer
    const organizer = await Organizer.create({
      id: 1,
      username: "testorganizer",
      email: "testorganizer@example.com",
      password: "password123",
      provider: "local",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    // Create an event
    const event = await Event.create({
      id: 1,
      name: "Test Event",
      description: "This is a test event.",
      location: "Test Location",
      startDate: new Date(),
      endDate: new Date(),
      organizerId: organizer.id, // Include organizerId
    });

    // Create a counter for participant IDs
    await Counter.create({
      id: "autovalParticipant",
      seq: 1,
    });

    // Prepare participant data
    const participantData = {
      eventId: event.id,
      email: "testparticipant@example.com",
      fullName: "Test Participant",
      phoneNumber: "1234567890",
    };

    // Send a POST request to add the participant
    const res = await request(app)
      .post("/api/participant/add")
      .send(participantData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Added Participant");

    // Verify that the participant was added
    const participant = await Participant.findOne({ email: "testparticipant@example.com", eventId: event.id });
    expect(participant).not.toBeNull();
    expect(participant.email).toBe("testparticipant@example.com");
    expect(participant.fullName).toBe("Test Participant");

    // Verify that the email was sent
    expect(Email.sendEventEmail).toHaveBeenCalled();
    expect(Email.sendEventEmail).toHaveBeenCalledWith(
      participantData.email,
      expect.any(String), // subject
      participantData.fullName,
      event.name,
      event.description,
      event.location,
      event.startDate,
      event.endDate,
      expect.any(String) // cancellation token
    );
  });

});
