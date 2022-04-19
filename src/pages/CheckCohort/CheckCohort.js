import React, { useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig";
import { COHORT } from "../../utils/constantes";
// const { ipcRenderer } = window.require("electron");
// const { ipcRenderer, remote } = require("electron");

export default function CheckCohort() {
  const [wrongcohort, setwrongcohort] = useState(false);
  useEffect(() => {
    axiosConfig
      .get(`checkAdmission/${COHORT}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        // Si se recibe un 404 desde el servidor esto indica que no es la cohorte indicada por ende debe descargar otro aplicativo
        console.log(error.response.status);
        if (error.response.status == 400) {
          setwrongcohort(true);
          // window.ipcRenderer.send("wrongCohort", "Hola");
          // ipcRenderer.send("wrongCohort", "Hola");
          window.electron.wrongCohort();
        }
        console.error(error.response.data);
      });
  }, []);

  return <div></div>;
}
