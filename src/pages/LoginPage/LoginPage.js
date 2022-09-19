// import React, { useEffect, useRef } from 'react'
// import { Login } from '../../components/Login'
// import { useHistory, useLocation } from 'react-router-dom'
// import { useStore } from '../../store/storeContext'
// import { useAuthActions } from '../../actions/authActions'
// import { TOKEN } from '../../utils/constantes'
// // import { DeveloperBar } from '../../components/DeveloperBar'
// // import { NotifyExternalDisplay } from '../../components/NotifyExternalDisplay'

// export const LoginPage = () => {
//   const {
//     state: {
//       auth: { isAuth }
//     },
//     dispatch
//   } = useStore()
//   const { getSessionInfo } = useAuthActions(dispatch)
//   const history = useHistory()
//   const location = useLocation()
//   const { from } = location.state || { from: { pathname: '/home' } }

//   const checkSession = () => {
//     const token = window.localStorage.getItem(TOKEN)
//     console.log("Token", token)
//     // If user isn't authenticated we verify login
//     if (!isAuth && token) {
//       console.log('sessionInfo desde LoginPage')
//       getSessionInfo()
//     }
//   }
//   const initialTrackingValues = useRef({
//     redirectHome: () => history.replace(from)
//     // callCheckSession: checkSession
//   })
//   // useEffect(() => {
//   //   //const { callCheckSession } = initialTrackingValues.current
//   //   //callCheckSession()
//   // }, [])

//   useEffect(() => {
//     const { redirectHome } = initialTrackingValues.current
//     // Is authenticated redirect to /home
//     if (isAuth) {
//       redirectHome()
//     }
//     // redirectHome()
//   }, [isAuth])

//   return (
//     <Login />
//   )
// }
import React, { useState } from "react";
import { COHORT } from "../../utils/constantes";
import CheckCohort from "../CheckCohort/CheckCohort";
import axiosConfig from "../../axiosConfig";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "../../utils/5f11e2ed57141.jpeg";
import "../../styles/styles.css";
const theme = createTheme();
export default function Login() {
  const [id_number, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [wrongSesionInfoMessage, setwrongSesionInfoMessage] = useState("");

  function validateForm() {
    return id_number.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axiosConfig
      .get("checkCandidate", {
        params: {
          id_number: data.get("user"),
          password: data.get("password"),
          id_admission: COHORT,
        },
      })
      .then((response) => {
        console.log(response);
        setwrongSesionInfoMessage("");
        // window.api.request("login", response.data);
        window.electron.login(response.data);
      })
      .catch((error) => {
        if (error.response.status == 400) {
          console.error(error);
          setwrongSesionInfoMessage(
            "Usuario o contraseña incorrectos, porfavor intente de nuevo"
          );
          // Enviar que el usuario o la contraseña estan incorrectos
        }
      });
  }

  return (
    // <div className="Login">

    //     <form onSubmit={handleSubmit}>
    //         <label>
    //             User:
    //             <input type={id_number} value={id_number} onChange={(e) => setIdNumber(e.target.value)}></input>
    //         </label>
    //         <label>
    //             Password:
    //             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
    //         </label>
    //         <button type="submit" disabled={!validateForm()}>
    //             Login
    //         </button>
    //     </form>
    //     <div className="errorMessage">
    //       {wrongSesionInfoMessage}
    //     </div>
    // </div>
    <>
      <CheckCohort />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100%" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${Image})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="user"
                  label="User"
                  name="user"
                  autoComplete="user"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "success.main" }}
                >
                  Log In
                </Button>
              </Box>
              {/* <Typography component="subtitle1" variant="h5" /> */}
              <Typography sx={{ color: "error.main" }}>
                {wrongSesionInfoMessage}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
