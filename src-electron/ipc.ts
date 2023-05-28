import { ipcMain } from "electron";
import * as vuk from "./vuk"

export function prepIPC() {
    ipcMain.handle('dialog:openDirectory', vuk.dir)
    ipcMain.handle("open", vuk.open)
    ipcMain.handle("list", vuk.list)
    ipcMain.handle("launch-file", vuk.getLaunchedFile)
}