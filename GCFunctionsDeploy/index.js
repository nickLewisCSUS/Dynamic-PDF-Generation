const functions = require('firebase-functions');
const PdfGenerator = require('./pdfGenerator');
const FirestoreDatafetch = require('./firestoreDatafetch');
const EmailSend = require('./emailSend');

const config = require('./config.json');
const SENDGRID_API_KEY = config.sendgrid_api_key;
const FIRESTORE_COLLECTION = config.firestore_collection;

const emailSend = new EmailSend(SENDGRID_API_KEY);

exports.onCreateStateCreate = functions.firestore
    .document(`${FIRESTORE_COLLECTION}/{docId}`)
    .onWrite(async (change, context) => {
        const newValue = change.after.data();

        // Exit if this is not a creation or the value is not 'create'.
        if (!newValue || newValue.state !== 'create') {
            return null;
        }
        const firestoreDatafetch = new FirestoreDatafetch();
        const data = await firestoreDatafetch.fetchData(`${FIRESTORE_COLLECTION}/${context.params.docId}`);

        const pdfGenerator = new PdfGenerator();
        const pdfBuffer = await pdfGenerator.generatePDF(data);

        await emailSend.sendEmail(pdfBuffer);
    });
