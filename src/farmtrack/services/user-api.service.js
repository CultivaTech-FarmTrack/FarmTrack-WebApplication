import http from "@/shared/services/http-common";

export class UserServices{

    deleteProfile(accountId){
        return http.delete("profiles/deleteProfile/"+accountId)
    }
    updateSpecialist(specialist){
        return http.put("profiles/updateSpecialist",{
            "accountId": specialist.accountId,
            "name": specialist.name,
            "description": specialist.description,
            "imageUrl": specialist.imageUrl,
            "location": specialist.location,
            "expertise": specialist.expertise,
            "contactEmail": specialist.contactEmail,
            "areasOfFocus": specialist.areasOfFocus,
            "planId": specialist.planId
        });
    }
    updateFarmer(farmer){
        return http.put("profiles/updateFarmer",{
            "accountId": farmer.accountId,
            "name": farmer.name,
            "description": farmer.description,
            "imageUrl": farmer.imageUrl,
            "location": farmer.location,
            "planId": farmer.planId
        });
    }
    getUserById(id){
        return http.get("profiles/getProfile/"+id);
    }
    getUserByEmail(token,email){
        return http.get("profiles/getProfileByEmail/"+email,);
    }
    getAllUsersSpecialists(token){
        return http.get("profiles/getSpecialists");
    }

    login(email,password){
        return http.post("auth/login",{
            "email": email,
            "password": password,
        })
    }
    registerFarmer(newUser){
        return http.post("auth/registerFarmer",{
            "email": newUser.email,
            "password": newUser.password,
            "name": newUser.name,
            "description": newUser.description,
            "imageUrl": newUser.imageUrl,
            "location": "Lima, Peru",
            "type": newUser.type,
            "planId": newUser.plan
        })
    }
    registerSpecialist(newUser){
        return http.post("auth/registerSpecialist",{
            "email": newUser.email,
            "password": newUser.password,
            "name": newUser.name,
            "description": newUser.description,
            "imageUrl": newUser.imageUrl,
            "location": "Lima, Peru",
            "type": newUser.type,
            "expertise": newUser.expertise,
            "contactEmail": newUser.contactEmail,
            "areasOfFocus": newUser.areasOfFocus,
            "planId": 0
        })
    }
}