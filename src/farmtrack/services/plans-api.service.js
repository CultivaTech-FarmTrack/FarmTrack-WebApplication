import axios from "axios";
const http = axios.create({
    baseURL:"https://my-json-server.typicode.com/DevIOT-AgriPure/agripure-jsonTres/",
    headers: { "Content-type": "application/json" },
})
export class PlansServices{
    getPlans(){
        return http.get("plans");
    }
    getPlanById(planId){
        return http.get("plans/"+planId);
    }

}