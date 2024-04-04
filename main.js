// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
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
                mainWindow.loadFile('login.html');
                mainWindow.webContents.send('update-greeting', 'Good Morning');
            } else {
                mainWindow.webContents.send('login-failed');
            }
        });
    });
});
