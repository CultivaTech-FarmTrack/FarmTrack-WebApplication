import http from "@/shared/services/http-common";

export class SubscriptionApiService {
    createSubscription(subscription){
        return http.post("subscriptions",{
            "accountId": subscription.accountId,
            "validDate": subscription.validDate,
            "active": false
        })
    }
    getSubscriptionById(accountId){
        return http.get("subscriptions/getSubscription/"+accountId,)
    }
    updateSubscription(accountId,active){
        return http.put("subscriptions",{
            "accountId": accountId,
            "active": active
        })
    }
}