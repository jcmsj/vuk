import { UnwrapNestedRefs, reactive } from "vue";
import { FS, Dir, Librarian, asRoot } from ".";
import { librarian } from "./prepLibrarian";

export function prepFS(l: Librarian): (rootDir: Dir) => Promise<UnwrapNestedRefs<FS>> {
    return async (rootDir: Dir) => {
        const root = asRoot(rootDir);
        return reactive<FS>({
            root,
            currentDir: root,
            levels: [],
            get inRoot() {
                return this.currentDir.isRoot;
            },
            /**
             * Changing this would also update {{@link FS.dirs}, {@link FS.books}}
             * @returns if currentDir was changed
             */
            async setDir(d: Dir) {
                if (await this.currentDir.isSame(d)) {
                    return false;
                }
                this.currentDir = d;
                await l.sort(d);
                return true;
            },

            /**
             *
             * @returns whether the current directory was changed
             */
            async goto(d: Dir) {
                if (!this.setDir(d)) {
                    return false;
                }
                if (d.isRoot) {
                    this.levels = [];
                } else {
                    this.levels.push(this.currentDir);
                }

                return true;
            },
            async moveUp() {
                if (this.levels.length <= 0) {
                    return;
                }

                const maybeLast = this.levels.pop();
                if (maybeLast == null) {
                    return;
                }

                await this.setDir(maybeLast);
            },
        });
    };
}

export const createFS = prepFS(librarian)