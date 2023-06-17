import { Dir, Handle, HandleKind, Item } from ".";
import { library } from "src/Library";

export function asItem(name:string):Item {
    return {
        name,
        kind: HandleKind.FILE,
        origin: name,
        async get() {
            const buffer =await window.vuk.open(full(this.name));
            return new Blob([buffer]) as File;
        },
        async isSame(other: Handle<string>) {
            return this.origin.localeCompare(other.origin) == 0
        },
    } as Handle<string> as Item
}

export function full(name:string):string {
    if (library.value == undefined)
        return ""
    //root + folders + name
    const paths = library.value.levels
        .map(({name}) => name);
    if (name.localeCompare(library.value.currentDir.name) != 0) {
        paths.push(library.value.currentDir.name);
    }
    return [...paths, name].join("/");
}

export function asDir(name:string):Dir {
    return {
        name,
        origin: name,
        isRoot: false,
        kind:HandleKind.DIR,
        async getItem(name) {
            return asItem(full(name));
        },
        async *entries() {
            const pair = await window.vuk.list(full(this.name));
            for (const dirent of Object.values(pair.dirs)) {
                yield asDir(dirent.name);
            }
            for (const filent of Object.values(pair.books)) {
                yield asItem(filent.name)
            }
        },
        async isSame(other: Handle<string>) {
            return this.origin.localeCompare(other.origin) == 0
        },
    }
}
