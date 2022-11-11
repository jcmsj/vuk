import { Book } from "../db/dexie";
import { reactive } from "vue";

export const book = reactive<Book>({
    id:-1,
    title:"Vuk", 
    bookmarks:[],
});