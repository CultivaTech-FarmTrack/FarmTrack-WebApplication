import http from "@/shared/services/http-common";
export class ActivitiesApiService {
    setActivityCompleted(id){
        return http.put("activities/completeActivity/"+id);
    }
    getActivitiesByProjectId(token,id){
        return http.get("activities/activityByProjectId/"+id,);
    }
    addActivity(activity){
        return http.post("activities",{
            "projectId": activity.projectId,
            "title": activity.title,
            "description": activity.description,
            "date": activity.date
        })
    }
}