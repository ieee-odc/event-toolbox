const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); // Update path module import
const filePath = path.join(__dirname, 'templates', 'email-template.html'); // Adjusted file path

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

// Send email function
const sendEmail = async (recipientEmail, subject, participantName, eventName) => {
  try {
    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(filePath, 'utf-8');
    
    // Replace placeholders with actual values
    htmlTemplate = htmlTemplate.replace('[ParticipantName]', participantName);
    htmlTemplate = htmlTemplate.replace('[EventName]', eventName);
    
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

// const sendEmail = async (recipientEmail, subject, text, html) => {
//     try {
//       const info = await transporter.sendMail({
//         from: '"Event Management" <event.toolbox@outlook.com>', // sender address
//         to: recipientEmail, // list of receivers
//         subject: subject, // Subject line
//         text: text, // plain text body
//         html: html, // html body
//       });
  
//       console.log('Message sent: %s', info.messageId);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };

  const sendEmail1 = async (recipientEmail, participantName, eventName) => {
    const html = generateEmailTemplate(participantName, eventName);
    try {
      const info = await transporter.sendMail({
        from: '"Event Management" <your-email@gmail.com>',
        to: recipientEmail,
        subject: `Registration Confirmation for ${eventName}`,
        html: html,
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
  