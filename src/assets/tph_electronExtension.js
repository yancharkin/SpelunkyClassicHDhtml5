// Hack to make code work on both Electron and standalone PWA
// without rewriting main script (or recompiling the game).
function isStandalone() {
    if (window.matchMedia("(display-mode: browser)").matches) {
        return false;
    }
    return true;
}
function isElec() {
    return navigator.userAgent.toLowerCase().indexOf("electron") > -1;
}
function isElectron() {
    return (isElec()) || (isStandalone());
}
if (isElectron()) {
    let windowSize = [window.innerWidth, window.innerHeight],
        aspectRatio = windowSize[0] / windowSize[1];
    var defaultWinSize = [800, Math.round(800 / aspectRatio)],
        canvas = document.getElementById("canvas");
}

function electronQuit() {
    window.close();
}
function electronSetFullscreen(fullscreen) {
    if (fullscreen) {
        try {
            if (!document.fullscreenElement) {
                canvas.requestFullscreen();
            }
        } catch (error) {
            console.log(error);
        }
        return [window.screen.width, window.screen.height];
    } else {
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        } catch (error) {
            console.log(error);
        }
        return defaultWinSize;
    }
}
