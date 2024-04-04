const { app, BrowserWindow, ipcMain, contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Disable Node.js integration in the renderer process
            nodeIntegration: false,
            // Use context isolation to protect against prototype pollution
            contextIsolation: true,
            // Preload script to expose ipcRenderer to the renderer process
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('load-tasks', (event) => {
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json')));
    event.sender.send('tasks-updated', tasks);
});

ipcMain.on('add-task', (event, newTask) => {
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json')));
    tasks.push(newTask);
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
    event.sender.send('tasks-updated', tasks);
});

ipcMain.on('remove-task', (event, index) => {
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json')));
    tasks.splice(index, 1);
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
    event.sender.send('tasks-updated', tasks);
});

// Check if contextBridge is available
if (contextBridge) {
    // Expose ipcRenderer to the renderer process
    contextBridge.exposeInMainWorld(
        'electronAPI', {
            send: (channel, data) => {
                // Whitelist channels
                let validChannels = ['load-tasks', 'add-task', 'remove-task'];
                if (validChannels.includes(channel)) {
                    mainWindow.webContents.send(channel, data);
                }
            },
            receive: (channel, func) => {
                // Whitelist channels
                let validChannels = ['tasks-updated'];
                if (validChannels.includes(channel)) {
                    ipcRenderer.on(channel, (event, ...args) => func(...args));
                }
            }
        }
    );
} else {
    console.error('contextBridge is not available. Make sure you are using Electron version 12 or later.');
}
