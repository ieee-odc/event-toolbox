const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Path to your Express app
const Notification = require("../models/NotificationModel"); // Adjust the path as necessary
const Participant = require("../models/ParticipantModel"); // Adjust the path as necessary
const User = require("../models/OrganizerModel"); // Adjust the path as necessary (assuming this is where the Organizer model is)


let dbUri = process.env.DBURI;

beforeAll(async () => {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Clear existing notifications before starting the tests
//   await Notification.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();  // Close the connection
});

describe("Notification Controller", () => {
  let notificationId;

  // Test case to create a notification
  it("should create a new notification", async () => {
    const res = await request(app)
      .post("/api/notification/add")
      .send({
        id: 3, // Ensure this is a Number
        from: 123, // Ensure this is a Number
        to: 456, // Ensure this is a Number
        type: "EventRegistration", // Valid enum value
        read: false, // Optional, ensure it's a Boolean if provided
      });

    expect(res.statusCode).toEqual(201); // Expect 201 for successful creation
    expect(res.body.notification).toHaveProperty("_id"); // Check inside the 'notification' object
    expect(res.body.notification.type).toBe("EventRegistration"); // Check inside the 'notification' object
    notificationId = res.body.notification._id; // Save the notification ID for further tests
  });

   // Test case to retrieve notifications for a specific user
  it("should retrieve notifications for a specific user", async () => {
    // Create a Participant to use in the test
    await Participant.create({
      id: 1,
      fullName: "Test User",
      email: "testuser@example.com",
      phoneNumber: "1234567890",
      status: "Paid", // Valid status from the enum
      eventId: 1, // Assuming this is a required field
    });

    const res = await request(app).get("/api/notification/456");

    expect(res.statusCode).toEqual(200);
    expect(res.body.notifications).toBeInstanceOf(Array);
    expect(res.body.notifications.length).toBeGreaterThan(0);
    expect(res.body.notifications[0]).toHaveProperty("user");
    expect(res.body.notifications[0].user).toHaveProperty("fullName", "Test User");
  });

// Test case to mark all notifications as read for a specific user
it("should mark all notifications as read for a specific user", async () => {
  // Create a User to use in the test (this corresponds to the Organizer model)
  // await User.create({
  //   id: 456,
  //   username: "testuser",
  //   email: "testuser@example.com",
  //   password: "password123",
  //   provider: "local",
  // });

  const res = await request(app)
    .post("/api/notification/mark-all-as-read")
    .send({ userId: 456 });

  expect(res.statusCode).toEqual(200);
  expect(res.body.message).toBe("All notifications marked as read");

  // Verify that the notifications are marked as read
  const notifications = await Notification.find({ to: 456 });
  notifications.forEach((notification) => {
    expect(notification.read).toBe(true);
  });
});
it("should delete a notification by ID", async () => {
  // Create a notification to be deleted
  const notification = await Notification.create({
    id: 4,
    from: 123,
    to: 456,
    type: "EventRegistration",
    read: false,
  });

  const notificationId = notification._id;

  // Send a DELETE request to delete the notification
  const res = await request(app).delete(`/api/notification/${notificationId}`);

  expect(res.statusCode).toEqual(200);
  expect(res.body.message).toBe("Notification deleted successfully");

  // Verify that the notification is deleted
  const deletedNotification = await Notification.findById(notificationId);
  expect(deletedNotification).toBeNull();
});


});
