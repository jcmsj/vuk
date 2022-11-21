import { Epub } from "@jcsj/epub";
import { reactive, watch } from "vue";
import { db } from "../db/dexie";
import { aDirHandle, isSameEntry } from "./util";

export interface RxDir<D = FileSystemDirectoryHandle> {
    value?:D;
    root?: D;
    levels:D[];
    setRoot: (h: D) => void;
    isInRoot: () => Promise<boolean>;
    isRoot: (d?:D) => Promise<boolean>;
    goto: (h?: D) => void;
    setDir: (h?: D) => void;
    moveUp: () => void;
    inRoot:boolean;
}

export const settings_id = 0;
export const Dir = reactive<RxDir>({
    value: undefined,
    root: undefined,
    levels: [],
    inRoot:false,
    setRoot(h) {
        if (aDirHandle(h)) {
            this.root = h;
        }
    },
    async isRoot(d) {
        return isSameEntry(this.root, d)
    },
    async isInRoot() {
        return this.isRoot(this.value)
    },
    async goto(h) {
        if (!h || !aDirHandle(h))
            this.value = this.root;

        if (await isSameEntry(this.value, h)) {
            return
        }

        if (await this.isRoot(h)) {
            this.levels = [];
        } else {
            this.levels.push(this.value!);
        }

        this.setDir(h)
    },

    async setDir(h) {
        if (await isSameEntry(this.value, h))  {
            return
        }

        this.value = h;
        await Sorter.sort(h!)
    },

    async moveUp() {
        if (this.levels.length)
            this.setDir(this.levels.pop())
    }
})

watch(() => Dir.value, async(d) => {
    Dir.inRoot = await Dir.isRoot(d)
})
export interface RxSorter<D = FileSystemDirectoryHandle> {
    dirs: Record<string, D>,
    books: Record<string, FileSystemFileHandle>,
    sort: (dir: D) => Promise<void>;
}

export enum Status {
    unset,
    granted,
    denied
}

export async function getLastWorkingDir(): Promise<{
    status: Status;
    handle?: FileSystemDirectoryHandle;
}> {
    const entry = await db.settings.get({ id: settings_id })

    if (!entry || !aDirHandle(entry.lastDir)) //Maybe a new user
        return { status: Status.unset }

    if (await verifyPermission(entry.lastDir, "read")) {
        return { status: Status.granted, handle: entry.lastDir }
    }

    return { status: Status.denied };
}
export const Sorter = reactive<RxSorter>({
    books: {},
    dirs: {},
    async sort(dir) {
        const books:typeof this.books = {}, //reset
        dirs:typeof this.dirs = {};
        try {
            for await (const [key, h] of dir.entries()) {
                if (h.kind === "file") {
                    const file = await h.getFile()
                    if (file.type === Epub.MIME)
                        books[key] = h
                } else {
                    dirs[key] = h
                }
            }

            this.books = books;
            this.dirs = dirs;
        } catch (e) {
            console.log(e);
        }
    }
})

const g = "granted"
export async function verifyPermission(handle?: FileSystemDirectoryHandle, mode: FileSystemPermissionMode = "read") {
    if (!handle)
        return false;

    const options: FileSystemPermissionDescriptor = {
        mode,//WARN: below props unsure
        handle,
        name: "push"
    };
    // Check if permission was already granted.
    if ((await handle.queryPermission(options)) === g) {
        return true;
    }
    // Request permission.
    if ((await handle.requestPermission(options)) === g) {
        return true;
    }

    // Permission denied.
    return false;
}