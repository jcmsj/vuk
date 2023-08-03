import {Dexie, Table, DexieOptions} from "dexie"
import { LoadMethod } from "src/Library/Load";
import { Bookmark } from "../Bookmarks/";

export interface Book {
    id?:number,
    title: string,
    bookmarks:Bookmark[],
    auto?:Bookmark,
}

//TODO: Migrate useLocalStorage keys with Settings
export interface Settings {
    id:number,
    lastDir?:FileSystemDirectoryHandle,
    electronDir?:string,
    tauriDir?:string,
    speechRate:number,
    theme:string,
    speechPanel:boolean,
    loadMethod:LoadMethod,
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
