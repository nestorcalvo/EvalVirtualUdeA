const {
  app,
  BrowserWindow,
  Menu,
  screen,
  net,
  desktopCapturer,
  ipcMain,
} = require("electron");
const psList = require("ps-list");
const path = require("path");
const fkill = require("fkill");
const { clearInterval } = require("timers");
const os = require("os");
const log = require("electron-log");
const { RemoteSoftwareList } = require("./remotesoftwarelist.js");

const EXAM_URL = "https://aprende.udea.edu.co/course/view.php?id=24";
let isDev = true;
let serverCloseRequested = false;
let remoteSoftwareFound = false;
let webcamSuspicious = false;
let externalDisplay = false;
let userId, deviceInfo;
let mainWindow;
let warnWindowChild = null;
let firstSendWarning = true;
let softwareToKill;
ipcMain.handleOnce("software", () => {
  return "";
});
ipcMain.handleOnce("extraScreen", () => {
  return false;
});
if (app.isPackaged) {
  console.log = log.log;
  isDev == false;
}
function closeApp() {
  const body = {
    identification: userId,
    type_log: 1,
    remoteControl: false,
    externalDevices: false,
    externalScreen: false,
    description: "Aplicación cerrada",
    information: "",
  };
  sendInformationBack(body);
}
function takeScreenshoot(description) {
  console.log("Verificacion de pantallazo");
  const mainScreen = screen.getPrimaryDisplay();

  desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: mainScreen.size,
    })
    .then((sources) => {
      for (const source of sources) {
        if (source.name === "Entire screen" || source.name === "Screen 1") {
          try {
            let file = source.thumbnail.toDataURL();
            console.log(description);
            const body = {
              identification: userId,
              type_log: 4,
              remoteControl: remoteSoftwareFound,
              externalDevices: webcamSuspicious,
              externalScreen: externalDisplay,
              description: description,
              information: file.split(",")[1],
            };
            sendInformationBack(body);
          } catch (error) {
            console.error(error);
          }
        }
      }
    });
}
function sendInformationBack(body) {
  console.log("Envio de informacion solicitada");
  const request = net.request({
    method: "POST",
    protocol: "https:",
    hostname: "biometria-api-develop.udea.edu.co/admissionExam/evalUdea",
    path: "/sendWarnings",
  });
  request.setHeader(
    "Token-Security",
    "13bqmrE5RBwj1Pj2FYxAshlQPyljjf8NZl4yZ5Fvm1wMJ0XnmcwCAgTqY6x0xuBC5K41n"
  );
  request.setHeader("Content-Type", "application/json");
  request.write(JSON.stringify(body), "utf-8");
  request.on("response", (response) => {
    console.log(response.statusCode);
    if (response.statusCode == 401) {
      return false;
    }
    response.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    response.on("end", () => {
      // response.on("data", (chunk) => {
      //   console.log(`BODY: ${chunk}`);
      // });
      console.log("Evento fin send information");
      if (response.statusCode == 200) {
        console.log("Codigo de respuesta 200");
        return true;
      }
    });
  });
  request.end();
}
async function consultarMultiplesPantallas() {
  // Obtener una matriz de todas las pantallas disponibles
  const displays = screen.getAllDisplays();

  // Mostrar la cantidad de pantallas disponibles
  console.log(`Hay ${displays.length} pantallas disponibles`);
  externalDisplay = false;
  if (displays.length > 1) {
    console.log("Se debe realizar bloqueo por pantalla externa");
    externalDisplay = true;
    if (firstSendWarning) {
      console.log("Entrada a creacion de warn window");
      if (userId) {
        //

        let descriptionPost = "El usuario tiene: ";
        if (notAwllowedSoftware) {
          descriptionPost += `[Softwares no permitidos: ${notAwllowedSoftware}]`;
        }
        if (webcamSuspicious) {
          descriptionPost += `[Camara sospechosa]`;
        }
        if (externalDisplay) {
          descriptionPost += `[Pantalla externa]`;
        }
        console.log("descripcion", descriptionPost);
        let info = "";
        let log = 3;

        const body = {
          identification: userId,
          type_log: log,
          remoteControl: false,
          externalDevices: webcamSuspicious,
          externalScreen: externalDisplay,
          description: descriptionPost,
          information: info,
        };
        sendInformationBack(body);
      }

      const urlWarn = isDev
        ? "http://localhost:3000#warning"
        : url.format({
            pathname: path.join(__dirname, "index.html"),
            hash: "/warning",
            protocol: "file:",
            slashes: true,
          });
      if (warnWindowChild !== null) {
        warnWindowChild.close();
        mainWindow.show();
        warnWindowChild = null;
      } else {
        createWarnWindow();
      }

      warnWindowChild.loadURL(urlWarn);
      firstSendWarning = false;
      ipcMain.removeHandler("extraScreen");
      ipcMain.handleOnce("extraScreen", () => {
        return externalDisplay;
      });
    }
  }
}
async function consultarSoftwareSospechosos() {
  // Extract list of software
  const softwareList = await psList();

  // Create sets to store different values
  const setNames = new Set();
  let notAwllowedSoftware = new Set();
  softwareToKill = new Set();
  // Check all the values found in the list of software
  softwareList.forEach((element) => {
    // Remove the extension and lowercase the string value
    const softwareName = element.name.split(".")[0].toLowerCase();
    // Add just one name of the software (in case of being repited)
    setNames.add(softwareName);
    const remoteSfwList = RemoteSoftwareList.map((word) => word.toLowerCase());
    // If there is a software in the list of software defined previously then trigger add it to a set
    if (remoteSfwList.includes(softwareName)) {
      softwareToKill.add(element.name);
      notAwllowedSoftware.add(softwareName);
    }
  });
  notAwllowedSoftware = [...notAwllowedSoftware];

  if (notAwllowedSoftware.length > 0) {
    console.log(
      "Lista de software no permitidos encontrados: ",
      notAwllowedSoftware
    );
    console.log(
      "Se debe enviar informacion de software abierto, tomar captura y cerrar software"
    );
    if (firstSendWarning) {
      console.log("Entrada a creacion de warn window");
      if (userId) {
        //

        let descriptionPost = "El usuario tiene: ";
        if (notAwllowedSoftware) {
          descriptionPost += `[Softwares no permitidos: ${notAwllowedSoftware}]`;
        }
        if (webcamSuspicious) {
          descriptionPost += `[Camara sospechosa]`;
        }
        if (externalDisplay) {
          descriptionPost += `[Pantalla externa]`;
        }
        console.log("descripcion", descriptionPost);
        let info = "";
        let log = 3;

        const body = {
          identification: userId,
          type_log: log,
          remoteControl: true,
          externalDevices: webcamSuspicious,
          externalScreen: externalDisplay,
          description: descriptionPost,
          information: info,
        };
        sendInformationBack(body);
      }

      const urlWarn = isDev
        ? "http://localhost:3000#warning"
        : url.format({
            pathname: path.join(__dirname, "index.html"),
            hash: "/warning",
            protocol: "file:",
            slashes: true,
          });
      if (warnWindowChild !== null) {
        warnWindowChild.close();
        mainWindow.show();
        warnWindowChild = null;
      } else {
        createWarnWindow();
      }

      warnWindowChild.loadURL(urlWarn);
      firstSendWarning = false;
      ipcMain.removeHandler("software");
      ipcMain.handleOnce("software", () => {
        return notAwllowedSoftware;
      });
    }
  }
}
ipcMain.on("close_software", (event, args) => {
  console.log("Entrada a cerrar programas");
  softwareToKill = [...softwareToKill];
  let promiseArray = softwareToKill.map(function (process) {
    return fkill(process, {
      tree: true,
      force: true,
      ignoreCase: true,
      silent: true,
    });
  });
  Promise.all(promiseArray)
    .then(() => {
      console.log("Software no permitido terminado");
      firstSendWarning = true;
    })
    .catch((err) => {
      console.error(`Error while solving the promises of closing the programs`);
      console.error(err);
    });
});
const isMac = process.platform === "darwin";
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },

  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "forceReload" }],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
const getDeviceInfo = () => {
  const cpus = os.cpus();

  deviceInfo = {
    arch: os.arch(),
    processor: os.cpus(),
    ram: os.totalmem(),
    name: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    platform: os.platform(),
    kernel: os.version(),
    freemem: os.freemem(),
  };
  if (os.type() === "Darwin") {
    checkCamera();
  }
};
ipcMain.on("login", (event, args) => {
  console.log("Entrada a login");
  userId = args;
  mainWindow.show();
  const homeUrl = isDev
    ? "http://localhost:3000#home"
    : url.format({
        pathname: path.join(__dirname, "index.html"),
        hash: "/home",
        protocol: "file:",
        slashes: true,
      });
  mainWindow.loadURL(homeUrl);

  getDeviceInfo();
  const body = {
    identification: userId,
    type_log: 0,
    remoteControl: false,
    externalDevices: false,
    externalScreen: false,
    description: "Registro informacion PC",
    information: Buffer.from(JSON.stringify(deviceInfo)).toString("base64"),
  };
  sendInformationBack(body);
});
ipcMain.on("exam", (event, args) => {
  console.log("Iniciar examen");
  mainWindow.show();
  mainWindow.loadURL(EXAM_URL);

  const body = {
    identification: userId,
    type_log: 1,
    remoteControl: false,
    externalDevices: false,
    externalScreen: false,
    description: "Examen iniciado",
    information: "",
  };
  sendInformationBack(body);
});
ipcMain.on("wrongCohort", (event, args) => {
  console.log("Wrong cohort");
  if (!warnWindowChild) {
    createWarnWindow();
  }
  const urlWrongCohort = isDev
    ? "http://localhost:3000#wrongCohort"
    : url.format({
        pathname: path.join(__dirname, "index.html"),
        hash: "/wrongCohort",
        protocol: "file:",
        slashes: true,
      });

  warnWindowChild.loadURL(urlWrongCohort);
  warnWindowChild.once("show", () => {
    console.log("Wrong cohort message showed");
  });
  warnWindowChild.once("ready-to-show", () => {
    warnWindowChild.show();
  });
});
ipcMain.on("closeWindow", (event, args) => {
  if (warnWindowChild) {
    warnWindowChild = null;
  }
  if (mainWindow) {
    mainWindow = null;
    app.quit();
  }
});
ipcMain.on("closeWarnWindow", (event, args) => {
  if (warnWindowChild) {
    warnWindowChild.close();
    warnWindowChild = null;
    mainWindow.show();
  }
});
ipcMain.on("take_screenshot", (event, args) => {
  if (userId) {
    takeScreenshoot("Screenshot");
  }
});
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: isDev ? 800 : screen.width,
    height: isDev ? 600 : screen.height,
    minimizable: isDev ? true : false,
    maximizable: isDev ? true : false,

    webPreferences: {
      // Revisar esto debido a que no es lo ideal
      nodeIntegration: true,
      contextIsolation: true,
      devTools: isDev ? true : false,
      enableRemoteModule: true,
      preload: path.resolve(path.join(__dirname, "preload.js")),
    },
  });

  mainWindow.setFullScreen(isDev ? false : true);
  mainWindow.openDevTools(isDev ? true : false);
  //mainWindow.setAlwaysOnTop(isDev ? false : true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(false);
  mainWindow.setContentProtection(true);

  const logintUrl = isDev
    ? "http://localhost:3000#login"
    : url.format({
        pathname: path.join(__dirname, "index.html"),
        hash: "/login",
        protocol: "file:",
        slashes: true,
      });
  mainWindow.loadURL(logintUrl);
  mainWindow.on("closed", function () {
    console.log("Aplicacion va a ser cerrada");
    mainWindow = null;
    app.quit();
  });
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.webContents.on("will-prevent-unload", (event) => {
    const options = {
      type: "question",
      buttons: ["Cancel", "Leave"],
      message: "Leave Site?",
      detail: "Changes that you made may not be saved.",
    };
    const response = dialog.showMessageBoxSync(null, options);
    if (response === 1) {
      event.preventDefault();
      console.log("Solicitud de cierre");
      if (userId) {
        console.log("Envio de cierre");
        const body = {
          identification: userId,
          type_log: 1,
          remoteControl: false,
          externalDevices: false,
          externalScreen: false,
          description: "Aplicación cerrada",
          information: "",
        };
        console.log("Entrada cerrar app");
        sendInformationBack(body);
      }
    }
  });
};

const createWarnWindow = () => {
  warnWindowChild = new BrowserWindow({
    parent: mainWindow,
    width: screen.width,
    height: screen.height,
    closable: isDev ? true : false,
    minimizable: false,
    autoHideMenuBar: false,
    resizable: isDev ? true : false,
    frame: false,
    fullscreen: true,
    show: true,
    webPreferences: {
      // Revisar esto debido a que no es lo ideal
      nodeIntegration: true,
      contextIsolation: true,
      // devTools: true,
      devTools: isDev ? true : false,
      enableRemoteModule: true,
      preload: path.resolve(path.join(__dirname, "preload.js")),
    },
  });
  warnWindowChild.setFullScreen(isDev ? false : true);
  warnWindowChild.setAlwaysOnTop(true, "screen-saver");
  warnWindowChild.removeMenu();
  warnWindowChild.openDevTools(isDev ? true : false);
  warnWindowChild.setContentProtection(true);
};
let softwareId;
let screenId;
app.on("ready", () => {
  createWindow();
  softwareId = setInterval(consultarSoftwareSospechosos, 1000);
  screenId = setInterval(consultarMultiplesPantallas, 2000);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    clearInterval(softwareId);
    clearInterval(screenId);
    app.quit();
  }
});
app.on("before-quit", (event) => {
  if (!serverCloseRequested && userId) {
    event.preventDefault();
    serverCloseRequested = true;
    closeApp();
  }
});
app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
