import axios from "axios";

const http = axios.create({
  // baseURL:"http://localhost:58747/api/Peaks/GetPeaksDetails"
    baseURL: "http://localhost:58747/api/"
   // baseURL: "http://172.26.8.225:8086/api/Formulas"
  // baseURL: "http://172.26.8.225:8086/api/"
  // baseURL: "http://10.203.103.142:8086/api/"

})

export default http;