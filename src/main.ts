import {app, BrowserWindow, ipcRenderer, ipcMain} from 'electron';
import * as path from 'path';
import {runProxy} from "./proxy";
import http from "http";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let proxy: http.Server;

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.maximize();

    ipcMain.on('store-data', function (event, store) {
        const target: string = store.target;
        const voter_id: string = store.voter_id;
        const voter_password: string = store.voter_password;
        proxy = runProxy(target, voter_id, voter_password,() => {
            mainWindow.webContents.send('redirect');
        });
    });

    ipcMain.on('proxy-kill', () => {
        if (proxy != null) {
            proxy.close();
            proxy = null;
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
