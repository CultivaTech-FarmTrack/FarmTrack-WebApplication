import axios from "axios";
const http = axios.create({
    baseURL:"https://farm-track-backend.zeabur.app/api/v1/",
    headers: { "Content-type": "application/json" },
})

export default http;