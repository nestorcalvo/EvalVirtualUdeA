"use strict";

// const path = require("path");
// const url = require("url");
// const Shell = require("node-powershell");
// const os = require("os");
// // const edge = require('electron-edge-js')

// const {
//   setIntervalAsync,
//   clearIntervalAsync,
// } = require("set-interval-async/dynamic");

// const isDev = require("electron-is-dev");

// const axios = require('axios')
// // URL PARA PETICIONES, ES LA MISMA VARIABLE QUE EN ../src/utils/constantes
// const BACK_URL = 'https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog'
// const https = require('https')
// const httpsAgent = new https.Agent({ rejectUnauthorized: false })
// global.macInfo = null;
// global.deviceInfo = null;
// global.externalDisplay = false;
// global.duplicatedDisplay = false;
// global.objScreen = null;
// global.remoteSoftwareFound = false;
// global.screensDuplicated = 0;
// global.oneScreenFounde = false;
// global.screensDisplay = 0;
// global.webcamSuspicious = false;
// global.havePermissionCamera = false;
// global.remoteSoftware = false;
// global.processList = false;
// global.pcInfo = false;
// global.personId = null;
// global.ps = null;
// global.fileInfo = null;
// global.wrongCohortNumber = false;
// global.wrongSecurityToken = false;

// global.sendURL = null;
// global.mainWindow_open = false;
// global.biometricWindow_open = false;
// global.quizWindow_open = false;
// global.warnWindow_open = false;
// require("regenerator-runtime/runtime");

const { app, BrowserWindow, ipcRenderer, screen, dialog } = require("electron");
const path = require("path");
const os = require("os");
const url = require("url");
const DetectRTC = require("detectrtc");
const { ipcMain, globalShortcut } = require("electron");
const { desktopCapturer } = require("electron");
const psList = require("ps-list");
const fkill = require("fkill");
const si = require("systeminformation");
const { autoUpdater } = require("electron-updater");
// const fkill = require("fkill");
// import { default as fkill } from "fkill";
// import { default as psList } from "ps-list";
// import { async } from "regenerator-runtime/runtime";
const EXAM_URL = "https://aprende.udea.edu.co/course/view.php?id=24";
const isDev = require("electron-is-dev");
const { setIntervalAsync } = require("set-interval-async/dynamic");
const { clearIntervalAsync } = require("set-interval-async");
const { RemoteSoftwareList } = require("./remotesoftwarelist.js");
// const { fkill } = require("fkill");
const { exec } = require("child_process");
// const enumerateDevices = require("enumerate-devices");
// const { enumerateDevices } = require("media-devices");

const log = require("electron-log");
const { globalEval } = require("jquery");
console.log = log.log;
// const { async } = require("regenerator-runtime/runtime");

let timerSoftwareSupicious, timerExtraScreens, timerExtraWebcam;
let remoteSoftware, remoteSoftwareFound;
let mainWindow, warnWindowChild;
let userId, macInfo, deviceInfo;
let notSended = true;
let killSignal = true;
let firstTimeWindow = true;
let firstTimeScreenshot = true;
let webcamSuspicious = false;
let externalDisplay = false;
let firstTimeClose = true;

global.software = null;
console.log("Application version: ", app.getVersion());
if (isDev) {
  console.log("Running in development");
} else {
  console.log("Running in production");
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    // autoHideMenuBar: isDev ? true : false,
    closable: true,
    resizable: isDev ? true : false,
    minimizable: true,
    webPreferences: {
      // Revisar esto debido a que no es lo ideal
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true,
      // devTools: true,
      enableRemoteModule: true,
      preload: path.resolve(path.join(__dirname, "preload.js")),
    },
  });
  console.log("Dir name", __dirname);
  mainWindow.setFullScreen(isDev ? false : true);
  mainWindow.openDevTools();
  mainWindow.removeMenu();
  //mainWindow.setAlwaysOnTop(isDev ? false : true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(false);
  const logintUrl = isDev
    ? "http://localhost:3000#login"
    : url.format({
        pathname: path.join(__dirname, "index.html"),
        hash: "/login",
        protocol: "file:",
        slashes: true,
      });
  mainWindow.loadURL(logintUrl);
  mainWindow.setContentProtection(true);
};
const createWarnWindow = () => {
  warnWindowChild = new BrowserWindow({
    parent: mainWindow,
    width: screen.width,
    height: screen.height,
    // closable: isDev ? true:false,
    minimizable: false,
    autoHideMenuBar: false,
    resizable: true,
    frame: false,
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
  // warnWindowChild.setFullScreen(true)
  // warnWindowChild.openDevTools();
  warnWindowChild.setContentProtection(true);
  warnWindowChild.on("close", () => {
    if (mainWindow) {
      console.log("warnWindow is about to be closed");
      console.log(userId);
      console.log(firstTimeClose);
      if (userId && firstTimeClose) {
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
        let sendQuit = sendInformation(body, true, true);
      }
      warnWindowChild = null;
      // mainWindow.destroy();
      // mainWindow.close();
      // mainWindow = null;
    }
  });
};

if (process.platform == "darwin") {
  app.dock.hide();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
app.whenReady().then(() => {
  // const server = "https://your-deployment-url.com";
  // const url = `${server}/update/${process.platform}/${app.getVersion()}`;
  // autoUpdater.setFeedURL({ url });
  // setInterval(() => {
  //   autoUpdater.checkForUpdates();
  // }, 60000);
  const updaterFeedURL = {
    provider: "github",
    owner: "nestorcalvo",
    repo: "EvalUdea",
    private: true,
    token: "<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>",
  };

  autoUpdater.setFeedURL(updaterFeedURL);
  autoUpdater.checkForUpdatesAndNotify();

  const { net } = require("electron");
  const sendInformation = (
    data,
    closeFlag = false,
    saveInfoLocalLog = false
  ) => {
    console.log("Envio de informacion solicitada");
    const request = net.request({
      method: "POST",
      protocol: "https:",
      hostname: "biometria-api.udea.edu.co/admissionExam/evalUdea",
      // hostname: "biometria-api-develop.udea.edu.co/admissionExam/evalUdea",
      path: "/sendWarnings",
    });
    request.setHeader(
      "Token-Security",
      "13bqmrE5RBwj1Pj2FYxAshlQPyljjf8NZl4yZ5Fvm1wMJ0XnmcwCAgTqY6x0xuBC5K41n"
    );
    request.setHeader("Content-Type", "application/json");
    request.write(JSON.stringify(data), "utf-8");
    request.on("response", (response) => {
      // console.log(`STATUS sendInformation: ${response.statusCode}`);
      // console.log(`HEADERS sendInformation: ${JSON.stringify(response.headers)}`);
      // console.log(response);

      if (saveInfoLocalLog) {
        console.log(response);
      }
      if (response.statusCode == 401) {
        // global.wrongSecurityToken = true;
        // !warnWindow && createWarnWindow(global.wrongSecurityToken);

        return false;
      }
      response.on("data", (chunk) => {
        if (saveInfoLocalLog) {
          console.log(`BODY: ${chunk}`);
        }
      });
      response.on("end", () => {
        response.on("data", (chunk) => {
          if (saveInfoLocalLog) {
            console.log(`BODY: ${chunk}`);
          }
          // if (closeFlag) {
          //   app.quit();
          // }
        });
        console.log("Evento fin send information");
        if (response.statusCode == 200) {
          console.log("Codigo de respuesta 200");
          if (saveInfoLocalLog) {
            console.log(response.statusCode);
            console.log("Salida");
          }
          return true;
        }

        // console.log("No more data in response.");
      });
    });

    // console.log(data);

    if (saveInfoLocalLog) {
      console.log("Print request information:", request);
    }

    request.end();
  };
  const sendPcInformation = async () => {
    getDeviceInfo();
    const body = {
      identification: userId,
      type_log: 0,
      remoteControl: false,
      externalDevices: false,
      externalScreen: false,
      description:
        "Registro informacion PC (version creada para pruebas Ude@ sin bloqueos v2.1a0)",
      information: Buffer.from(JSON.stringify(deviceInfo)).toString("base64"),
    };
    await sendInformation(body, false, false);
  };
  const sendStartExamInfo = () => {
    const body = {
      identification: userId,
      type_log: 1,
      remoteControl: false,
      externalDevices: false,
      externalScreen: false,
      description: "Examen iniciado",
      information: "",
    };
    sendInformation(body, false, false);
  };
  const getMarAddress = () => {
    const data = getNetworkDataForThisIP();
    macInfo = data;
  };
  const getDeviceInfo = () => {
    const cpus = os.cpus();
    const cpu = {
      reference: cpus[0],
      coreNumber: cpus.length,
    };
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
    // console.log(deviceInfo);
    if (os.type() === "Darwin") {
      checkCamera();
    }
  };
  const getScreenInfo = async () => {
    const respuesta = verifyExternalDisplay();
    // console.log('Verificando pantallas ')
    if (respuesta) {
      console.log("Pantalla encontrada");
      // clearIntervalAsync(timerExtraScreens);
      if (firstTimeWindow && respuesta) {
        // if(!warnWindowChild){
        createWarnWindow();
        // }
        const urlWarn = isDev
          ? "http://localhost:3000#warning"
          : url.format({
              pathname: path.join(__dirname, "index.html"),
              hash: "/warning",
              protocol: "file:",
              slashes: true,
            });

        warnWindowChild.loadURL(urlWarn);

        warnWindowChild.once("show", () => {
          if (userId) {
            console.log("Warnwindow open with login");
          } else {
            console.log("Warnwindow open without login");
          }
          warnWindowChild.webContents.send("externalDisplay", true);
        });
        warnWindowChild.once("ready-to-show", () => {
          warnWindowChild.show();
          // if(isDev){

          //   warnWindowChild.webContents.openDevTools()
          // }
        });
        if (userId && notSended) {
          console.log("Send log to biometria");

          let descriptionPost = "El usuario tiene: ";
          if (remoteSoftware) {
            descriptionPost += `[Softwares no permitidos: ${remoteSoftware}]`;
          }
          if (webcamSuspicious) {
            descriptionPost += `[Camara sospechosa]`;
          }
          if (externalDisplay) {
            descriptionPost += `[Pantalla externa]`;
          }

          let info = "";
          let log = 3;

          const body = {
            identification: userId,
            type_log: log,
            remoteControl: remoteSoftwareFound,
            externalDevices: webcamSuspicious,
            externalScreen: externalDisplay,
            description: descriptionPost,
            information: info,
          };
          let sended = sendInformation(body, false, false);
          if (sended) {
            clearIntervalAsync(timerExtraScreens);
          }
          notSended = false;
          //mainWindow.webContents.send('async', requestBody)
          // ipcMain.on("take_screenshot", (event, args) => {
          //   if (firstTimeScreenshot) {
          //     desktopCapturer
          //       .getSources({
          //         types: ["screen"],
          //         thumbnailSize: {
          //           width: 1000,
          //           height: 800,
          //         },
          //       })
          //       .then((sources) => {
          //         // The image to display the screenshot
          //         // console.log(sources);
          //         let file = sources[0].thumbnail.toDataURL();
          //         // console.log(
          //         //   "Imagen a buffer:",
          //         //   Buffer.from(file.toString("base64"))
          //         // );
          //         console.log("Screenshot");
          //         const body = {
          //           identification: userId,
          //           type_log: 4,
          //           remoteControl: remoteSoftwareFound,
          //           externalDevices: webcamSuspicious,
          //           externalScreen: externalDisplay,
          //           description: "Screenshot",
          //           information: file.toString("base64"),
          //         };
          //         sendInformation(body, true);
          //       });
          //   }
          //   firstTimeScreenshot = false;
          // });
        }
        firstTimeWindow = false;
      }
    }
  };
  const verifyExternalDisplay = () => {
    const displays = screen.getAllDisplays();

    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    if (externalDisplay) {
      return true;
    } else {
      return false;
    }
  };
  const checkRemoteSoftware = async function () {
    var processes = await psList(() => {});
    var processList = [];
    var processPID = [];
    for (let i = 0; i < processes.length; i++) {
      var process_ = processes[i].name.replace(".exe", "").toLowerCase();
      var PID = processes[i].pid;
      processList.push(process_);
      processPID.push(PID);
    }
    const uniqueProcesses = [...new Set(processList)];
    const isRemoteSoftware = await verifyRemoteAccessSoftware(uniqueProcesses);

    processList = uniqueProcesses;
    remoteSoftware = isRemoteSoftware;
    remoteSoftwareFound = isRemoteSoftware ? true : false;
    var softwareToKill = [];
    for (let i = 0; i < remoteSoftware.length; i++) {
      softwareToKill.push(remoteSoftware[i] + ".exe");
    }
    console.log("Remote software found", softwareToKill);
    if (firstTimeWindow && remoteSoftware) {
      console.log("Creacion warnwindow");
      if (!warnWindowChild) {
        createWarnWindow();
      }
      const urlWarn = isDev
        ? "http://localhost:3000#warning"
        : url.format({
            pathname: path.join(__dirname, "index.html"),
            hash: "/warning",
            protocol: "file:",
            slashes: true,
          });

      warnWindowChild.loadURL(urlWarn);

      warnWindowChild.once("show", () => {
        if (userId) {
          console.log("Warnwindow open with login");
        } else {
          console.log("Warnwindow open without login");
        }
        warnWindowChild.webContents.send("software", remoteSoftware);
        // mainWindow.webContents.send("software", remoteSoftware);
      });
      warnWindowChild.once("ready-to-show", () => {
        warnWindowChild.show();
        // if(isDev){

        //   warnWindowChild.webContents.openDevTools()
        // }
      });
      if (userId && notSended) {
        console.log("Prepare log to biometria");

        let descriptionPost = "El usuario tiene: ";
        if (remoteSoftware) {
          descriptionPost += `[Softwares no permitidos: ${remoteSoftware}]`;
        }
        if (webcamSuspicious) {
          descriptionPost += `[Camara sospechosa]`;
        }
        if (externalDisplay) {
          descriptionPost += `[Pantalla externa]`;
        }
        const remotes = {
          software: remoteSoftware,
        };
        let info = "";
        let log = 3;
        if (remoteSoftware) {
          console.log(remotes);
          log = 2;
          info = Buffer.from(
            JSON.stringify({
              remotes,
            })
          ).toString("base64");
          // info = JSON.stringify({remotes})
        }
        console.log(info);
        const body = {
          identification: userId,
          type_log: log,
          remoteControl: remoteSoftwareFound,
          externalDevices: webcamSuspicious,
          externalScreen: externalDisplay,
          description: descriptionPost,
          information: info,
        };
        let sended = sendInformation(body, false, false);
        // if (sended) {
        //   clearIntervalAsync(timerSoftwareSupicious);
        // }
        notSended = false;
        //mainWindow.webContents.send('async', requestBody)
        console.log("Preparacion toma de pantallazo");
        ipcMain.on("take_screenshot", (event, args) => {
          console.log("Verificacion pantallazo");
          if (firstTimeScreenshot) {
            desktopCapturer
              .getSources({
                types: ["screen"],
                thumbnailSize: {
                  width: 720,
                  height: 480,
                },
              })
              .then((sources) => {
                console.log("Pantallazo");
                for (let i = 0; i < sources.length; ++i) {
                  console.log(sources[i].name);
                  if (sources[i].name == "Entire Screen") {
                    // The image to display the screenshot
                    console.log(sources);
                    let file = sources[0].thumbnail.toDataURL();

                    console.log("Screenshot");
                    const body = {
                      identification: userId,
                      type_log: 4,
                      remoteControl: remoteSoftwareFound,
                      externalDevices: webcamSuspicious,
                      externalScreen: externalDisplay,
                      description: "Screenshot",
                      information: file.split(",")[1],
                    };

                    sendInformation(body, false, false);
                  }
                }
              });
          }
          firstTimeScreenshot = false;
        });
      }

      ipcMain.on("close_software", (event, args) => {
        console.log("Close software");
        if (killSignal) {
          (async () => {
            await fkill(softwareToKill);
            console.log("Killed process");
          })();
          killSignal = false;
        }
      });
      firstTimeWindow = false;
    } else {
      firstTimeWindow = true;
      killSignal = true;
    }
  };
  const verifyRemoteAccessSoftware = async (uniqueProcesses) => {
    const susProcesses = [];
    const remoteSfwList = RemoteSoftwareList.map((word) => word.toLowerCase());
    for (let i = 0; i < uniqueProcesses.length; i++) {
      if (remoteSfwList.includes(uniqueProcesses[i])) {
        susProcesses.push(uniqueProcesses[i]);
      }
    }
    if (susProcesses.length === 0) {
      return false;
    } else {
      return susProcesses;
    }
  };
  const sendClosedApp = (userId) => {
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
    let sendQuit = sendInformation(body, true, true);
    console.log("Result from send informaiton", sendQuit);
    if (sendQuit) {
      // mainWindow.destroy();
      app.quit();
      return sendQuit;
    }
  };
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

    // url.format(new URL(`file:///${__dirname}/index.html#wrongCohort`), {
    //     unicode: true,
    //   });
    warnWindowChild.loadURL(urlWrongCohort);
    warnWindowChild.once("show", () => {
      console.log("Wrong cohort");
    });
    warnWindowChild.once("ready-to-show", () => {
      warnWindowChild.show();
      // if(isDev){

      //   warnWindowChild.webContents.openDevTools()
      // }
    });

    console.log(args);
  });

  ipcMain.on("exam", (event, args) => {
    console.log("Iniciar examen");
    mainWindow.show();
    mainWindow.loadURL(EXAM_URL);
    // if(isDev){

    //   mainWindow.webContents.openDevTools()
    // }

    // Send pc information
    sendStartExamInfo();
  });
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

    // Send pc information
    sendPcInformation();
  });
  mainWindow.once("ready-to-show", () => {
    console.log("Apertura de checkeo");
    getDeviceInfo();
    timerSoftwareSupicious = setIntervalAsync(checkRemoteSoftware, 1000);
    // timerExtraScreens = setIntervalAsync(getScreenInfo, 1000);
    // timerExtraWebcam = setIntervalAsync(getWebcamInfo, 1000);
  });
  mainWindow.on("close", () => {
    console.log("Mainwindow is about to be closed");
    if (userId && firstTimeClose) {
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
      let sendQuit = sendInformation(body, true, true);
      // sendClosedApp(userId)
      //   .then((data) => {
      //     let quitApp = data;
      //     firstTimeClose = false;
      //     if (quitApp) {
      //       console.log("Cierre autorizado y enviado");
      //       app.quit();
      //     }
      //   })
      //   .catch((err) => console.log(err));
    }
    if (mainWindow) {
      mainWindow.destroy();
    }
  });
});
app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
app.on("before-quit", () => {
  mainWindow.removeAllListeners("close");
  // mainWindow.destroy();
  mainWindow.close();
});
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update aviable");
});
autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  console.log("Updates aviable");
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "Una actualización de la aplicación se está descargando y es necesaria para el uso correcto de la aplicación. Una vez terminada la descarga la apliación se reiniciará.",
  };
  dialog.showMessageBox(dialogOpts, (response) => {});
});
autoUpdater.on("update-not-available", () => {
  console.log("Update not available");
});
autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    // buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. The application will be restarted.",
  };
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 2000);
  // dialog.showMessageBox(dialogOpts).then((returnValue) => {
  // if (returnValue.response === 0)
  // });
});
autoUpdater.on("error", (error) => {
  console.log("error");
  console.log(error.message);
  console.log(error.stack);
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (timerSoftwareSupicious) {
    clearIntervalAsync(timerSoftwareSupicious);
  }

  if (timerExtraScreens) {
    clearIntervalAsync(timerExtraScreens);
  }

  if (timerExtraWebcam) {
    clearIntervalAsync(timerExtraWebcam);
  }
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }

  app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
