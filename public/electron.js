"use strict";

const { RemoteSoftwareList } = require("./remotesoftwarelist.js");
const PowerShell = require("powershell");
const { desktopCapturer } = require("electron");
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  screen,
  net,
} = require("electron");
const path = require("path");
const url = require("url");
const Shell = require("node-powershell");
const os = require("os");
// const edge = require('electron-edge-js')

const {
  setIntervalAsync,
  clearIntervalAsync,
} = require("set-interval-async/dynamic");
const psList = require("ps-list");
const isDev = require("electron-is-dev");
const {
  SEND_SOFTWARE_LIST_TO_MW,
  ELECTRON_SEND_SOFTWARE_LIST,
  QUIZ_WINDOW_SET_MINIMIZABLE,
  SET_PERSON_ID,
  SET_BACK_URL,
  NOTIFY_NO_ACTIVE_COHORT_REPLY,
  NOTIFY_NO_ACTIVE_COHORT,
  NOTIFY_LOGIN,
  CONFIRM_WINDOW_ACCEPT,
  CONFIRM_WINDOW_SET_STATE,
  CONFIRM_WINDOW_ACCEPT_REPLY,
  CONFIRM_WINDOW_SHOW,
  SHOW_BIOMETRIC_WINDOW_REPLY,
  ASK_STATE_REPLY,
  REQUEST_STATE,
  QUIZ_WINDOW_IS_OPENED_REPLY,
  NOTIFY_LOGIN_REPLY,
  BIOMETRIC_PICTURE_TAKED,
  SHOW_WARN_WINDOW,
  LOGOUT_REPLY,
  BIOMETRIC_PICTURE_TAKED_REPLY,
  CAN_START_QUIZ,
  CAN_START_QUIZ_REPLY,
  LOGOUT,
  SHOW_QUIZ_WINDOW,
  CLOSE_APP,
  SHOW_BIOMETRIC_WINDOW,
  NOTIFY_WEBCAM_SUSPICIOUS,
  EXTERNAL_DISPLAY_REPLY,
  ASK_STATE,
  REQUEST_STATE_REPLY,
  CONFIRM_WINDOW_CANCEL,
  ELECTRON_REMOTE_SOFTWARE_ACTIVATED,
  SEND_INFORMATION,
} = require("./electronTypes");
// const axios = require('axios')
// // URL PARA PETICIONES, ES LA MISMA VARIABLE QUE EN ../src/utils/constantes
// const BACK_URL = 'https://a03c0032-5696-4b2b-83b6-3ae4dc91ff1f.mock.pstmn.io/watchdog'
// const https = require('https')
// const httpsAgent = new https.Agent({ rejectUnauthorized: false })
global.macInfo = null;
global.deviceInfo = null;
global.externalDisplay = false;
global.duplicatedDisplay = false;
global.objScreen = null;
global.remoteSoftwareFound = false;
global.screensDuplicated = 0;
global.oneScreenFounde = false;
global.screensDisplay = 0;
global.webcamSuspicious = false;
global.havePermissionCamera = false;
global.remoteSoftware = false;
global.processList = false;
global.pcInfo = false;
global.personId = null;
global.ps = null;
global.fileInfo = null;
global.wrongCohortNumber = false;
global.wrongSecurityToken = false;

global.sendURL = null;
let mainWindow;
let biometricWindow;
let quizWindow;
let warnWindow;
let confirmWindow;
let timerSoftwareSupicious;
let timerExtraScreens;

// var clrMethod = edge.func('VirtualMachineDetection.dll')
// console.log(clrMethod)

const AppReady = () => {
  registerPc();
  getDeviceInfo();
  getMarAddress();
  screenInit();
  createMainWindow();
  checkCohort();
  watchEvents();
};

const watchEvents = (channel, listener) => {
  // When photo is taked, we can notify to mainWindow
  ipcMain.on(BIOMETRIC_PICTURE_TAKED, (event, arg) => {
    mainWindow.webContents.send(BIOMETRIC_PICTURE_TAKED_REPLY, "taked");
  });
  ipcMain.on(CAN_START_QUIZ, (event, arg) => {
    biometricWindow.webContents.send(CAN_START_QUIZ_REPLY, "start");
  });
  ipcMain.on(NOTIFY_LOGIN, (event, state) => {
    biometricWindow.webContents.send(NOTIFY_LOGIN_REPLY, state);
  });
  ipcMain.on(LOGOUT, (event, state) => {
    closeBiometricWindow();
  });
  ipcMain.on(SHOW_QUIZ_WINDOW, (event, state) => {
    createQuizWindow(state);
  });
  ipcMain.on(SHOW_WARN_WINDOW, (event, state) => {
    !warnWindow && createWarnWindow(state);
  });
  ipcMain.on(CLOSE_APP, (event, state) => {
    console.log("Evento cerrar aplicación");
    clearIntervalAsync(timerExtraScreens);
    closeWarnWindow();
    onWindowsClose();
  });
  ipcMain.on(SHOW_BIOMETRIC_WINDOW, async (event, state) => {
    if (biometricWindow) {
      biometricWindow.show();
    } else {
      createBiometricWindow(state);
    }
  });
  ipcMain.on(NOTIFY_WEBCAM_SUSPICIOUS, (event, state) => {
    !warnWindow && createWarnWindow(state);
  });
  // Biometric window asks for state
  ipcMain.on(REQUEST_STATE, async (event, state) => {
    // We notify mainWindow for the state
  });
  ipcMain.on(NOTIFY_NO_ACTIVE_COHORT, async (event, state) => {
    // We notify mainWindow for the state
  });
  // mainWindow send the state
  ipcMain.on(ASK_STATE_REPLY, (event, response) => {
    //asdfasd
  });
  ipcMain.on(SEND_INFORMATION, (event, response) => {
    // console.log(response)
    sendInformation(response);
  });

  ipcMain.on(SEND_SOFTWARE_LIST_TO_MW, (event, state) => {
    // console.log(state);
    mainWindow.webContents.send(state);
  });
  ipcMain.on(SET_PERSON_ID, (event, response) => {
    if (response) {
      global.personId = response;
    }
  });
  // Open confirm Window
  ipcMain.on(CONFIRM_WINDOW_SHOW, (event, state) => {
    createConfirmWindow(state);
  });
  // User confirm action
  ipcMain.on(CONFIRM_WINDOW_ACCEPT, (event, state) => {});
  // User cancel action
  ipcMain.on(CONFIRM_WINDOW_CANCEL, (event, state) => {
    console.log("Evento cerrar ventana biometrica");
    //closeConfirmWindow();
    biometricWindow.send("CONFIRM_WINDOW_CLOSED_REPLY");
  });
  ipcMain.on(QUIZ_WINDOW_SET_MINIMIZABLE, (event, state) => {
    quizWindow.minimizable = true;
  });
};
const sendInformation = (data, closeFlag = false) => {
  const request = net.request({
    method: "POST",
    protocol: "https:",
    hostname: "biometria-api.udea.edu.co/admissionExam/evalUdea",
    path: "/sendWarnings",
  });
  request.setHeader(
    "Token-Security",
    "13bqmrE5RBwj1Pj2FYxAshlQPyljjf8NZl4yZ5Fvm1wMJ0XnmcwCAgTqY6x0xuBC5K41n"
  );
  request.on("response", (response) => {
    // console.log(`STATUS sendInformation: ${response.statusCode}`);
    // console.log(`HEADERS sendInformation: ${JSON.stringify(response.headers)}`);
    if (response.statusCode == 401) {
      global.wrongSecurityToken = true;
      !warnWindow && createWarnWindow(global.wrongSecurityToken);
    }
    response.on("data", (chunk) => {
      // console.log(`BODY: ${chunk}`);
    });
    response.on("end", () => {
      if (closeFlag) {
        console.log("Evento fin send information");
      }
      // console.log("No more data in response.");
    });
  });
  request.setHeader("Content-Type", "application/json");
  // console.log(data);
  request.write(JSON.stringify(data), "utf-8");
  // console.log("Print request information:", request);
  request.end();
};
const checkCohort = () => {
  const request = net.request({
    method: "GET",
    protocol: "https:",
    hostname: "biometria-api.udea.edu.co/admissionExam/evalUdea/checkAdmission",
    path: "/20211",
  });
  request.setHeader(
    "Token-Security",
    "13bqmrE5RBwj1Pj2FYxAshlQPyljjf8NZl4yZ5Fvm1wMJ0XnmcwCAgTqY6x0xuBC5K41n"
  );
  request.on("response", (response) => {
    // console.log(`STATUS checkCohort: ${response.statusCode}`);
    // console.log(`HEADERS checkCohort: ${JSON.stringify(response.headers)}`);
    if (response.statusCode == 400) {
      global.wrongCohortNumber = true;
      !warnWindow && createWarnWindow(global.wrongCohortNumber);
    } else if (response.statusCode == 401) {
      global.wrongSecurityToken = true;
      !warnWindow && createWarnWindow(global.wrongSecurityToken);
    }
    response.on("data", (chunk) => {
      // console.log(`BODY: ${chunk}`);
    });
    response.on("end", () => {
      // console.log('No more data in response.')
    });
  });

  request.end();
};
const createMainWindow = () => {
  const optionsWindow = {
    width: 800,
    height: 800,
    title: "Evaluación virtual UdeA",
    center: true,
    maximizable: false,
    resizable: false,
    show: true,
    frame: true,
    icon: path.join(__dirname, "./icons/png/notas.png"),
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
      contextIsolation: false,
      enableRemoteModule: true,
      // Desable CORS for dev
      // webSecurity: true
    },
  };
  mainWindow = new BrowserWindow(optionsWindow);
  //mainWindow.removeMenu()
  // once is executed one time, on() is executed multiple times
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    timerSoftwareSupicious = setIntervalAsync(checkRemoteSoftware, 1000);
    timerExtraScreens = setIntervalAsync(getScreenInfo, 2000);
  });
  mainWindow.once("closed", () => {
    console.log("Once closed mainWindow");
    // closeMainWindowsClose();
  });
  // We can load a content in our window
  const startUrl = isDev
    ? "http://localhost:3000"
    : url.format({
        pathname: path.join(__dirname, "../build/index.html"),
        protocol: "file:",
        slashes: true,
      });
  mainWindow.on("close", () => {
    console.log("On close mainWindow");
    // closeBiometricWindow();
    // closeQuizWindow();
    // closeWarnWindow();
    // onWindowsClose();
  });
  mainWindow.loadURL(startUrl);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // Establece un cookie con los datos de la misma.
  // puede sobrescriba cookies iguales si existen.
  const cookie = {
    url: "http://localhost:5000",
    name: "EvalVirtualOrigin",
    value: "desktop",
  };
  session.defaultSession.cookies.set(cookie).then(
    () => {
      // success
    },
    (error) => {
      console.error(error);
    }
  );
};

const createBiometricWindow = (state) => {
  const display = screen.getPrimaryDisplay();
  const width = display.bounds.width;
  biometricWindow = new BrowserWindow({
    height: 300,
    width: 300,
    x: width / 2 - 150,
    y: 0,
    show: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // 'floating' + 1 is higher than all regular windows, but still behind things
  // like spotlight or the screen saver
  biometricWindow.setAlwaysOnTop(true, "floating", 2);
  // allows the window to show over a fullscreen window
  biometricWindow.setVisibleOnAllWorkspaces(true);
  const urlBiometrics = isDev
    ? "http://localhost:3000#/biometrics"
    : url.format(new URL(`file:///${__dirname}/index.html#/biometrics`), {
        unicode: true,
      });
  biometricWindow.on("close", (event) => {
    // closeMainWindowsClose();
    // closeQuizWindow();
    // closeWarnWindow();
    console.log("Evento cerrar biometria");
    // mainWindow.close()
  });
  biometricWindow.loadURL(urlBiometrics);
  biometricWindow.once("ready-to-show", () => {
    biometricWindow.show();
  });
};

const createQuizWindow = ({ urlQuiz, cookies, isMinimizable }) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  quizWindow = new BrowserWindow({
    width,
    height,
    show: false,
    movable: false,
    frame: true,
    minimizable: false,
    maximizable: false,
    closable: true,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      devTools: false,
      webSecurity: true,
      enableRemoteModule: true,
      preload: path.resolve(path.join(__dirname, "preload.js")),
    },
  });
  quizWindow.maximize();
  quizWindow.removeMenu();
  quizWindow.loadURL(urlQuiz);
  quizWindow.once("closed", (event) => {
    console.log("Once closed quiz");
    const body = {
      identification: global.personId,
      // date: new Date(),
      type_log: 1,
      remoteControl: false,
      externalDevices: false,
      externalScreen: false,
      description: "Examen finalizado",
      information: "",
    };
    sendInformation(body, true);
  });
  quizWindow.on("close", () => {
    console.log("On close quiz");

    closeMainWindowsClose();
    closeBiometricWindow();
    closeWarnWindow();
    // onWindowsClose();
  });
  quizWindow.setAlwaysOnTop(true, "floating", 1);
  // allows the window to show over a fullscreen window
  quizWindow.setVisibleOnAllWorkspaces(true);
  // win.openDevTools()
  quizWindow.once("ready-to-show", () => {
    quizWindow.show();
  });

  quizWindow.webContents.on("did-finish-load", async () => {
    if (cookies) {
      cookies.forEach((cookie) => {
        session.defaultSession.cookies.set(cookie).then(
          () => {
            // success
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  });
};

const createWarnWindow = (state) => {
  if (timerSoftwareSupicious) {
    clearIntervalAsync(timerSoftwareSupicious);
  }
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  warnWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    show: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
      contextIsolation: false,
      enableRemoteModule: true,
      // Desable CORS for dev
      // webSecurity: false
    },
  });
  warnWindow.setAlwaysOnTop(true, "floating", 3);
  // allows the window to show over a fullscreen window
  warnWindow.setVisibleOnAllWorkspaces(true);
  const urlWarn = isDev
    ? "http://localhost:3000#/warn"
    : url.format(new URL(`file:///${__dirname}/index.html#/warn`), {
        unicode: true,
      });
  warnWindow.loadURL(urlWarn);
  warnWindow.webContents.send("payload", state);
  warnWindow.once("ready-to-show", () => warnWindow.show());
  warnWindow.on("close", () => {
    console.log("Warning cerrada");

    // closeQuizWindow();
    // closeBiometricWindow();
    // closeMainWindowsClose();
    // closeWarnWindow();
  });
  warnWindow.once("closed", () => {
    console.log("Warning cerrada y por ende las demas tambien");
    // closeWarnWindow();
  });
};

const createConfirmWindow = (state) => {
  const display = screen.getPrimaryDisplay();
  const width = display.bounds.width;
  confirmWindow = new BrowserWindow({
    height: 400,
    width: 400,
    x: width / 2 - 200,
    y: 0,
    show: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // 'floating' + 1 is higher than all regular windows, but still behind things
  // like spotlight or the screen saver
  confirmWindow.setAlwaysOnTop(true, "floating", 5);
  // allows the window to show over a fullscreen window
  confirmWindow.setVisibleOnAllWorkspaces(true);

  const urlConfirm = isDev
    ? "http://localhost:3000#/confirm"
    : url.format(new URL(`file:///${__dirname}/index.html#/confirm`), {
        unicode: true,
      });
  confirmWindow.loadURL(urlConfirm);
  confirmWindow.once("closed", () => {
    console.log("Once closed confirm window");
    closeConfirmWindow();
  });
  confirmWindow.once("ready-to-show", () => {
    confirmWindow.show();
  });
};

const getNetworkDataForThisIP = () => {
  const networkInterfaces = os.networkInterfaces();
  const selectedInterfaceData = [];
  Object.keys(networkInterfaces).forEach((NetworkID, index, obj) => {
    networkInterfaces[NetworkID].forEach((data) => {
      if (
        data.family === "IPv4" &&
        data.internal === false &&
        data.address !== "127.0.0.1"
      ) {
        // I created new Object because the NetworkID is not provided in the 'data' object
        selectedInterfaceData.push({
          network: NetworkID,
          address: data.address,
          netmask: data.netmask,
          family: data.family,
          mac: data.mac,
        });
      }
    });
  });
  return selectedInterfaceData;
};

const getMarAddress = () => {
  const data = getNetworkDataForThisIP();
  global.macInfo = data;
};

const getDeviceInfo = () => {
  const cpus = os.cpus();
  const cpu = {
    reference: cpus[0],
    coreNumber: cpus.length,
  };
  const deviceInfo = {
    osName: os.type(),
    osRelease: os.release(),
    arch: os.arch(),
    totalRAM: os.totalmem(),
    freeRAM: os.freemem(),
    cpus: cpu,
  };
  global.deviceInfo = deviceInfo;

  // global.fileInfo = Buffer.from(JSON.stringify(deviceInfo)).toString('base64')

  if (os.type() === "Darwin") {
    checkCamera();
  }
};

const checkCamera = () => {
  const { systemPreferences } = require("electron");
  systemPreferences.askForMediaAccess("camera").then((havePermission) => {
    global.havePermissionCamera = havePermission;
  });
};

const registerPc = () => {
  global.pcInfo = {
    arch: os.arch(),
    processor: os.cpus(),
    ram: os.totalmem(),
    name: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    platform: os.platform(),
    kernel: os.version(),
    freemem: os.freemem(),
  };
  global.fileInfo = Buffer.from(JSON.stringify(global.pcInfo)).toString(
    "base64"
  );
  // console.log(typeof global.fileInfo);
};

const checkRemoteSoftware = async () => {
  const processes = await psList();
  const processList = [];
  for (let i = 0; i < processes.length; i++) {
    const process_ = processes[i].name.replace(".exe", "").toLowerCase();
    processList.push(process_);
  }
  const uniqueProcesses = [...new Set(processList)];
  const isRemoteSoftware = await verifyRemoteAccessSoftware(uniqueProcesses);
  global.processList = uniqueProcesses;
  global.remoteSoftware = isRemoteSoftware;
  global.remoteSoftwareFound = isRemoteSoftware ? true : false;
  if (global.personId) {
    const requestBody = {
      identification: global.personId,
      processes: global.remoteSoftware,
      remoteSoftware: global.remoteSoftware,
      date: new Date(),
    };
    //mainWindow.webContents.send('async', requestBody)
  }
  if (isRemoteSoftware) {
    clearIntervalAsync(timerSoftwareSupicious);
    if (mainWindow) {
      mainWindow.webContents.send(
        ELECTRON_REMOTE_SOFTWARE_ACTIVATED,
        isRemoteSoftware
      );
    } else if (quizWindow) {
      quizWindow.webContents.send(
        ELECTRON_REMOTE_SOFTWARE_ACTIVATED,
        isRemoteSoftware
      );
    } else {
      mainWindow.webContents.send(
        ELECTRON_REMOTE_SOFTWARE_ACTIVATED,
        isRemoteSoftware
      );
    }
    if (warnWindow) {
      warnWindow.close();
      warnWindow = null;
    }
  }
};

const verifyRemoteAccessSoftware = async (uniqueProcesses) => {
  const susProcesses = [];
  const remoteSfwList = RemoteSoftwareList.map((word) => word.toLowerCase());
  for (let i = 0; i < uniqueProcesses.length; i++) {
    if (remoteSfwList.includes(uniqueProcesses[i])) {
      // console.log(uniqueProcesses[i]);
      susProcesses.push(uniqueProcesses[i]);
    }
  }
  if (susProcesses.length === 0) {
    return false;
  } else {
    return susProcesses;
  }
};

const getScreenInfo = async () => {
  // console.log('Verificando Screen')
  // console.log('Revisando pantallas...')
  // const isExternalDisplay = verifyExternalDisplay()
  const respuesta = verifyExternalDisplay(global.ps);
  if (respuesta) {
    mainWindow.webContents.send(
      EXTERNAL_DISPLAY_REPLY,
      verifyExternalDisplay(global.ps)
    );
    clearIntervalAsync(timerExtraScreens);
  }
};
const screenInit = () => {
  // global.ps = new Shell({
  //   executionPolicy: 'Bypass',
  //   noProfile: true,
  //   pwsh: true
  // })

  // Bandera para no cambiar argumentos de funcion
  global.ps = false;
  // global.ps.addCommand('Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams')

  verifyExternalDisplay(global.ps);
  screen.on("display-removed", () => {
    const isExternalDisplay = verifyExternalDisplay(global.ps);
    global.externalDisplay = isExternalDisplay;
    mainWindow.webContents.send(EXTERNAL_DISPLAY_REPLY, isExternalDisplay);
    if (quizWindow) {
      quizWindow.webContents.send(EXTERNAL_DISPLAY_REPLY, isExternalDisplay);
    }
    if (warnWindow) {
      warnWindow.closable = true;
      warnWindow.close();
      warnWindow = null;
    }
    clearIntervalAsync(timerExtraScreens);
  });
  screen.on("display-added", () => {
    const isExternalDisplay = verifyExternalDisplay(global.ps);
    global.externalDisplay = isExternalDisplay;
    mainWindow.webContents.send(EXTERNAL_DISPLAY_REPLY, isExternalDisplay);
  });
};

const verifyExternalDisplay = (ps) => {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  if (externalDisplay) {
    global.externalDisplay = true;
    return true;
  }

  // // deteccion de pantalla
  // ps.addCommand('Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams')
  // ps.invoke().then(output => {
  //   // global.objScreen = output
  //   const split = output.split(' ')
  //   const obj = {}
  //   // contar que la palabra active no aparezca 2 veces
  //   for (let i = 0; i < split.length; i++) {
  //     if (obj[split[i]] === undefined) {
  //       obj[split[i]] = 1
  //     } else {
  //       obj[split[i]]++
  //     }
  //   }
  //   // console.log(obj['\r\n\r\nActive'])
  //   if (obj['\r\n\r\nActive'] > 1) {
  //     global.duplicatedDisplay = true
  //     global.externalDisplay = true
  //     return true
  //   }
  // }).catch(err => {
  //   console.log(err)
  // })

  // if (global.duplicatedDisplay) {
  //   return true
  // } else {
  //   return false
  // }
};

const closeBiometricWindow = () => {
  if (biometricWindow) {
    biometricWindow.closable = true;
    biometricWindow.close();
  }
  // biometricWindow = null
};
const closeQuizWindow = () => {
  if (quizWindow) {
    quizWindow.closable = true;
    quizWindow.close();
  }
  // quizWindow = null
};
const closeWarnWindow = () => {
  if (warnWindow) {
    warnWindow.closable = true;
    warnWindow.close();
  }
  // warnWindow = null
};

const closeConfirmWindow = () => {
  if (confirmWindow) {
    confirmWindow.closable = true;
    confirmWindow.close();
  }
  // confirmWindow = null
};
const closeMainWindowsClose = () => {
  if (mainWindow) {
    mainWindow.closable = true;
    mainWindow.close();
  }
};

const onWindowsClose = () => {
  // if (biometricWindow) {
  //   closeBiometricWindow();
  // }
  // if (quizWindow) {
  //   closeQuizWindow();
  // }
  // if (warnWindow) {
  //   closeWarnWindow();
  // }
  // if (mainWindow) {
  //   closeMainWindowsClose();
  // }
  // warnWindow && closeWarnWindow()

  biometricWindow = null;
  quizWindow = null;
  warnWindow = null;
  mainWindow = null;
  app.quit();
};

// //////
app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// listen on app ready
app.on("ready", AppReady);
