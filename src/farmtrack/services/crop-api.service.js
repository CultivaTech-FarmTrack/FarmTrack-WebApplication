import http from "@/shared/services/http-common";
export class CropServices{
    addCrop(token,farmerId,plantId){
        return http.post("crops",{
            "farmerId": farmerId,
            "plantId": plantId
        },{ headers: {"Authorization" : `Bearer ${token}`} })
    }
    setSpecialistToCrop(token,id,specialistId){
        return http.put("/crops/setSpecialistToProject",{
            "id": id,
            "specialistId": specialistId
        })
    }
    getCropsByFarmerId(token,id){
        return http.get("crops/"+id,{ headers: {"Authorization" : `Bearer ${token}`} });

    }
    getCropInfoById(token,id){
        return http.get("crops/getCrop/"+id,);

    }
    deleteCropById(token,id){
        console.log(id)
        return http.delete("crops/deleteCrop/"+id);

    }

}