window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Data caching will be unavailable.");
}

const DB = {
    name : "library",
    db: undefined,
    request: undefined,
    init() {
        if (this.request !== undefined) {
            console.log("Can only be initialied once!");
        }
        const request = window.indexedDB.open(this.name, 1);

        request.onerror = e => {
            console.log("Why didn't you allow my web app to use IndexedDB?!");
        };
        request.onsuccess = e => {
            const db = e.target.result
            // Do something with request.result!
            db.onerror = e => {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.error("Database error: " + e.target.errorCode);
            };

            const store = db.createObjectStore("book", { keyPath: "title" });
            store.createIndex("metadata", "metadata", { unique: true })

            /* // Use transaction oncomplete to make sure the objectStore creation is
            // finished before adding data into it.
            objectStore.transaction.oncomplete = e => {
                // Store values in the newly created objectStore.
                var objStore = db.transaction(this.name, "readwrite").objectStore("book");
            }; */

            this.db = db;
        };

        this.request = request
    },

    get() {

    },

    /**
     * 
     * @param {Object} metadata 
     */
    set(metadata) {
        const T = this.db.transaction(["book"], "readwrite")
    },

    remove() {

    }
}