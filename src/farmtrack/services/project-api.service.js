import http from "@/shared/services/http-common";
export class ProjectApiService {
    starProject(projectId){
        return http.put("projects/startProject/"+projectId)
    }
    addDeviceProject(projectId){
        return http.put("projects/AddDeviceProject/"+projectId)
    }
    createProject(project){
        return http.post("projects",{
            "farmerId": project.farmerId,
            "specialistId": project.specialistId,
            "isStarted": project.projectStarted,
            "cropId": project.cropId,
            "device": project.device,
            "name": project.name,
            "description": project.description,
            "startDate": project.startDate,
            "endDate": project.endDate
        })
    }
    getProjectByFarmerId(id){
        return http.get("projects/projectsByFarmerId/"+id);
    }
    getProjectsBySpecialistId(id){
        return http.get("projects/projectsBySpecialistId/"+id);
    }
    getProjectById(id){
        return http.get("projects/"+id);
    }
    getProjectByCropId(cropId){
        return http.get("projects/getProjectByCropId/"+cropId)
    }
}