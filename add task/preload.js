// preload.js

const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld(
    'electronAPI', {
        send: (channel, data) => {
            // Whitelist channels
            let validChannels = ['load-tasks', 'add-task', 'remove-task'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
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
