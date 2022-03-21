// import React from "react";
// import { useStore } from "../../store/storeContext";
// import { MiniLoader } from "../../components/MiniLoader";
// import { CohortsList } from "../../components/CohortsList";
// import { ActiveSessionWrapper, Title } from "./styles";
// import { useHomeState } from "./state";
// import { WarnMessage } from "../../components/WarnMessage";
// import {
//   CheckPeripheralsButton,
//   LoadingButton,
// } from "../../components/Buttons";
// import { useCohortState } from "../CohortPage/state";

// export const HomePage = () => {
//   const {
//     state: {
//       auth: { user, cohorts, activeCohort, loading, error },
//       biometrics: { isBiometricallyRegistered },
//     },
//   } = useStore();
//   const { handleOpenQuiz } = useCohortState({});
//   const { openBiometrics } = useHomeState({});

//   const fillCohortList = () => (
//     <>
//       <ActiveSessionWrapper>
//         <div
//           style={{
//             margin: "2%",
//           }}
//         >
//           <Title>EXAMEN DE ADMISIÓN</Title>
//           <h2 style={{ textAlign: "center", margin: "2%" }}>
//             {" "}
//             Bienvenido al examen de admisión
//           </h2>
//           <h3 style={{ backgroundColor: "darkgreen" }}>
//             Recomendamos probar el acceso a su cámara web mediante el botón
//             provisto a continuación.
//           </h3>
//           <h3 style={{ backgroundColor: "red" }}>
//             IMPORTANTE:
//             <ol>
//               <li>
//                 No empiece el examen sin antes verificar que se pueda acceder a
//                 la cámara web.
//               </li>
//               <li>
//                 Una vez ingrese al examen, no podrá cerrar ninguna de las
//                 ventanas del aplicativo, de lo contrario, se generará un cierre
//                 total del examen y no podrá retornar a él.
//               </li>
//               <li>
//                 El uso de software de acceso remoto, máquinas virtuales y
//                 segundas pantallas está prohibido. Cualquier uso será detectado
//                 y reportado y es causal de sanciones.
//               </li>
//             </ol>
//           </h3>
//           <CohortsList cohorts={cohorts} />
//         </div>
//       </ActiveSessionWrapper>
//     </>
//   );

//   // const fillBiometricalRegisterMessage = () => (
//   //   <WarnMessage
//   //     message="Para proseguir debe tomarse la foto para realizar la validación biométrica"
//   //     background="#DD941B"
//   //   />
//   // );

//   return (
//     <>
//       {/* {loading && <MiniLoader />}
//       {!loading && user && !activeCohort && isBiometricallyRegistered
//         ? fillCohortList()
//         : fillCohortList()} */}
//       {fillCohortList()}
//       <table style={{ transform: "translate(50%, -10%)" }}>
//         <tr>
//           <th>
//             <div>
//               <LoadingButton
//                 className="ActiveSessionBtn"
//                 text="Iniciar examen"
//                 onClick={handleOpenQuiz}
//               />
//             </div>
//           </th>
//           <th>
//             <div style={{ transform: "translate(40%, -10%)" }}>
//               <CheckPeripheralsButton
//                 className="ActiveSessionBtn2"
//                 text="Probar Acceso a Cámara"
//                 onClick={openBiometrics}
//               />
//             </div>
//           </th>
//         </tr>
//         <tr>
//           <div id="container" style={{ width: "50%" }}>
//             <video autoplay="true" id="videoElement"></video>
//             <script></script>
//           </div>
//         </tr>
//       </table>
//     </>
//   );
// };
import React from "react";
// import CheckCohort from "../CheckCohort/CheckCohort";
// import Login from "../LoginPage/LoginPage";
import OpenWebCam from "../OpenWebCam/OpenWebCam";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/styles.css";
// const { ipcRenderer } = window.require("electron");
const theme = createTheme();
export default function HomePage() {
  const renderExamPage = () => {
    console.log("Iniciar examen");
    window.ipcRenderer.send("exam");
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          sx={{ height: "100%", width: "80%", mx: "auto", my: "auto" }}
          display="flex"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <CssBaseline />
          <Grid item component={Paper} elevation={6}>
            <Box
              sx={{
                // my: 8,
                // mx: 32,
                mx: "auto",
                my: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                EXAMEN DE ADMISIÓN
              </Typography>
              <Typography component="h2" variant="h5">
                Bienvenido al examen de admisión
              </Typography>
              <List
                sx={{
                  // width: "50%",
                  // height: "auto",
                  mx: "auto",
                  my: "auto",
                  // maxWidth: "80%",
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <Typography component="subtitle1">
                    Se recomienda verificar en la parte inferior (encima del
                    botón de iniciar examen) que su camara esté encendida y
                    funcionando.
                  </Typography>
                </ListItem>

                <ListItem>
                  <Typography component="subtitle1">
                    Una vez ingrese al examen, no podrá cerrar ninguna de las
                    ventanas del aplicativo, de lo contrario, se generará un
                    cierre total del examen y no podrá retornar a él.
                  </Typography>
                </ListItem>

                <ListItem>
                  <Typography component="subtitle1">
                    El uso de software de acceso remoto, máquinas virtuales y
                    segundas pantallas está prohibido. Cualquier uso será
                    detectado y reportado y es causal de sanciones.
                  </Typography>
                </ListItem>
              </List>
              <Card variant="outlined" sx={{ mx: "auto" }}>
                {<OpenWebCam></OpenWebCam>}
              </Card>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={renderExamPage}
                sx={{ mx: "auto", maxWidth: "20%", bgcolor: "success.main" }}
              >
                Iniciar Examen
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      {/* <div className="home-container">
        <h1>EXAMEN DE ADMISIÓN</h1>
        <h2 style={{ textAlign: "center", margin: "2%" }}>
          {" "}
          Bienvenido al examen de admisión
        </h2> */}
      {/* <h3 style={{ backgroundColor: "darkgreen" }}>
          Recomendamos probar el acceso a su cámara web mediante el botón
          provisto a continuación.
        </h3> */}
      {/* <h3 style={{ backgroundColor: "red" }}>
          IMPORTANTE:
          <ol>
            <li>
              Se recomienda verificar en la parte inferior (ecima del botón de
              iniciar examen) que su camara esté encendida y funcionando.
            </li>
            <li>
              Una vez ingrese al examen, no podrá cerrar ninguna de las ventanas
              del aplicativo, de lo contrario, se generará un cierre total del
              examen y no podrá retornar a él.
            </li>
            <li>
              El uso de software de acceso remoto, máquinas virtuales y segundas
              pantallas está prohibido. Cualquier uso será detectado y reportado
              y es causal de sanciones.
            </li>
          </ol>
        </h3>
        {<OpenWebCam></OpenWebCam>}
        <button onClick={renderExamPage}>Iniciar examen</button>
      </div> */}
    </>
  );
}
