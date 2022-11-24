export interface RxDir<H = FileSystemDirectoryHandle> {
    value?: H;
    root?: H;
    levels: H[];
    setRoot: (h: H) => void;
    isInRoot: () => Promise<boolean>;
    isRoot: (h?: H) => Promise<boolean>;
    goto: (h?: H) => void;
    setDir: (h?: H) => void;
    moveUp: () => void;
    inRoot: boolean;
}

export interface RxSorter<D = FileSystemDirectoryHandle, B=FileSystemFileHandle> {
    dirs: Record<string, D>,
    books: Record<string, B>,
    sort: (dir: D) => Promise<void>;
}