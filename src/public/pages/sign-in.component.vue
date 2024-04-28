<template>
  <div style="display: flex;justify-content: center; width: 100%; height: 100%">
    <div class="card">
      <pv-card class="SignInCard">
        <template #title>
          <div style="display: flex;justify-content: center">
            <img src="../../assets/planta.png" style="height: 50px;margin-bottom: 2rem"/>
          </div>
          <div class="Text" style="display: flex;justify-content: start; padding-left: 2rem; padding-bottom: 1rem">
            Login
          </div>
          <p style="font-weight: lighter; font-size: 1rem;padding-left: 2rem">
            Welcome, please Log in.
          </p>
        </template>
        <template #content>
          <div class="form">
            <label >Email</label>
            <pv-input id="email" class="input" v-model="email" maxlength="256" ></pv-input>
            <label style="margin-top: 0.5rem">Password</label>
            <pv-input id="password" type="password" class="input" v-model="password"></pv-input>
          </div>
          <div class="footer"  >
            <div class="Text" style="font-weight: lighter; font-size: 0.9rem; margin-bottom: 3rem">
            </div>
            <div class="buttons">
              <router-link to="/sign-up" class="rw" ><pv-button style="background-color: #337e21;border-color: #337e21;color: white" label="Register"/></router-link>
              <pv-button @click="signIn" style="background-color: #337e21;border-color: #337e21;color: white" label="Login"></pv-button>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
  </div>

</template>

<script>
import {UserServices} from "@/farmtrack/services/user-api.service";
export default {
  data(){
    return{
      email:"",
      password:""
    }
  },
  methods:{
    signIn(){
      new UserServices().login(this.email,this.password).then(response=>{
        sessionStorage.setItem("jwt",response.data.token)
        new UserServices().getUserByEmail(response.data.token,this.email).then(resp=>{
          sessionStorage.setItem("id",resp.data.accountId)
          sessionStorage.setItem("name",resp.data.name)
          sessionStorage.setItem("email",resp.data.email)
          sessionStorage.setItem("imageUrl",resp.data.imageUrl)
          sessionStorage.setItem("description",resp.data.description)
          sessionStorage.setItem("type",resp.data.type.toString().toLowerCase())
          sessionStorage.setItem("planId",resp.data.planId)
          if(resp.data.type==="FARMER"){
            this.$router.push("/farmer/crops")
          }else {
            this.$router.push("/specialist/farmers")
          }
        }).catch(reason => {
          this.$toast.add({severity:'error', summary: 'Credenciales invalidad', detail:'Correo o contraseña incorrecta', life: 3000});
        })
      })
    },
    sendMessage(type,name){
      let obj={
        logged:true,
        type: type,
        name:name
      }
      this.emitter.emit("message-from-sign-up",obj)
    }
  },
  created() {
    sessionStorage.clear()
    localStorage.clear()
  }
}
</script>

<style scoped>
.form label{
  display: block;
}
.SignInCard{
  width: 10cm;
  border-radius: 0.5rem;
  padding-top: 2rem;
}
.Text{
  text-align: center;
}
.rw{
  color: white;
  text-decoration: none;
}
.card{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 97vh;
}
.form{
  margin: 0 0 0 2rem;
  padding-top: 1rem;
}
.form .input{
  margin: 0.3rem 0;

}
.buttons{
  display: flex;
  margin: 1.3rem 0;
  justify-content: space-around;
}
.footer{
  margin-top: 1rem;
}
.input{
  width: 85%;

}
.font{
  font-family: 'Roboto', sans-serif;
}
</style>