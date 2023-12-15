const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Generates a PDF using an Express.js server.
 *
 * @param {string} tempFilePath - Path to the temporary file.
 * @param {string} serverUrl - URL of the Express.js server.
 * @param {string} pdfFilePath - Path to save the generated PDF file.
 */
async function generatePDF(tempFilePath, serverUrl, pdfFilePath) {
    // Replace with your Express.js server URL
    const expressServerUrl = serverUrl;

    try {
        // Make a POST request to your Express.js server with the file data
        const response = await axios.post(`${expressServerUrl}`, {
            file: fs.createReadStream(tempFilePath),
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'arraybuffer', // Set responseType to 'arraybuffer' in axios config
        });

        // Write the PDF file to the /tmp directory
        await fs.writeFileSync(pdfFilePath, Buffer.from(response.data));

    } catch (error) {
        console.error('Error sending file to Express.js server:', error);
        // Handle the error as needed, for example, log it or send an alert.
    }
}

// Export the generatePDF function
module.exports = {
    generatePDF,
};
