import { Dirent } from "fs"

export interface VukElectron {
    open:(e:Electron.IpcMainInvokeEvent, name:string) => Promise<Buffer>,
    list:(e:Electron.IpcMainInvokeEvent, name:string) => Promise<DirectoryEntry[]>,
    dir:(e:Electron.IpcMainInvokeEvent) => Promise<Buffer | undefined>
}

export interface Vuk {
    open:(name:string) => Promise<Buffer>,
    list:(name:string) => Promise<{dirs:Record<string, Dirent>, books:Record<string, Dirent>}>,
    dir:() => Promise<string | undefined>,
    getLaunchedFile:() =>Promise<Buffer | undefined>
}
declare global {
    interface Window {
        "vuk": Vuk
    }
}