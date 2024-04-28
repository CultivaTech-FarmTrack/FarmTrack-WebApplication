import http from "@/shared/services/http-common";
export class SpecialistServices{
    getSpecialistInformationByUserId(id){
        return http.get("profiles/getSpecialistInfoByAccountId/"+id);
    }

}