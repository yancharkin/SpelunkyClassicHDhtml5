const path = require('path')
const { app, BrowserWindow, screen } = require('electron')

function calculateWindowSize() {
    //let screenSize = screen.getPrimaryDisplay().size;
    let mousePosition = screen.getCursorScreenPoint();
    let activeDisplay = screen.getDisplayNearestPoint(mousePosition);
    let screenSize = activeDisplay.size;
    let aspectRatio = screenSize.width/screenSize.height;
    return [800, Math.round(800/aspectRatio)];
}

function createWindow () {
    let win = new BrowserWindow({
        backgroundColor: "#000000",
        frame: false,
        resizable: false,
        icon: path.join(__dirname, 'assets/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            //webgl: false
        }
    })
    winSize = calculateWindowSize();
    win.resizable = true;
    win.setSize(winSize[0], winSize[1]);
    win.resizable = false;

    win.loadFile('index.html');
    //win.webContents.openDevTools();
}
app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow);
