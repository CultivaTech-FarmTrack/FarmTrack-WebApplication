import http from "@/shared/services/http-common";
export class ContactServices{
    startChatContact(id){
        return http.put("contacts/startChatForContact/"+id);
    }
    getContactsForFarmer(token,id){
        return http.get("contacts/contactByFarmerId/"+id);
    }
    getContactsForSpecialist(id){
        return http.get("contacts/contactBySpecialistId/"+id);
    }
    getContactById(id){
        return http.get("contacts/contactById/"+id);
    }
    deleteContactById(id){
        return http.delete("contacts/deleteContactById/"+id)
    }
    addContact(farmerId,specialistId){
        return http.post("contacts",{
            "farmerId": farmerId,
            "specialistId": specialistId,
            "isChatStarted": false
        })
    }

}