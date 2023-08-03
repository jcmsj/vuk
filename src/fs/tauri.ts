import { readDir, readBinaryFile, FileEntry, } from "@tauri-apps/plugin-fs"
import { Dir, Handle, HandleKind, Item } from ".";

export function asItem(entry: FileEntry): Item {
    return {
        name: entry.name!,
        kind: HandleKind.FILE,
        origin: entry,
        async get() {
            const ns = await readBinaryFile(this.origin.path);
            return new File([new Blob([ns])], entry.name!)
        },
        async isSame(other: Handle<FileEntry>) {
            return this.origin.path.localeCompare(other.origin.path) == 0
        },
    } as Handle<FileEntry> as Item
}

/* export function full(name:string):string {
    if (library.value == undefined)
        return ""
    //root + folders + name
    const paths = library.value.levels
        .map(({name}) => name);
    if (name.localeCompare(library.value.currentDir.name) != 0) {
        paths.push(library.value.currentDir.name);
    }
    return [...paths, name].join("/");
} */

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
            const entries = await readDir(entry.path);
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
