const DB = {
    name: "library",
    db: undefined,
    store : "book",
    ver : 3,
    preInit() {
        /* window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange; */

        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Data caching will be unavailable.");
        }
    },
    init() {
        this.preInit()

        const request = window.indexedDB.open(this.name, this.ver);

        request.onupgradeneeded = e => {
            const db = e.target.result;
            /* if (e.oldVersion  < this.ver) {
                db.deleteObjectStore("book")

            } */
            db.onerror = e => {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.error("Database error: " + e.target.errorCode);
            };

            const store = db.createObjectStore(this.store, { keyPath: "name" });
            store
        };

        request.onsuccess = e => {
            this.db = e.target.result;
        }
    },

    async get(key, cb) {
        const open = window.indexedDB.open(this.name);
        open.onsuccess = async(e) => {
            const req = await e.target.result
                .transaction([this.store])
                .objectStore(this.store)
                .get(key)
            req.onsuccess = r => {
                cb(r.target.result)
            }
        }
    },

    async getBooks(n, cb) {
        const open = window.indexedDB.open(this.name);
        open.onsuccess = async(e) => {
            const req = await e.target.result
                .transaction([this.store])
                .objectStore(this.store)
                .getAllKeys(n)

            req.onsuccess = r => {
                cb(r.target.result)
            }
        }
    },
    /**
     * 
     * @param {File} file
     */
    set(file) {
        file.arrayBuffer().then((arrayBuffer) => {
            const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type });

            const open = window.indexedDB.open(this.name);
            open.onsuccess = e => {
                e.target.result
                    .transaction([this.store], "readwrite")
                    .objectStore(this.store)
                    .put({"name":file.name, "blob": blob})
            }
        });
    },

    resetStore() {
        const open = window.indexedDB.open("library"); 
        open.onsuccess = e => {
            e.target.result
                .transaction([this.store], "readwrite")
                .deleteObjectStore("library")
        }
    },
    remove(key) {
        const {T, store} = this.newAction("readwrite");

        const req = store.delete(key);
        req.onsuccess = () => {
            console.log("Removed:", key);
        };
    }
}

export default DB