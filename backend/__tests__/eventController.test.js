const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Path to your Express app

let dbUri = process.env.DBURI 

beforeAll(async () => {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

});

// Avoid deleting any data in afterEach
// Example test
describe("Event Controller", () => {
    it("should create a new event", async () => {
      const res = await request(app)
        .post("/api/events/add")
        .send({
          name: "Test Event",
          description: "This is a test event",
          location: "Test Location",
          startDate: "2024-09-01",
          endDate: "2024-09-02",
          organizerId: 1,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe("Test Event");
    });

  // Additional test cases will go here
  
});
