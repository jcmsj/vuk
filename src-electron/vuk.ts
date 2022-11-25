import { dialog } from "electron";
import { Dirent } from "fs";
import { readdir, readFile } from "fs/promises"
import { mainWindow } from "./electron-main";

type InvokeEV = Electron.IpcMainInvokeEvent;
export async function list(e: InvokeEV, name: string) {
    const dirs:Record<string, Dirent> = {}
    const books:Record<string, Dirent> = {}
    const items = await readdir(name, {
        withFileTypes: true
    })

    for (const item of items) {
        if (item.isDirectory()) {
            dirs[item.name] = item;
        } else if (item.name.endsWith(".epub")) {
            books[item.name] = item;
        }
    }

    return {dirs, books}
}

export async function open(e: InvokeEV, name: string) {
    return readFile(name)
}

export async function dir(e: InvokeEV, name:string) {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory']
    })
    
    return canceled ? undefined : filePaths[0]/* .replaceAll("\\","/") */
}