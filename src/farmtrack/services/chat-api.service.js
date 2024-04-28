import http from "@/shared/services/http-common";
export class ChatServices{
    sendMessage(message){
        return http.post("messages",{
            "contactId": message.contactId,
            "authorId": message.authorId,
            "message": message.message,
            "hour": message.hour
        })
    }
    getChatByContactId(id){
        return http.get("messages/"+id);
    }

}