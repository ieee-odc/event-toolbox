const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path"); // Update path module import
const filePath = path.join(__dirname, "templates", "email-template.html");
const QRCode = require("qrcode");

const filePath1 = path.join(
  __dirname,
  "templates",
  "workshopEmail-template.html"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for port 587 with STARTTLS
  auth: {
    user: process.env.GOOGLE_NODEMAILER, // Your Gmail address
    pass: process.env.GOOGLE_NODEMAILER_key, // Your Gmail app password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Send email function for event registration
const sendEventEmail = async (
  recipientEmail,
  subject,
  participantName,
  eventName,
  eventDescription,
  eventLocation,
  eventStartDate,
  eventEndDate,
  cancelationToken
) => {
  try {
    let htmlTemplate = fs.readFileSync(filePath, "utf-8");

    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.FRONTEND_URL}/checkin-registration/${cancelationToken}`
    );

    const qrCodeBuffer = Buffer.from(qrCodeUrl.split(",")[1], "base64");
    const cancelationLink = `${process.env.FRONTEND_URL}/cancel-registration/${cancelationToken}`;
    htmlTemplate = htmlTemplate.replace("[ParticipantName]", participantName);
    htmlTemplate = htmlTemplate.replace("[EventName]", eventName);
    htmlTemplate = htmlTemplate.replace("[eventLocation]", eventLocation);
    htmlTemplate = htmlTemplate.replace(
      "[eventStartDate]",
      eventStartDate.toDateString()
    );
    htmlTemplate = htmlTemplate.replace(
      "[eventEndDate]",
      eventEndDate.toDateString()
    );
    htmlTemplate = htmlTemplate.replace("[cancelationLink]", cancelationLink);
    htmlTemplate = htmlTemplate.replace(
      "[QRCode]",
      `<img src="cid:qrCode" alt="Event QR Code" />`
    );

    const info = await transporter.sendMail({
      from: '"Event Management" <event.toolbox@outlook.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: subject, // Subject line
      text: `Hello ${participantName}, You have successfully registered for the event: ${eventName}.`, // plain text body
      html: htmlTemplate, // HTML body
      attachments: [
        {
          filename: "qrCode.png",
          content: qrCodeBuffer,
          cid: "qrCode", // same as the cid value in the html img src
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendWorkshopEmail = async (
  recipientEmail,
  subject,
  participantName,
  workshopName,
  description,
  startTime,
  endTime,
  cancelationToken
) => {
  try {
    let htmlTemplate = fs.readFileSync(filePath1, "utf-8");

    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.FRONTEND_URL}/checkin-registration/${cancelationToken}`
    );

    const qrCodeBuffer = Buffer.from(qrCodeUrl.split(",")[1], "base64");
    const cancelationLink = `${process.env.FRONTEND_URL}/cancel-registration/${cancelationToken}`;

    // Replace placeholders with actual values
    htmlTemplate = htmlTemplate.replace("[ParticipantName]", participantName);
    htmlTemplate = htmlTemplate.replace("[WorkshopName]", workshopName);
    htmlTemplate = htmlTemplate.replace("[Description]", description);
    htmlTemplate = htmlTemplate.replace(
      "[StartTime]",
      new Date(startTime).toLocaleString()
    );
    htmlTemplate = htmlTemplate.replace(
      "[EndTime]",
      new Date(endTime).toLocaleString()
    );
    htmlTemplate = htmlTemplate.replace("[cancelationLink]", cancelationLink);
    htmlTemplate = htmlTemplate.replace(
      "[QRCode]",
      `<img src="cid:qrCode" alt="Workshop QR Code" />`
    );

    const info = await transporter.sendMail({
      from: '"Event Management" <event.toolbox@outlook.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: subject, // Subject line
      text: `Hello ${participantName}, You have successfully registered for the workshop: ${workshopName}. Description: ${description}. Start Time: ${new Date(
        startTime
      ).toLocaleString()}. End Time: ${new Date(endTime).toLocaleString()}.`, // plain text body
      html: htmlTemplate, // HTML body
      attachments: [
        {
          filename: "qrCode.png",
          content: qrCodeBuffer,
          cid: "qrCode", // same as the cid value in the html img src
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendEventEmail,
  sendWorkshopEmail,
};
