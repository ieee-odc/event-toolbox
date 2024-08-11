const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); // Update path module import
const filePath = path.join(__dirname, 'templates', 'email-template.html');  
const filePath1 = path.join(__dirname, 'templates', 'workshopEmail-template.html'); 

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for port 587 with STARTTLS
  auth: {
    user: process.env.OUTLOOK_USER, // Your Outlook email address
    pass: process.env.OUTLOOK_PASS, // Your Outlook email password
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Send email function for event registration
const sendEmail = async (recipientEmail, subject, participantName, eventName, eventDescription, eventLocation, eventStartDate, eventEndDate) => {
  try {
    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(filePath, 'utf-8');
    
    // Replace placeholders with actual values
    htmlTemplate = htmlTemplate.replace('[ParticipantName]', participantName);
    htmlTemplate = htmlTemplate.replace('[EventName]', eventName);
    htmlTemplate = htmlTemplate.replace('[eventLocation]', eventLocation)
    htmlTemplate = htmlTemplate.replace('[eventStartDate]', eventStartDate.toDateString())
    htmlTemplate = htmlTemplate.replace('[eventEndDate]', eventEndDate.toDateString());
    
    // Send email
    const info = await transporter.sendMail({
      from: '"Event Management" <event.toolbox@outlook.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: subject, // Subject line
      text: `Hello ${participantName}, You have successfully registered for the event: ${eventName}.`, // plain text body
      html: htmlTemplate, // HTML body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

  // Send email function for workshop registrations
  const sendEmail1 = async (recipientEmail, subject, participantName, workshopName, description, startTime, endTime, eventName) => {
    try {
      // Read the HTML template file
      let htmlTemplate = fs.readFileSync(filePath1, 'utf-8');
      
      // Replace placeholders with actual values
      htmlTemplate = htmlTemplate.replace('[ParticipantName]', participantName);
      htmlTemplate = htmlTemplate.replace('[WorkshopName]', workshopName);
      htmlTemplate = htmlTemplate.replace('[Description]', description);
      htmlTemplate = htmlTemplate.replace('[StartTime]', new Date(startTime).toLocaleString());
      htmlTemplate = htmlTemplate.replace('[EndTime]', new Date(endTime).toLocaleString());
      htmlTemplate = htmlTemplate.replace('[EventName]', eventName);
      
      // Send email
      const info = await transporter.sendMail({
        from: '"Event Management" <event.toolbox@outlook.com>', // sender address
        to: recipientEmail, // list of receivers
        subject: subject, // Subject line
        text: `Hello ${participantName}, You have successfully registered for the workshop: ${workshopName}. Description: ${description}. Start Time: ${new Date(startTime).toLocaleString()}. End Time: ${new Date(endTime).toLocaleString()}. Event: ${eventName}.`, // plain text body
        html: htmlTemplate, // HTML body
      });
  
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  

  module.exports={
    sendEmail,
    sendEmail1
  }
  