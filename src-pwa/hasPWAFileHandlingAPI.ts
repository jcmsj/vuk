export function isSupported() {
    return "launchQueue" in window && "files" in LaunchParams.prototype;
}