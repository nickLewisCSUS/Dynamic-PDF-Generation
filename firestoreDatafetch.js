const { Firestore } = require('@google-cloud/firestore');

class FirestoreDataFetch {
    constructor() {
        const config = require('./config.json');
        this.firestore = new Firestore({
            projectId: config.firestore_project_id
        });
    }

    async fetchData(documentPath) {
        const documentRef = this.firestore.doc(documentPath);
        const doc = await documentRef.get();
        if (!doc.exists) {
            throw new Error('Document not found');
        }
        return doc.data();
    }
}

module.exports = FirestoreDataFetch;