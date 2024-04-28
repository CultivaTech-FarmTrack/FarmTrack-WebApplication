<template>
  <div style="height: 100vh;width: 100%;  display:flex; justify-content: center; align-content: center;align-items: center">
    <div v-if="loading===true" style="width: 100%;display: flex;justify-content: center">
      <i class="pi pi-spin pi-spinner" style="font-size: 5rem"></i>
    </div>
    <pv-card v-if="loading===false" style=" border-radius: 1rem;justify-content: center;width: 50vw;">
      <template #header>
        <div style="background-color: #54ab2a;border-top-left-radius: 1.3rem;border-top-right-radius: 1.3rem">
          <div style="height: 100%;padding: 1.5rem 1rem 1rem 1rem">
            <div style="width: 100%;display: flex;justify-content: center">
              <i class="pi pi-check-circle" style="font-size: 2.5rem"></i>
            </div>
            <div style="width: 100%;display: flex;justify-content: center">
              <h1 style="color: white;padding-top: 1rem">SUCCESSFUL PAYMENT</h1>
            </div>


          </div>
        </div>
      </template>
      <template #content>
        <div style="margin: 1rem 2rem">
          <div style="display: flex;justify-content: left;width: 100%;">
            <h2>Your payment has been processed correctly</h2>
          </div>
          <div style="display: flex;justify-content: space-between;margin: 1rem 0;width: 100%">
            <p>Name:</p>
            <p>{{this.user.name}}</p>
          </div>
          <div style="display: flex;justify-content: space-between;margin: 1rem 0;width: 100%">
            <p>Email:</p>
            <p>{{this.user.email}}</p>
          </div>
          <div style="display: flex;justify-content: left;width: 100%">
            <p>{{this.user.name}}, your subscription is active until {{this.subscription.validDate}}</p>
          </div>
          <div style="display: flex;justify-content: center;width: 100%;margin-top: 2rem">
            <pv-button style="background-color: #3da621;border-color: #3DA621FF;color: white;border-radius: 0.5rem" severity="successful" @click="signIn()" label="CONTINUE"/>
          </div>
        </div>
      </template>
    </pv-card>
  </div>


</template>

<script>

import {ref} from "vue";
import {SubscriptionApiService} from "@/farmtrack/services/subscription-api.service";
import {UserServices} from "@/farmtrack/services/user-api.service";

export default {
  name: "successfulPay",
  data(){
    return{
      accountId:null,
      subscription:{},
      user:{},
      loading:true
    }
  },
  created() {
    //localStorage.setItem("tempUserAccount","1")
    this.accountId=parseInt(localStorage.getItem("tempUserAccount"))
    localStorage.removeItem("tempUserAccount")
    new SubscriptionApiService().updateSubscription(this.accountId,true).then(res=>{
      new SubscriptionApiService().getSubscriptionById(this.accountId).then(r=>{
        this.subscription=r.data
        console.log(this.subscription)
        new UserServices().getUserById(this.accountId).then(res=>{
          this.user=res.data
          this.loading=false

        })
      })

    })

  },
  methods:{
    signIn(){
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>

</style>