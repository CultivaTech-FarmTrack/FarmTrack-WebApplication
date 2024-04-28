import http from "@/shared/services/http-common";

export class NotificationApiService {
    sendNotification(notification){
        return http.post("notifications",{
            "message": notification.message,
            "imageUrl": notification.imageUrl,
            "notificationType": notification.notificationType,
            "date": notification.date,
            "toAccountId": notification.toUserId,
            "plantId": notification.plantId,
            "fromAccountId": notification.fromUserId,
            "seen": notification.seen
        })
    }
    getAllNotificationByUserId(userId){

        return http.get("notifications/getByToAccountId/"+userId);
    }

    deleteNotification(id){
        return http.delete("notifications/deleteNotificationById/"+id)
    }

}