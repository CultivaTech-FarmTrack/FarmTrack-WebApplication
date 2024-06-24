import http from "@/shared/services/http-common";
export class DeviceServices{
    getDeviceInfoByCropId(id){
        return http.get("devices/cropId/"+id);
    }
    getFullDeviceInfoByCropId(id){
        return http.get("devices/device/cropId/"+id);
    }
    getDeviceById(id){
        return http.get("devices/"+id);
    }
    getAllDevicesByUserId(id){
        return http.get("devices/getDevicesByFarmerId/"+id);
    }
    getDeviceValueById(id){
        return http.get("devices/temperaturehumidity/"+id);
    }
    setDeviceStatus(device){
        return http.post("devices/status",{
            "deviceId": device.id,
            "newStatus": !device.active
        })
    }
    updateDeviceById(device){
        return http.put("devices/updateDeviceById",{
            "id": device.id,
            "name": device.name,
            "cropName": device.cropName,
            "projectId": device.projectId,
            "active": device.active,
            "activeNotification": device.activeNotification
        })
    }
    postDevice(device){
        return http.post("devices",{
            "name": device.name,
            "model": device.model,
            "category": device.category,
            "cropName": device.cropName,
            "cropId": device.cropId,
            "farmerId": device.farmerId,
            "projectId": device.projectId
        })
    }

}