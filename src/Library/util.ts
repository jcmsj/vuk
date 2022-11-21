export function aDirHandle(h:any): h is FileSystemDirectoryHandle  {
    return h instanceof FileSystemDirectoryHandle;
}

export async function isSameEntry(one?:FileSystemDirectoryHandle, other?:FileSystemHandle)  {
    return one?.isSameEntry(other!) || false
}