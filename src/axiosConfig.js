import axios from "axios";
import { BACK_URL_PRODUCTION, BACK_URL_DEV, TOKEN } from "./utils/constantes";
const instance = axios.create({
  baseURL: BACK_URL_PRODUCTION,
  headers: {
    "Token-Security": TOKEN,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
  },
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

export default instance;
