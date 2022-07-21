import reactiveMap from "../modules/reactiveMap";
import type { Bookmark } from "./Bookmark";
export const Bookmarks = reactiveMap<string, Bookmark>()
export default Bookmarks