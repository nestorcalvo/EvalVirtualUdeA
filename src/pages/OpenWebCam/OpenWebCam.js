import React, { Component, useEffect, useRef, useState } from "react";
// const { ipcRenderer } = require('electron')

function OpenWebCam() {
  const defaultMessage = "Espera mientras tu camara se enciende . . .";
  const errorMessage1 = `La aplicación no pudo encender su camara de manera correcta, 
    es muy posible que otra aplicación se encuentre haciendo uso de esta o la camara se encuentre apagada. Porfavor revise antes de iniciar el examen para evitar
    tener problemas posteriormente.`;

  const videoRef = useRef(null);
  const [message, setmessage] = useState(defaultMessage);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  // useEffect(() => {
  //     console.log(JSON.parse(ipcRenderer.sendSync('detectRTC', 'Solicitud para obtener informacion del RTC')))
  // }, [])

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        //   Colocar mensaje vacio debido a que ya se pudo inciar la camara
        setmessage("");
        let video = videoRef.current;

        video.srcObject = stream;
        video.play();
      })

      // DOMException aparece cuando algún otro elemento del pc está usando la camara
      .catch((DOMException) => {
        setmessage(errorMessage1);
        console.error(
          "Se debe arreglar el problema de la camara con el usuario"
        );
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };
  return (
    <div>
      <div id="video">
        {message && <p id="video_text">{message}</p>}
        <video ref={videoRef} />
      </div>
    </div>
  );
}
export default OpenWebCam;
