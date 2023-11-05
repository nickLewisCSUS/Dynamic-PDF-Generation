# PDF Generation and Email Delivery with Firebase and SendGrid


This project demonstrates how to generate dynamic PDFs from Firebase Firestore data and send them via email using SendGrid. It consists of multiple components, including Firebase Functions, SendGrid integration, and a PDF generator.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Author](#author)

## About

This project leverages Firebase Functions to automate the creation and delivery of PDF documents. It listens for specific Firestore document changes, generates PDFs, and sends them as email attachments using SendGrid.

## Features

- **Dynamic PDF Generation**: Create PDF documents on-the-fly from Firestore data.
- **Email Delivery**: Send the generated PDFs as email attachments using SendGrid.

## Getting Started

To use this project, you need to have the following prerequisites:

- Firebase project with Firestore enabled
- SendGrid account
- Node.js and npm installed locally

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
   This script will prompt you for necessary configurations, including Firestore project ID, collection name, SendGrid API key, and email addresses.

4. Deploy your Firebase Functions:

   ```bash
   npm install firebase-functions
   firebase deploy --only functions --project <YOUR-PROJECT-ID>
   Now your project is ready to dynamically generate and deliver PDFs via email.
   
## Usage

  This project listens for changes in specific Firestore documents. When a document with a designated "create" state is detected, it triggers the following process:

1. Data Fetching: Data is fetched from Firestore using FirestoreDatafetch.

2. PDF Generation: A PDF is generated from the fetched data using PdfGenerator.

3. Email Delivery: The PDF is sent as an email attachment using EmailSend and SendGrid.

   Please refer to the code for more details on how this process is implemented.

## Author

  - nicholaslewis3452@gmail.com
