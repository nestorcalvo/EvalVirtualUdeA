import React from "react";
import { useStore } from "../../store/storeContext";
import "./styles.css";
import { Checkbox } from "../Forms/checkbox";
import { useAuthActions } from "../../actions/authActions";
import { AUTH_LOGIN } from "../../actions/types/authTypes";
import {
  DISPLAY_ADD_EXTERNAL,
  DISPLAY_REMOVE_EXTERNAL,
} from "../../actions/types/displayTypes";
import { BIO_TRIGGER_SUSPICIOUS_CAMERA } from "../../actions/types/biometricTypes";

export const DeveloperBar = () => {
  const {
    state: {
      mac,
      auth: { isAuth },
      externalDisplay,
      biometrics: { isWebcamOk },
    },
    dispatch,
  } = useStore();
  const { globalLogout } = useAuthActions(dispatch);

  const onChangeLicense = () => {
    isAuth
      ? globalLogout()
      : dispatch({
          type: AUTH_LOGIN,
          payload: {
            user: {
              identificacion: "111111",
              email: "desarrolloingenieria2@udea.edu.co",
            },
            quiz: {
              name: "Examen posgrados Test",
              cohort: "2020-1",
              expirationDate: "2020-06-30 19:00:00",
            },
          },
        });
  };

  const onChangeExternalDisplay = () => {
    if (!externalDisplay) {
      dispatch({ type: DISPLAY_ADD_EXTERNAL });

      launchWarnWindow();
    } else {
      dispatch({ type: DISPLAY_REMOVE_EXTERNAL });
    }
  };

  const launchWarnWindow = async () => {
    const { ipcRenderer } = await window.require("electron");
    const config = {
      title: "PANTALLAS EXTERNAS ENCONTRADAS",
      message:
        "Se encontraron pantallas externas conectadas a su equipo. Por favor desconéctelas para poder continuar con el examen.",
      time: 10000,
    };
    window.api.request("show-warn", config);
  };

  const onChangeCameraSuspicious = () => {
    if (!externalDisplay) {
      dispatch({ type: BIO_TRIGGER_SUSPICIOUS_CAMERA, payload: true });

      launchCameraSuspicious();
    } else {
      dispatch({ type: BIO_TRIGGER_SUSPICIOUS_CAMERA, payload: false });
    }
  };

  const launchCameraSuspicious = async () => {
    console.log("Developr");
    const { ipcRenderer } = await window.require("electron");
    ipcRenderer.send("webcam-suspicious", "DEVELOPER");
  };

  return (
    <div id="DeveloperBar">
      <div className="DeveloperBarContainer">
        <h3>Developer bar</h3>
        <p className="warn align-center">Su dirección mac es: {mac}</p>
        <div className="actions">
          <Checkbox
            value={isAuth}
            name="check-licencia"
            label="¿Tiene licencia?"
            onChange={onChangeLicense}
          />
          <Checkbox
            value={externalDisplay}
            name="check-licencia"
            label="¿External display?"
            onChange={() => onChangeExternalDisplay()}
          />
          <Checkbox
            value={isWebcamOk}
            name="check-licencia"
            label="¿Cámara sospechosa?"
            onChange={() => onChangeCameraSuspicious()}
          />
        </div>
      </div>
    </div>
  );
};
