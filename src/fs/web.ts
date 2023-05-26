import { UnwrapNestedRefs, reactive } from "vue";
import { FS, Dir, Librarian, Library, Handle, Item, asRoot, Status } from ".";
import { INFO } from "@jcsj/epub/lib/Reader";
import { db } from "../db/dexie";
import { settings_id } from "../settings/settings_id";

export function prepFS(l: Librarian): (rootDir: Dir) => Promise<UnwrapNestedRefs<FS>> {
    return async (rootDir: Dir) => {
        const root = asRoot(rootDir);
        const fs = reactive<FS>({
            root,
            currentDir: root,
            levels: [],
            get inRoot() {
                return this.currentDir.isRoot;
            },
            /**
             * Changing this would also update {{@link FS.dirs}, {@link FS.books}}
             * @returns if currentDir was changed
             */
            async setDir(d: Dir) {
                if (await this.currentDir.isSame(d)) {
                    return false;
                }
                this.currentDir = d;
                await l.sort(d);
                return true;
            },

            /**
             * 
             * @returns whether the current directory was changed
             */
            async goto(d: Dir) {
                if (!this.setDir(d)) {
                    return false;
                }
                if (d.isRoot) {
                    this.levels = [];
                } else {
                    this.levels.push(this.currentDir);
                }

                return true;
            },
            async moveUp() {
                if (this.levels.length <= 0) {
                    return;
                }

                const maybeLast = this.levels.pop();
                if (maybeLast == null) {
                    return;
                }

                await this.setDir(maybeLast);
            },
        })
        //IMPORTANT: update the librarian
        l.sort(root);
        return fs;
    }
}

const g = "granted"
export async function verifyPermission(handle?: FileSystemDirectoryHandle, mode: FileSystemPermissionMode = "read") {
    if (!handle)
        return false;

    const options: FileSystemPermissionDescriptor = {
        mode,
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
export function aDirHandle(h:any): h is FileSystemDirectoryHandle  {
    return h instanceof FileSystemDirectoryHandle;
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

export async function sort(dir: Dir) {
    const books: Library["books"] = {},
        dirs: Library["dirs"] = {};
    for await (const h of dir.entries()) {
        if (h.kind === "file") {
            const file = await h.get();
            if (file.type === INFO.MIME)
                books[h.name] = h
        } else {
            dirs[h.name] = h
        }
    }
    return { books, dirs };
}

export const librarian = reactive<Librarian>({
    dirs: {},
    books: {},
    async sort(dir: Dir) {
        const pair = await sort(dir);
        this.books = pair.books;
        this.dirs = pair.dirs;
        return this;
    },
})

export const createWeb = prepFS(librarian)

export async function isSameEntry(one?: FileSystemHandle, other?: FileSystemHandle) {
    return one?.isSameEntry(other!) || false
}

export function asItem(item: FileSystemFileHandle): Item {
    return {
        name: item.name,
        kind: "file",
        origin: item,
        async get() {
            return item.getFile();
        },
        async isSame(other: Handle<FileSystemHandle>) {
            return item.isSameEntry(other.origin);
        }
    }
}

export function asDir(dir: FileSystemDirectoryHandle): Dir {
    return {
        name: dir.name,
        kind: "directory",
        origin: dir,
        isRoot: false,
        async isSame(other: Handle<FileSystemHandle>) {
            return isSameEntry(dir, other.origin);
        },
        async getItem(name: string) {
            return asItem(await dir.getFileHandle(name));
        },
        async *entries() {
            for await (const [_, h] of dir.entries()) {
                yield h.kind === "file" ? asItem(h) : asDir(h);
            }
        }
    }
}

export async function FileSystemDirectoryHandleToDir(raw: FileSystemDirectoryHandle): Promise<Dir | undefined> {
    return await verifyPermission(raw) ? asDir(raw):undefined;
}