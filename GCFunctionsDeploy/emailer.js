// Import nodemailer as our mailing API
const nodemailer = require('nodemailer');
const fs = require('fs');

// Transporter variable
let transporter = null;

// Email options
let mailOptions = null;

/**
 * Set up the transporter with specified credentials.
 *
 * @param {string} emailService - The email service (e.g., 'Gmail', 'Outlook').
 * @param {string} userEmail - The user's email address.
 * @param {string} password - The app password for authentication.
 */
function transporterProp(emailService, userEmail, password) {
    transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: userEmail,
            pass: password,
        },
    });
}

/**
 * Create email options for sending.
 *
 * @param {string} fromEmail - The sender's email address.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} subjectEmail - The email subject.
 * @param {string} bodyTextEmail - The email body text.
 * @param {string} attachmentName - The name of the attachment.
 * @param {string} filePath - The path to the attachment file.
 */
function createEmail(fromEmail, toEmail, subjectEmail, bodyTextEmail, attachmentName, filePath) {
    mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subjectEmail,
        text: bodyTextEmail,
        attachments: [
            {
                filename: attachmentName,
                content: fs.createReadStream(filePath),
            },
        ],
    };
}

/**
 * Send the email using the configured transporter and email options.
 */
async function send() {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Export functions
module.exports = {
    transporterProp,
    createEmail,
    send
};
