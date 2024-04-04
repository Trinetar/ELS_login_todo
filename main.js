const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + '/preload.js'
        }
    });

    mainWindow.loadFile('index.html');

    ipcMain.on('login', (event, { username, password }) => {
        fs.readFile('credentials.json', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const credentials = JSON.parse(data);
            if (credentials[username] === password) {
                mainWindow.webContents.send('login-success', username);
            } else {
                mainWindow.webContents.send('login-failed');
            }
        });
    });
});
