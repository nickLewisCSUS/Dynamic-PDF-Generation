const { Firestore } = require('@google-cloud/firestore');

class FirestoreDataHandler {
    /**
     * Constructor for the FirestoreDataHandler class.
     * Initializes Firestore using configuration from config.json.
     */
    constructor() {
        const config = require('./config.json');
        this.firestore = new Firestore({
            projectId: config.firestore_project_id
        });
    }

    /**
     * Get a file from storage.
     *
     * @param {object} bucket - Google Cloud Storage bucket.
     * @param {string} filePath - Path to the file in storage.
     * @returns {string} - Content of the file.
     */
    async getStorageFile(bucket, filePath) {
        let fileData;

        const fileJavaScriptObject = bucket.file(filePath);

        try {
            const data = await fileJavaScriptObject.download();
            fileData = data.toString('utf-8'); // Assuming it's a text-based file
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error; // Propagate the error
        }

        return fileData;
    }

    /**
     * Helper function to retrieve data from referenced documents.
     *
     * @param {object} db - Firestore database object.
     * @param {object} tabularData - Tabular data containing references.
     * @returns {object} - Updated tabular data with referenced document data.
     */
    async getDocumentDataReferenceHelper(db, tabularData) {
        for (const ref in tabularData) {
            // Error handling
            console.log('Attempting to retrieve Reference ' + ref + ' Data');
            const path = this.removeSpaces(tabularData[ref].path);
            if (path == null) {
                console.log('Reference path is null');
                continue;
            }
            const documentRef = db.doc(path);
            const documentSnapShot = await documentRef.get();
            const documentData = documentSnapShot.data();
            tabularData[ref] = documentData;
        }
        return tabularData;
    }

    /**
     * Fetch data from Firestore document.
     *
     * @param {string} documentPath - Path to the Firestore document.
     * @returns {object} - Retrieved document data.
     */
    async fetchData(documentPath) {
        const db = this.firestore;
        const documentRef = db.doc(documentPath);
        const doc = await documentRef.get();
        const documentData = doc.data();

        // Check if the document exists
        if (!doc.exists) {
            throw new Error('Document not found');
        }

        let tabularName = null;

        // Identify tabular data in the document
        for (const key in documentData) {
            const value = documentData[key];
            if (Array.isArray(value)) {
                tabularName = key;
            }
        }

        // If tabular data is found, retrieve additional referenced data
        if (tabularName != null) {
            documentData[tabularName] = await this.getDocumentDataReferenceHelper(db, documentData[tabularName]);
        }

        return documentData;
    }

    /**
     * Removes whitespace from the input and returns it.
     *
     * @param {string} input - Input string.
     * @returns {string} - Input string with whitespace removed.
     */
    removeSpaces(input) {
        if (input == null) return null;
        return input.replace(/\s/g, '');
    }
}

// Export the FirestoreDataHandler class
module.exports = FirestoreDataHandler;


