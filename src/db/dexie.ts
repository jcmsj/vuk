import {Dexie, Table, DexieOptions} from "dexie"
import { Bookmark } from "../Bookmarks/Bookmark";

export interface Book {
    id?:number;
    title: string;
    bookmarks:Bookmark[];
    auto?:Bookmark;
}

export interface Settings {
    lastDir?:FileSystemDirectoryHandle,
    electronDir?:string,
    speechRate:number,
    id:number
}

export class VukDB extends Dexie {
    books!:Table<Book>;
    settings!:Table<Settings>;
    constructor(
        databaseName: string, options?: DexieOptions
    ) {
        super(databaseName, options)
        this.version(1).stores({
            books:"id++, title",
            settings:"id",
        })
    }
}

export const db = new VukDB("vuk");