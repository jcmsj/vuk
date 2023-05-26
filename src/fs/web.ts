import { reactive } from "vue";
import { Dir, Librarian, Library, Handle, Item, Status } from ".";
import { INFO } from "@jcsj/epub/lib/Reader";
import { db } from "../db/dexie";
import { settings_id } from "../settings/settings_id";
import { prepLibrarian } from "./prepLibrarian";
import { prepFS } from "./prepFS";

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
export function aDirHandle(h: any): h is FileSystemDirectoryHandle {
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

export async function sort(dir: Dir): Promise<Library> {
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

export const librarian = reactive<Librarian>(prepLibrarian(sort));
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
    return await verifyPermission(raw) ? asDir(raw) : undefined;
}