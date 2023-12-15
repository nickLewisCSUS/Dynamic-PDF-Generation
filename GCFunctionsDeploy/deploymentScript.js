const readline = require('readline');
const fs = require('fs').promises;

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt the user for Firestore project ID
const promptForFirestoreProjectID = () => new Promise((resolve, reject) => {
    rl.question('Enter your Firestore project ID: ', (projectId) => {
        resolve(projectId);
    });
});

// Function to prompt the user for Firestore collection name
const promptForFirestoreCollectionName = () => new Promise((resolve, reject) => {
    rl.question('Enter your Firestore collection name: ', (collectionName) => {
        resolve(collectionName);
    });
});

// Function to prompt the user for the App Password from their Google account
const promptForAppPassword = () => new Promise((resolve, reject) => {
    rl.question('Enter your App Password from your Google account sending out the email: ', (appPassword) => {
        resolve(appPassword);
    });
});

// Function to prompt the user for the email address that will be sending out emails
const promptForSenderEmail = () => new Promise((resolve, reject) => {
    rl.question('Enter the email address that will be sending out emails: ', (senderEmail) => {
        resolve(senderEmail);
    });
});

// Function to prompt the user for the google storage bucket name that will be storing the pdf
const promptForGoogleBucketName= () => new Promise((resolve, reject) => {
    rl.question('Enter your Google Bucket name that will be storing the pdf (ex. gs://<your_bucket_name_here>/): ', (googleBucketName) => {
        resolve(googleBucketName);
    });
});

// Function to prompt the user for the google cloud run service used in pdf generation that has the docker image deployed on it
const promptForGoogleCloudRun= () => new Promise((resolve, reject) => {
    rl.question('Enter your Google Cloud run http server address that has the docker image on it (ex. https://<your_service_name>-<unique_characters>-uc.a.run.app/upload): ', (googleCloudRun) => {
        resolve(googleCloudRun);
    });
});

// Main setup function
const setup = async () => {
    try {
        // Prompt user for required information
        const projectId = await promptForFirestoreProjectID();
        const collectionName = await promptForFirestoreCollectionName();
        const senderEmail = await promptForSenderEmail();
        const appPassword = await promptForAppPassword();
        const googleBucketName = await promptForGoogleBucketName();
        const googleCloudRun = await promptForGoogleCloudRun();

        // Create a configuration object
        const config = {
            firestore_project_id: projectId,
            firestore_collection: collectionName,
            sender_email: senderEmail,
            app_password: appPassword,
            google_bucket_name: googleBucketName,
            google_cloud_run: googleCloudRun,
        };

        // Write the configuration to the config.json file
        await fs.writeFile('config.json', JSON.stringify(config));
        console.log('Firestore project ID, collection name, app password, sender email, google bucket name and cloud run serive saved securely. Press ctrl^D to exit.');

        // Additional setup steps can be added here

    } catch (error) {
        console.error('Error:', error);
        rl.close();
    }
};

// Run the setup function
setup();
