// preload.js

window.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron');

    const secureChannels = ['update-greeting']; // Define secure channels here

    const secureReceive = (channel, func) => {
        if (secureChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    };

    const secureSend = (channel, data) => {
        if (secureChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    };

    window.electron = {
        receive: secureReceive,
        send: secureSend
    };
});
