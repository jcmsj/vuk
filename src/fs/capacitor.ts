import { Filesystem as FS } from '@capacitor/filesystem';
import { Dir, Handle, HandleKind, Item } from '.';
import { FileSystemDirectoryHandleToDir } from './web';
export function asItem(name: string): Item {
    return {
        name,
        kind: HandleKind.FILE,
        origin: name,
        async get() {
            const f = FS.readdir(name);
            return
        },
        async isSame(other: Handle<string>) {
            return this.origin.localeCompare(other.origin) == 0
        }
    }
}

export function asDir(name: string): Dir {
    return {
        name,
        origin: name,
        isRoot: false,
        kind: HandleKind.DIR,
        async getItem(name) {
            return asItem(name);
        },
        async *entries() {
            const {files} = await FS.readdir({
                path: this.name
            });
            for (const entry of files) {
                if (entry.type[0] === "d") {
                    yield asDir(entry.name)
                } else {
                    yield asItem(entry.name)
                }
            }
        },
        async isSame(other: Handle<string>) {
            return this.origin.localeCompare(other.origin) == 0
        }
    }
}
