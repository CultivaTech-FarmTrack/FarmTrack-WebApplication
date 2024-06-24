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
            <label for="email"  style="margin-top: 0.5rem">Email</label>
            <pv-input id="email" class="input" v-model="email" maxlength="256" ></pv-input>
            <label for="email" style="margin-top: 0.5rem">Password</label>
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
.buttons  {
  background-color: #337e21;
  border-color: #337e21;
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
  padding: 0.75rem 1.5rem;
  font-size: 1rem; /* tamaño de fuente apropiado */
  display: flex;
  margin: 1.3rem 0;
  justify-content: space-around;
}
.buttons :hover {
  background-color: #285a15; /* un tono más oscuro al hacer hover */
  box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* sombra para efecto de elevación */
  transform: translateY(-2px); /* ligero movimiento hacia arriba */
}
.buttons :active {
  background-color: #1e4211; /* aún más oscuro al presionar */
  box-shadow: 0 2px 4px rgba(0,0,0,0.25); /* sombra más ajustada */
}

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
  color: white ;
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
.form .input{
  width: 100%; /* Asegura que el input ocupa todo el espacio disponible */
  padding: 10px 15px;
  margin: 10px 0;
  background-color: #0a0a0a; /* Un fondo claro para los campos */
  border: 1px solid #ccc; /* Un borde sutil */
  border-radius: 5px; /* Bordes redondeados para un look más suave */
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); /* Sombra interior para profundidad */
  transition: border-color 0.3s, box-shadow 0.3s;
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