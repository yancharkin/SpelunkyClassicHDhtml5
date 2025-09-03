window.onresize = (e) => {ensureAspectRatio()};

const CHANGE_ASPECT_RATIO = true;

// (Electron & PWA) Prevent exit from fullscreen after Esc pressed
if (navigator.keyboard && navigator.keyboard.lock){
    navigator.keyboard.lock(['Escape'])
}

var isStandalone = !window.matchMedia("(display-mode: browser)").matches
        || navigator.userAgent.toLowerCase().indexOf("electron") > -1;
var bodyElement = document.getElementsByTagName("body")[0];
var spinnerElement = document.getElementById("spinner");
var canvasElement = document.getElementById("canvas");

var startingHeight, startingWidth;
var startingAspect;

var Module = {
    print: (function () {
        var element = document.getElementById("output");
        if (element) element.value = ""; // clear browser cache
        return function (text) {
            if (arguments.length > 1)
              text = Array.prototype.slice.call(arguments).join(" ");
            console.log(text);
            // It seems that this text ensures game is loaded.
            if (text === "Entering main loop.") {
              spinnerElement.style.display = "none";
              ensureAspectRatio();
            } else if (text === "###game_end###0") {
                if (isStandalone) {
                    window.close();
                } else {
                    location.reload();
                }
            }
        };
    })(),

    printErr: function (text) {
        if (arguments.length > 1)
            text = Array.prototype.slice.call(arguments).join(" ");
        console.error(text);
    },

    canvas: (function () {
        var canvas = document.getElementById("canvas");
        return canvas;
    })(),
};

var g_pWadLoadCallback = undefined;
function setWadLoadCallback( _wadLoadCallback )
{
    g_pWadLoadCallback = _wadLoadCallback;
}

var g_pAddAsyncMethod = -1;

function setAddAsyncMethod( asyncMethod )
{
    g_pAddAsyncMethod = asyncMethod;
}

var g_pJSExceptionHandler = undefined;

function setJSExceptionHandler( exceptionHandler )
{
    if (typeof exceptionHandler == "function") {
        g_pJSExceptionHandler = exceptionHandler;
    }
}

function hasJSExceptionHandler()
{
    return (g_pJSExceptionHandler != undefined) && (typeof g_pJSExceptionHandler == "function");
}

function doJSExceptionHandler( exceptionJSON )
{
    if (typeof g_pJSExceptionHandler == "function") {
        var exception = JSON.parse( exceptionJSON );
        g_pJSExceptionHandler( exception );
    }
}

function manifestFiles()
{
    return ["runner.data",
            "runner.js",
            "runner.wasm",
            "game.unx"].join( ";");
}

function manifestFilesMD5()
{
    return ["967a9b55bb89ac19446dfa3ef86e7742",
            "e326eaa5b8c4615cc473610459395225",
            "e8f1e8db8cf996f8715a6f2164c2e44e",
            "42c41e4d68403d680a94527a93e9d33a"];
}

function onGameSetWindowSize(width,height)
{
      console.log("Window size set to width: " + width + ", height: " + height);
      startingHeight = height;
      startingWidth = width;
      startingAspect = startingWidth / startingHeight;
}

function ensureAspectRatio() {
    if (canvasElement === undefined) {
        return;
    }

    if (!CHANGE_ASPECT_RATIO) {
        return;
    }

    if (startingHeight === undefined && startingWidth === undefined) {
        return;
    }

    canvasElement.classList.add("active");

    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    var newHeight, newWidth;

    // Find the limiting dimension.
    var heightQuotient = startingHeight / maxHeight;
    var widthQuotient = startingWidth / maxWidth;

    if (heightQuotient > widthQuotient) {
        // Max out on height.
        newHeight = maxHeight;
        newWidth = newHeight * startingAspect;
    } else {
        // Max out on width.
        newWidth = maxWidth;
        newHeight = newWidth / startingAspect;
    }

    canvasElement.style.height = newHeight + "px";
    canvasElement.style.width = newWidth + "px";
}
