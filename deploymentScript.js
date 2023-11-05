const readline = require('readline');
const fs = require('fs').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptForFirestoreProjectID = () => new Promise((resolve, reject) => {
  rl.question('Enter your Firestore project ID: ', (projectId) => {
    resolve(projectId);
  });
});

const promptForFirestoreCollectionName = () => new Promise((resolve, reject) => {
  rl.question('Enter your Firestore collection name: ', (collectionName) => {
    resolve(collectionName);
  });
});

const promptForSendGridAPIKey = () => new Promise((resolve, reject) => {
  rl.question('Enter your SendGrid API key: ', (apiKey) => {
    resolve(apiKey);
  });
});

const promptForSenderEmail = () => new Promise((resolve, reject) => {
  rl.question('Enter the email address that will be sending out emails: ', (senderEmail) => {
    resolve(senderEmail);
  });
});

const promptForEmailRecipient = () => new Promise((resolve, reject) => {
  rl.question('Enter the email address that will be sent the email: ', (emailRecipient) => {
    resolve(emailRecipient);
  });
});

const setup = async () => {
  try {
    const projectId = await promptForFirestoreProjectID();
    const collectionName = await promptForFirestoreCollectionName();
    const apiKey = await promptForSendGridAPIKey();
    const senderEmail = await promptForSenderEmail(); // Prompt for sender's email
    const emailRec = await promptForEmailRecipient();

    const config = {
      firestore_project_id: projectId,
      firestore_collection: collectionName,
      sendgrid_api_key: apiKey,
      sender_email: senderEmail, // Save sender's email to config
      email_rec: emailRec,
    };

    await fs.writeFile('config.json', JSON.stringify(config));
    console.log('Firestore project ID, collection name, API key, sender email, and email recipient saved securely.');

    // Rest of your setup
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
};

setup();
