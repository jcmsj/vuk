export {book} from "./useBook";

export interface Progress extends Object{
    elem:Element,
    percentage:number
}

export interface Bookmark extends Object {
    percentage: number,
    selector:string,
    text:string
}