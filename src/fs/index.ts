export interface Library {
    dirs: Record<string, Dir>,
    books: Record<string, Item>,
}

export interface FS {
    currentDir: Dir,
    readonly root: RootDir;
    levels: Dir[];
    inRoot: boolean;
    goto: (d: Dir) => Promise<boolean>;
    setDir: (d: Dir) => Promise<boolean>;
    moveUp: () => void;
}

/**
 * Handles converting the respective File Interfaces for all platforms compatible with {@link FS}
 */
export interface Transformer {
    sort: (dir: Dir) => Promise<Library>;
}

export interface Librarian extends Transformer, Library {}
export interface Handle<O = any> {
    isSame(other: Handle): Promise<boolean>;
    name: string;
    kind: "directory"|"file";
    origin:O;
}

export interface Item extends Handle {
    get: () => Promise<File>;
    kind:"file";
}

export interface RootDir extends Dir {
    isRoot:true;
}

export interface Dir extends Handle {
    readonly name: string;
    kind:"directory";
    readonly isRoot: boolean;
    getItem: (name:string) => Promise<Item>;
    entries: () => AsyncIterableIterator<Item | Dir>;
}

export enum Status {
    unset,
    granted,
    denied
}

export function asRoot(dir: Dir): RootDir {
    return { ...dir, isRoot: true };
}