window.nodeRequire = require;

delete window.require;
delete window.exports;
delete window.module;
const { contextBridge, ipcRenderer, remote } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
document.addEventListener("DOMNodeInserted", function (event) {
  if (!!window && !window.$) {
    window.$ = window.jQuery = require("jquery");
  }
});

contextBridge.exposeInMainWorld("electron", {
  wrongCohort: () => ipcRenderer.send("wrongCohort", "Hola"),
  exam: () => ipcRenderer.send("exam"),
  login: (data) => ipcRenderer.send("login", data),
  remote_pre: (data) => remote.getGlobal(data),
});
contextBridge.exposeInMainWorld("api", {
  //send: (channel, data) => {
  request: (channel, data) => {
    // whitelist channels

    let validChannels = ["toMain"];
    // if (validChannels.includes(channel)) {
    ipcRenderer.send(channel, data);
    // }
  },
  //receive: (channel, func) => {
  response: (channel, func) => {
    let validChannels = ["software", "externalDisplay", "externalWebcam"];
    // console.log(validChannels);
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      // console.log(channel);

      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
