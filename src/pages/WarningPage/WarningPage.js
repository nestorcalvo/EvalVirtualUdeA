// import React, { useEffect, useState } from "react";
// import { useStore } from "../../store/storeContext";
// // import { DeveloperBar } from '../../components/DeveloperBar'
// import { WarnContainer, Title, Message } from "./styles";
// import { useElectronActions } from "../../actions/electronActions";
// import { CLOSE_APP } from "../../actions/types/electronTypes";
// import { useAuthActions } from "../../actions/authActions";
// import axios from "axios";

// export const WarnPage = () => {
//   const { sendProcesses, getUserState } = useAuthActions();
//   const { sendElectron, getElectronVar } = useElectronActions();
//   // Tiempo para cerrar app
//   const [countdown, setCountdown] = useState(15);
//   const [intervalCountdown, setInvervalCountdown] = useState();
//   const [title, setTitle] = useState();
//   const [isWebcamSuspicious, setWebcamSuspicious] = useState(false);
//   const [sendData, setSendData] = useState(false);
//   const [isExternalDisplay, setExternalDisplay] = useState(false);
//   const [remoteSoftwareFound, setRemoteSoftwareFound] = useState(false);
//   const [remoteSoftware, setRemoteSoftware] = useState(false);
//   const [wrongCohortNumber, setwrongCohortNumber] = useState(false);
//   const [wrongSecurityToken, setwrongSecurityToken] = useState(false);
//   let usrstate = null;
//   let firstTimePosting = true;
//   useEffect(() => {
//     async function fetchData() {
//       const externalDisplay = await getElectronVar("externalDisplay");
//       const webcamSuspicious = await getElectronVar("webcamSuspicious");
//       const remoteSoftware = await getElectronVar("remoteSoftware");
//       const remoteSoftwareFound = await getElectronVar("remoteSoftwareFound");
//       const wrongCohortNumber = await getElectronVar("wrongCohortNumber");
//       const wrongSecurityToken = await getElectronVar("wrongSecurityToken");
//       let flagWarn = false;
//       const id = await getElectronVar("personId");
//       setWebcamSuspicious(webcamSuspicious);
//       setExternalDisplay(externalDisplay);
//       setRemoteSoftware(remoteSoftware);
//       setRemoteSoftwareFound(remoteSoftwareFound);
//       setwrongCohortNumber(wrongCohortNumber);
//       setwrongSecurityToken(wrongSecurityToken);
//       if (
//         webcamSuspicious ||
//         remoteSoftwareFound ||
//         externalDisplay ||
//         wrongCohortNumber ||
//         wrongSecurityToken
//       ) {
//         console.log("Envio de warning");
//         flagWarn = true;
//         // return { flagWarn, id, webcamSuspicious, externalDisplay, remoteSoftware, remoteSoftwareFound }
//       }
//       return {
//         flagWarn,
//         id,
//         webcamSuspicious,
//         externalDisplay,
//         remoteSoftware,
//         remoteSoftwareFound,
//       };
//     }

//     fetchData().then((response) => {
//       if (
//         response.flagWarn &&
//         firstTimePosting &&
//         (isWebcamSuspicious || isExternalDisplay || remoteSoftwareFound)
//       ) {
//         firstTimePosting = false;
//         let descriptionPost = "El usuario tiene: ";
//         if (response.remoteSoftware) {
//           descriptionPost += `[Softwares no permitidos: ${response.remoteSoftware}]`;
//         }
//         if (response.webcamSuspicious) {
//           descriptionPost += "[Camara sospechosa]";
//         }
//         if (response.externalDisplay) {
//           descriptionPost += "[Pantalla externa]";
//         }
//         const remotes = {
//           software: response.remoteSoftware,
//         };
//         console.log("Remotes json", remotes);
//         let info = "";
//         let log = 3;
//         if (remoteSoftwareFound) {
//           log = 2;
//           info = Buffer.from(
//             JSON.stringify({
//               remotes,
//             })
//           ).toString("base64");
//         }
//         sendProcesses(
//           {
//             identification: response.id,
//             // date: date,
//             type_log: log,
//             remoteControl: response.remoteSoftwareFound,
//             externalDevices: response.webcamSuspicious,
//             externalScreen: response.externalDisplay,
//             description: descriptionPost,
//             information: info,
//           },
//           true
//         ).then(() => {
//           initCount();
//         });
//       } else if (response.flagWarn && firstTimePosting && wrongCohortNumber) {
//         initCount();
//       }
//     });
//   }, [
//     isWebcamSuspicious,
//     isExternalDisplay,
//     remoteSoftwareFound,
//     wrongCohortNumber,
//     wrongSecurityToken,
//   ]);
//   useEffect(() => {
//     console.log("Entré");
//     if (isCoutdownOver()) {
//       clearInterval(intervalCountdown);
//       closeApp();
//     }
//   }, [countdown]);
//   const isCoutdownOver = () => {
//     if (countdown === 0) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const closeApp = async () => {
//     sendElectron({ type: CLOSE_APP });
//   };
//   const initCount = () => {
//     setInterval(() => {
//       if (countdown > 0) {
//         setCountdown((prev) => prev - 1);
//       } else {
//         sendElectron({ type: CLOSE_APP });
//       }
//     }, 1000);
//   };

//   return (
//     <>
//       <WarnContainer>
//         <Title>{title}</Title>
//         <Message>
//           {isExternalDisplay &&
//             `Se ha detectado una o más pantallas externas conectadas a su equipo. Este incidente será reportado. Por favor desconectelas y vuelva a ingresar. Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
//           {isWebcamSuspicious &&
//             `Se ha detectado un software sospechoso que puede alterar su cámara web. Este incidente será reportado. Por favor cierre toda aplicación que pueda estar causando este mensaje, por ejemplo, aplicaciones que cambien el fondo de la grabación. Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
//           {remoteSoftware &&
//             `Se han detectado uno o mas sofwares no permitidos para el examen. Este incidente será reportado. Por favor cierre: \r\n ${remoteSoftware}.\r\n Se cerrará la aplicación. Asegurese de tener todo en regla para evitar futuros inconvenientes.El aplicativo se cerrará en ${countdown}`}
//           {wrongCohortNumber &&
//             `Este aplicativo no es para esta admision, porfavor descargue el aplicativo correspondiente. El aplicativo se cerrará en ${countdown}`}
//           {wrongSecurityToken &&
//             `Este aplicativo no contiene el token de seguridad correcto, porfavor ponerse en contacto con soporte. El aplicativo se cerrará en ${countdown}`}
//         </Message>
//       </WarnContainer>
//     </>
//   );
// };

import React, { useState } from "react";
import Countdown from "react-countdown";
// import axiosConfig from "../../axiosConfig";
import "./styles.css";

// const { remote, ipcRenderer } = window.require("electron");
export default function WarningPage() {
  const [softwareList, setsoftwareList] = useState("");
  const [externalDisplay, setexternalDisplay] = useState(false);
  const [externalWebcam, setexternalWebcam] = useState(false);
  console.log("Entrada a warning");
  const closeWindow = () => {
    console.log("Cerrar ventana");
    window.close();
  };

  window.api.response("software", (args) => {
    console.log(`Received ${args} from main process`);
    // console.log("Args:", args);
    setsoftwareList(args);
  });
  window.api.response("externalDisplay", (event, args) => {
    setexternalDisplay(true);

    console.log(args);
  });
  window.api.response("externalWebcam", (event, args) => {
    setexternalWebcam(args);

    console.log(args);
  });

  setTimeout(() => {
    if (softwareList !== "") {
      console.log("Tomar pantallazo");
      window.api.request("take_screenshot");
    }
  }, 10000);

  setTimeout(() => {
    if (softwareList !== "") {
      window.api.request("close_software");
    }
  }, 15000);

  let countdownValue = 20; //Valor en segundos
  return (
    <div>
      {externalDisplay ? (
        <h1>
          Pantalla externa detectada, asegurese de desconectarla y tener todo en
          regla para poder continuar con el examen. Recuerde que el uso de una
          pantalla externa no está permitido y es causal de anulacion del
          examen.
        </h1>
      ) : (
        <></>
      )}
      {externalWebcam ? (
        <h1>
          Camara web adicionl detectada, durante el examen solo puede hacerse
          uso de una sola camara, asegurese de desconectarla y tener todo en
          regla para poder continuar con el examen. Recuerde que el uso camaras
          adicionales no está permitido y es causal de anulacion del examen.
        </h1>
      ) : (
        <></>
      )}
      {softwareList !== "" ? (
        <h1>
          Software {softwareList.join(", ")} no permitido se encuentra abierto,
          por favor asegúrese de cerrar todo por completo y tener todo en regla
          para poder continuar con el examen. Recuerde que el uso de software no
          permitidos es causal de anulación del examen.
        </h1>
      ) : (
        <></>
      )}
      <h1></h1>
      <h1>
        Esta ventana se cerrará en{" "}
        <Countdown
          onComplete={closeWindow}
          date={Date.now() + countdownValue * 1000}
        />
      </h1>
    </div>
  );
}
