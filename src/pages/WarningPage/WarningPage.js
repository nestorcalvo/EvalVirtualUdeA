import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
// import axiosConfig from "../../axiosConfig";
import "./styles.css";

export default function WarningPage() {
  const [softwareList, setsoftwareList] = useState("");
  const [externalDisplay, setexternalDisplay] = useState(false);
  const [externalWebcam, setexternalWebcam] = useState(false);
  console.log("Entrada a warning");
  // console.log(softwareList);
  // console.log(externalDisplay);
  // console.log(externalWebcam);
  const closeWindow = () => {
    console.log("Cerrar ventana warning");
    if (softwareList) {
      window.electron.closeWarnWindow();
    } else if (externalDisplay) {
      window.electron.closeWindow();
    }
  };
  useEffect(() => {
    window.myAPI.loadSoftware().then((e) => {
      setsoftwareList(e);
    });
    window.myAPI.loadScreen().then((e) => {
      setexternalDisplay(e);
    });
  }, []);

  // window.api.response("software", (event, args) => {
  //   console.log(`Received ${args} from main process`);
  //   // console.log("Args:", args);
  //
  // });
  // window.api.response("externalDisplay", (event, args) => {
  //   setexternalDisplay(true);

  //   console.log(args);
  // });
  // window.api.response("externalWebcam", (event, args) => {
  //   setexternalWebcam(args);

  //   console.log(args);
  // });

  setTimeout(() => {
    if (softwareList !== "") {
      console.log("Tomar pantallazo");
      window.electron.take_screenshot();
      // window.api.request("take_screenshot");
    }
  }, 10000);

  setTimeout(() => {
    if (softwareList !== "") {
      window.electron.close_software();
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
