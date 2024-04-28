import http from "@/shared/services/http-common";
export class PlantServices{
    getPlantInfoById(id){
        return http.get("/plant/"+id);
    }
    getAllPlants(){
        return http.get("plant");
    }
    getPlantRangesById(id){
        return http.get("/ranges/"+id)
    }

}