const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Import necessary modules
const firestoreDataHandler = require('./firestoreDataHandler');
const generatePDF = require('./generateTest');
const emailer = require('./emailer');
const templateHandler = require('./fillTemplate');
const config = require('./config.json');

// Get configuration from config.json
const FIRESTORE_COLLECTION = config.firestore_collection;
const APP_PASSWORD = config.app_password;
const SENDER_EMAIL = config.sender_email;
const GOOGLE_BUCKET_NAME = config.google_bucket_name;
const GOOGLE_CLOUD_SERVICE = config.google_cloud_run;

// Initialize Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = GOOGLE_BUCKET_NAME;


// Define Cloud Function
exports.onCreateStateCreate = functions.firestore
    .document(`${FIRESTORE_COLLECTION}/{docId}`)
    .onWrite(async (change, context) => {
        // Get the data after the write operation
        const newValue = change.after.data();

        // Exit if this is not a creation or the value is not 'create'.
        if (!newValue || newValue.state !== 'create') {
            return null;
        }

        // Document that changed
        const documentPath = context.params.docId;

        // Generate PDF regardless of sendEmailFlag
        const firestoreDatafetch = new firestoreDataHandler();
        const data = await firestoreDatafetch.fetchData(`${FIRESTORE_COLLECTION}/${context.params.docId}`);

        // Variable save function
        const template = await firestoreDatafetch.getStorageFile(storage.bucket(bucketName), 'invoice.tex');
        const templateVar = templateHandler.getVariableNames(template, /\\newcommand{\\([^}]+)}{([^}]+)}/g);
        const filledTemplateFile = await templateHandler.fillTemplate(data, template, templateVar);

        // Upload filled template to Google Cloud Storage
        await storage.bucket(bucketName).file('filledTemplate.tex').save(filledTemplateFile);

        // Get the current working directory
        const tmpDir = os.tmpdir();
        const filePath = path.join(tmpDir, 'filledTemplate.tex');
        fs.writeFileSync(filePath, filledTemplateFile);

        const pdfFileName = 'output.pdf';
        const pdfFilePath = path.join(os.tmpdir(), pdfFileName);

        // Generate PDF
        console.log("Generating pdf");
        await generatePDF.generatePDF(filePath, GOOGLE_CLOUD_SERVICE, pdfFilePath);
        console.log("After generating pdf");

        // Upload the PDF file to Cloud Storage
        const storagePath = `${documentPath}/${pdfFileName}`;
        await storage.bucket(bucketName).upload(pdfFilePath, {
            destination: `${storagePath}`, // Set the desired path in Cloud Storage
        });

        // Update Firestore to indicate that the file has been processed
        await admin.firestore().doc(`${FIRESTORE_COLLECTION}/${documentPath}`).update({
            pdfFile: storagePath, // Store the generated PDF filename in Firestore if needed
        });

        // Get the recipient email from the document field
        const recipientEmail = newValue.recipientEmail;
        const sendEmailFlag = newValue.sendEmailFlag;

        // Check if sendEmailFlag is present and true before sending the email
        if (sendEmailFlag && recipientEmail) {
            emailer.transporterProp('Gmail', SENDER_EMAIL, APP_PASSWORD);
            emailer.createEmail(SENDER_EMAIL, recipientEmail, 'Sending an Email with Attachment', 'Email test with sending pdf attachment', 'InVoice.pdf', pdfFilePath);
            await emailer.send();

            // Update Firestore to indicate that the email has been sent
            await admin.firestore().doc(`${FIRESTORE_COLLECTION}/${documentPath}`).update({
                emailSent: true,
            });
        }

        // Cleanup: Delete temporary files
        fs.unlinkSync(os.tmpdir());
    });

