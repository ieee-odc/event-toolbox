const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Form = require("../models/FormModel");
const Counter = require("../models/CounterModel");
const Organizer = require("../models/OrganizerModel");
const Event = require("../models/EventModel");
const Workshop = require("../models/WorkshopModel");

let dbUri = process.env.DBURI;

describe("Form Controller", () => {
  beforeAll(async () => {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new form", async () => {
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

    // Create a counter for form IDs
    await Counter.create({
      id: "autovalForms",
      seq: 1,
    });

    // Prepare form data
    const formData = {
      name: "Test Form",
      description: "This is a test form.",
      data: [
        {
          type: "input",
          question: "What is your name?",
        },
        {
          type: "checkbox",
          question: "Which languages do you speak?",
          options: ["English", "French", "Spanish"],
        },
      ],
      deadline: new Date(),
      organizerId: organizer.id,
      eventId: event.id,
    };

    // Send a POST request to create the form
    const res = await request(app)
      .post("/api/form/add")
      .send(formData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Test Form");
    expect(res.body.description).toBe("This is a test form.");
    expect(res.body.data.length).toBe(2);

    // Verify that the form was created
    const form = await Form.findOne({ name: "Test Form" });
    expect(form).not.toBeNull();
    expect(form.name).toBe("Test Form");
    expect(form.description).toBe("This is a test form.");
    expect(form.data.length).toBe(2);
    expect(form.organizerId).toBe(organizer.id);
    expect(form.eventId).toBe(event.id);
  });
});
