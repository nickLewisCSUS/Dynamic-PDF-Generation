# PDF Generation, Storage, and Email Delivery with Firebase


## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Author](#author)

## About

This project demonstrates how to generate dynamic invoice PDFs from Firebase data, store them in Google Cloud Storage, and send them via email using nodemailer. It consists of multiple components, including Firebase Functions, nodemailer, DockerFile image, Google Cloud Run, and Google Storage.

## Features

- **Dynamic PDF Generation**: Create invoice PDF documents on-the-fly from Firestore data.
- **Storage of PDF**: Store invoice pdf in Google Bucket.
- **Email Delivery**: Send the generated PDFs as email attachments using nodemailer.

## Getting Started

To use this project, you need to have the following prerequisites:

- Firebase project with Firestore enabled
- app password for gmail being used
- Node.js and npm installed locally
- Google Cloud Storage is enabled and "invoice.tex" is stored in your own Google Bucket

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/YourUsername/YourRepository.git
2. Install project dependencies

   ```bash
   cd YourRepository
   cd GCFunctionsDeploy
   npm install
   
   
3. Configure your project by running the 'deploymentScript.js':

   ```bash
   node deploymentScript.js
   This script will prompt you for necessary configurations, including Firestore project ID, collection name, app password, email address, google bucket, google cloud run url.
   
4.  Build docker image and deploy to Google Cloud Run:

      docker build -t us-central1-docker.pkg.dev/<project_id>/lateximage/<image_name>:<image_tag> .
    
      docker push -t us-central1-docker.pkg.dev/<project_id>/lateximage/<image_name>:<image_tag>
      
      gcloud run deploy <image_name> --image us-central1-docker.pkg.dev/<project_id>/lateximage/<iamge_name>:<image_tag> --platform managed --region us-central1

6. Deploy your Firebase Functions:

   ```bash
   npm install firebase-functions
   firebase deploy --only functions --project <YOUR-PROJECT-ID>
   Now your project is ready to dynamically generate, store, and deliver invoice PDFs via email.
   
## Usage

  This project listens for changes in specific Firestore documents. When a document with a designated "create" state is detected, it triggers the following process:

1. Data Fetching: Data is fetched from Firestore using fireStoreDataHandler. It is then used to fill the in voice template's palceholders using fillTemplate. Assumes, the template "invoice.tex" is already stored in you own Google Bucket.
   
   a.) refer to "invoice.tex" template to see what placeholders are needed in the Firestore Database in order to fill the template.
   
   b.) "invoice.tex" utilizes tabular data and uses the placeholder "products" as the table data. Expects firestore document to have field data named "products" as an array that takes in references from other documents       that contain data such as item description, total, tax, etc.

3. PDF Generation: A invoice PDF is generated from the fetched data using GenerateTest.

4. Storage: Once pdf is generated it stores the invoice pdf in a folder named as the document id inside user's Google Bucket.

5. Update Document: The document is updated with the location of the pdf if it is store in storage correctly in the bucket.





Also, the project listens for the "sendEmailFlag" in the field data, set to true as a boolean, in order to send email.

   1. Emailing: Use nodemailer in emailer to send email once "sendEmailFlag" is set to true as a boolean.

   2. Email: Document contains field "recipientEmail" and has the recipient gmail in the text field where the user wants to send email to.

   3. Email status: Document can contain a field named "emailSent" where it contains a boolean on whether the email was sent.
   


## Author
   
  - nicholaslewis3452@gmail.com
    Please refer to the code for more details on how this process is implemented.
    
