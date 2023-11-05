const sgMail = require('@sendgrid/mail');
const config = require('./config.json');

class EmailSend {
  constructor(apiKey) {
    sgMail.setApiKey(apiKey);
  }

  isValidBase64(str) {
    try {
      // Try to decode and re-encode to confirm base64 structure
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (error) {
      return false;
    }
  }

  async sendEmail(pdfBuffer) {
    try {
      const encodedContent = Buffer.from(pdfBuffer).toString('base64');

      if (!this.isValidBase64(encodedContent)) {
        throw new Error('Content is not valid base64');
      }

      const msg = {
        to: config.email_rec, 
        from: config.sender_email, // Use sender's email from config.json
        subject: 'Generated PDF',
        text: 'Find the attached generated PDF.',
        attachments: [{
          content: encodedContent,
          filename: 'document.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };
      await sgMail.send(msg);

    } catch (error) {
      console.error('SendGrid error:', error.response.body.errors);
      throw new Error("Email sending failed");
    }
  }
}

module.exports = EmailSend;
