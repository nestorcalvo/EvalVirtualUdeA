window.nodeRequire = require;
window.ipcRenderer = require("electron").ipcRenderer;
// delete window.require
// delete window.exports
// delete window.module
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
