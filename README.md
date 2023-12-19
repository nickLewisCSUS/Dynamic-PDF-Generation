# PDF Generation, Storage, and Email Delivery with Google Firebase


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

- Firebase project with Firestore enabled (Make sure to know your project ID). The link here will show you the steps: https://firebase.google.com/docs/firestore/quickstart
- app password for gmail being used. To know how to get app password go to link here: https://support.google.com/accounts/answer/185833?hl=en
- Node.js version 18 or higher and npm installed locally. Here is the official node.js website: https://nodejs.org/en
- Google Cloud Storage is enabled and "invoice.tex" is uploaded in your own Google Bucket: Here is how to get Google Bucket: https://cloud.google.com/storage/docs/creating-buckets
- Docker Desktop is installed on your local machine and is open for use. Here is the link to install docker: https://www.docker.com/products/docker-desktop/

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/YourUsername/YourRepository.git
   
2.  Build docker image and deploy to Google Cloud Run (Docker desktop must be installed on your local machine and opened in order to build image):

      ```bash
      cd YourRepository
      cd LatexDockerFolder
      docker build -t us-central1-docker.pkg.dev/<firebase_project_id>/lateximage/<image_name>:<image_tag> .
      docker push -t us-central1-docker.pkg.dev/<firebase_project_id>/lateximage/<image_name>:<image_tag>
      gcloud run deploy <image_name> --image us-central1-docker.pkg.dev/<firebase_project_id>/lateximage/<image_name>:<image_tag> --platform managed --region us-central1

   Google Cloud Run url should pop up after deployment. Make sure to save it.

3. Install project dependencies

   ```bash
   cd ..
   cd GCFunctionsDeploy
   npm install
      
4. Configure your project by running the 'deploymentScript.js':

   ```bash
   node deploymentScript.js
   This script will prompt you for necessary configurations, including Firestore project ID, collection name, app password, email address, google bucket, google cloud run url.
    
6. Deploy your Firebase Functions:

   ```bash
   npm install firebase-functions
   firebase deploy --only functions --project <YOUR-PROJECT-ID>
   Now your project is ready to dynamically generate, store, and deliver invoice PDFs via email.
   
## Usage

![Local Image](/firestore_database_image.JP)


  This project listens for changes in specific Firestore documents. When a document with a designated "create" state is detected, it triggers the following process:

1. Data Fetching: Data is fetched from Firestore using fireStoreDataHandler. It is then used to fill the invoice.tex template's placeholders using fillTemplate. Assumes, the template "invoice.tex" is already stored in your own Google Bucket.
   
   a.) refer to "invoice.tex" template to see what placeholders are needed in the Firestore Database field and text boxes within the document. These are used to  the template.
   
   b.) "invoice.tex" utilizes tabular data and uses the placeholder "products" as the table data. Expects firestore document to have field data named "products" as an array that takes in references from other documents. References should contain data such as item description, total, tax, etc.

3. PDF Generation: A invoice PDF is generated from the fetched data using generateTest. GenerateTest uses a http request from google cloud run with the docker image that does the conversion process

4. Storage: Once pdf is generated, it stores the invoice pdf in a folder named as the document id inside user's Google Bucket as well as the filledTemplate.

5. Update Document: The document is updated with the location of the pdf.


##

Also, the project listens for the "sendEmailFlag" in the field data, set to true as a boolean, in order to send email.

   1. Emailing: Use nodemailer in emailer to send email once "sendEmailFlag" is set to true as a boolean.

   2. Email: Document contains field "recipientEmail" and has the recipient gmail in the text field where the user wants to send email to.

   3. Email status: Document can contain a field named "emailSent" where it contains a boolean on whether the email was sent.
   


## Author
   
  - nicholaslewis3452@gmail.com
    Please refer to the code for more details on how this process is implemented.
    
