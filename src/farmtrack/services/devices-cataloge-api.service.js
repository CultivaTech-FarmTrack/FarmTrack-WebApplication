
import axios from "axios";
const http = axios.create({
    baseURL:"https://my-json-server.typicode.com/DevIOT-AgriPure/agripure-jsonTres/DevicesCatalog/",
    headers: { "Content-type": "application/json" },
})
export class DeviceCatalogeServices{
    getAllDevices(){
        return http.get("");
    }

}
