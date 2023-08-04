import { readDir, readBinaryFile, FileEntry  } from "@tauri-apps/plugin-fs"
import { Dir, Handle, HandleKind, Item } from ".";

export function asItem(entry: FileEntry): Item {
    return {
        name: entry.name!,
        kind: HandleKind.FILE,
        origin: entry,
        async get() {
            return  new Blob([(await readBinaryFile(this.origin.path)).buffer])
        },
        async isSame(other) {
            return this.origin.path.localeCompare(other.origin.path) == 0
        },
    } as Handle<FileEntry> as Item
}

export function asDir(entry: FileEntry): Dir {
    return {
        name: entry.name!, /* WARNING: nullable */
        origin: entry,
        isRoot: false,
        kind: HandleKind.DIR,
        async getItem(name: string) {
            const maybeChild = entry.children?.find(c => c.name == name)
            return asItem(maybeChild!);
        },
        async *entries() {
            const entries = await readDir(entry.path, {recursive:true});
            for (const entry of entries) {
                if (entry.children) {
                    yield asDir(entry)
                } else {
                    yield asItem(entry)
                }
                entry.name
            }
        },
        async isSame(other: Handle<FileEntry>) {
            return this.origin.path.localeCompare(other.origin.path) == 0
        },
    } as Handle<FileEntry> as Dir
}
