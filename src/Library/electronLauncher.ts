import { Platform } from 'quasar';
import { loadBookFromFile } from './fileReader';

/**
 * @Electron
 */
export default async function loadBookFromElectron() {
    if (Platform.is.electron && window.vuk) {
        const maybeBuffer = await window.vuk.getLaunchedFile();
        if (maybeBuffer) {
            loadBookFromFile(new Blob([maybeBuffer]) as File)
        }
    }
}