import * as path from 'path';
import * as child from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import { runProxy } from './proxy';
import http from 'http';
import { EVENT_PROXY_KILL, EVENT_STORE_DATA, TOR_COMMAND } from './constants';
import IpcMainEvent = Electron.IpcMainEvent;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}

let proxy: http.Server;

function createWindow() {
	child.exec(TOR_COMMAND);

	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, '../src/views/index.html'));

	ipcMain.on(EVENT_STORE_DATA, function (event: IpcMainEvent, store: any): void {
		const target: string = store.target;
		const voterId: string = store.voter_id;
		const voterPassword: string = store.voter_password;
		proxy = runProxy(target, voterId, voterPassword, () => {
			mainWindow.webContents.send('redirect');
		});
	});

	ipcMain.on(EVENT_PROXY_KILL, () => {
		if (proxy !== undefined) {
			proxy.close();
			proxy = undefined;
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
