<template>
  <div style="height: 100vh;width: 100%;  display:flex; justify-content: center; align-content: center;align-items: center">
    <div v-if="currentPath==='Types'">
      <pv-card style=" border-radius: 1rem;justify-content: center;width: 50vw;">
        <template #content>
          <div style="display: flex;justify-content: center;margin: 2rem 0">
            <h1 style="color: white;">SELECT USER TYPE</h1>
          </div>
          <div class="plan-cards">
            <div style="width: 100%;display: flex;justify-content: center;">
              <pv-card
                  class="type-card"
                  :class="{ selected: selectedUserType === 'farmer' }"
                  @click="selectUserType('farmer')"
              >
                <template #content>
                  <div style="display: flex;justify-content: center;margin-bottom: 1rem">
                    <img src="../../assets/farmer_logo.png" alt="" style="height: 150px;">
                  </div>
                  <div style="display: flex;justify-content: center">
                    <h2 style="color: white">Farmer</h2>
                  </div>
                </template>
              </pv-card>
            </div>
            <div style="width: 100%;display: flex;justify-content: center">
              <pv-card
                  class="type-card"
                  :class="{ selected: selectedUserType === 'specialist' }"
                  @click="selectUserType('specialist')">
                <template #content>
                  <div style="display: flex;justify-content: center;margin-bottom: 1rem">
                    <img src="../../assets/specialist_logo.png" alt="" style="height: 150px;">
                  </div>
                  <div style="display: flex;justify-content: center">
                    <h2 style="color: white">Specialist</h2>
                  </div>
                </template>
              </pv-card>
            </div>
          </div>
          <div style="display: flex;justify-content: space-evenly">
            <pv-button style="border-radius: 1rem;color: white;background-color: #131313;border-color: #131313" @click="goBack('sign-in')" label="Back"/>
            <pv-button :disabled="!isUserTypeSelected" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="nextPath()" label="Next"/>
          </div>
        </template>
      </pv-card>
    </div>
    <div v-if="currentPath==='Plans'">
      <pv-card style=" border-radius: 1rem;justify-content: center;width: 50vw;">
        <template #content>
          <div class="content" >
            <div class="steps" style="margin-top: 2rem">
              <p style="margin-left:2rem; text-decoration-line: none;color: white; cursor: pointer " @click="goBack('Types')" >
                Go back
              </p>
            </div>
            <div class="phrase" style="margin-bottom: 3rem; display: flex; justify-content: center; text-align: center">
              <h1>Select your plan in FarmTrack</h1>
            </div>
            <div class="plans">
              <div v-show="defaultPlan" class="default">
                <div class="plan-cards">
                  <div v-for="plan in plans">
                    <pv-card class="plan-card">
                      <template #header>
                        <div class="solidColor" v-if="plan.name==='Free'" style="background-color: #158001"></div>
                        <div class="solidColor" v-if="plan.name==='Premium'" style="background-color: #ff9914"></div>
                      </template>
                      <template #content>
                        <div class="content">
                          <div style="display: flex;justify-content: center;width: 100%">
                            <h2>{{plan.name.toUpperCase()}}</h2>
                          </div>
                          <div class="price">
                            <div style="height: 100%;width: 100%">
                              <div style="width: 100%; display: flex">
                                <div style="width: 100%;display: flex;justify-content: center">
                                  <h1>S/.{{ plan.price }}</h1>
                                </div>
                              </div>
                              <div style="display: flex;justify-content: center">
                                <h3>MONTH</h3>
                              </div>
                            </div>
                          </div>
                          <div class="visible">
                            <template v-if="plan.name==='Premium'">
                              <div class="usherVisible">
                                <div class="margin-feature" >
                                  <div class="feature-container">
                                    <i class="pi pi-check-circle"></i>
                                    <p >Add unlimited Crops</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i class="pi pi-check-circle"></i>
                                    <p >Contact Specialists</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i class="pi pi-check-circle"></i>
                                    <p >Get unlimited Projects</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i class="pi pi-check-circle"></i>
                                    <p >Crop monitoring</p>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <template v-if="plan.name==='Free'">
                              <div class="usherVisible">
                                <div class="margin-feature" >
                                  <div class="feature-container">
                                    <i class="pi pi-check-circle"></i>
                                    <p >Add unlimited Crops</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i class="pi pi-check-circle"></i>
                                    <p >Contact Specialists</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i style="color: #b70000" class="pi pi-times-circle"></i>
                                    <p>Get unlimited Project</p>
                                  </div>
                                  <div class="feature-container" >
                                    <i style="color: #b70000" class="pi pi-times-circle"></i>
                                    <p >Crop monitoring</p>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                          <div style="width: 100%;display: flex;justify-content: center">
                            <pv-button class="planButton" v-if="plan.name==='Free'" style="background-color: darkgreen; border-color:darkgreen ;color:white" @click="planSelected(1)">Select</pv-button>
                            <pv-button class="planButton" v-if="plan.name==='Premium'" style="background-color: #ff9914;border-color: #ff9914; color:white" @click="planSelected(2)">Select</pv-button>
                          </div>
                        </div>
                      </template>
                    </pv-card >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </pv-card>
    </div>
    <div v-if="currentPath==='Form'">
      <div class="card" style="height: 98vh ">
        <pv-card style=" border-radius: 1rem;justify-content: center;">
          <template #content>
            <div class="content" style="width: 50vw">
              <p style="margin:2rem 2rem 1rem 2rem; text-decoration-line: none;color: white; cursor: pointer " @click="goBack('Plans')"  >
                Go back
              </p>
              <div class="steps" >
              </div>
              <div class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                <h1>Create an account</h1>
              </div>
              <div class="card" style="justify-content: center;">
                <div class="register" style="width: 30vw">
                  <div class="form">
                    <div class="nombre" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-input id="name" class="form-input" @input="actualizarEstadoBoton()" placeholder="Name" style="border-radius: 1rem" v-model="user.name" maxlength="56" @keypress="validarNombre($event)"></pv-input>
                    </div>
                    <div class="email" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-input id="email" class="form-input" @input="actualizarEstadoBoton()" placeholder="Email" style="border-radius: 1rem" maxlength="256" v-model="user.email"></pv-input>
                    </div>
                    <div class="password" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-input id="password" type="password" class="form-input" @input="actualizarEstadoBoton()" placeholder="Password" style="border-radius: 1rem" v-model="user.password"></pv-input>
                    </div>
                    <div class="Description" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-textArea id="description" class="form-input" @input="actualizarEstadoBoton()" placeholder="Description" style="border-radius: 1rem" maxlength="600" v-model="user.description"></pv-textArea>
                    </div>
                  </div>
                  <div class="footer">
                    <div v-if="selectedUserType==='farmer'" class="form-Text" style="margin: 3rem 0">
                      By creating my account I accept the terms of service and policy of
                      <br>FarmTrack
                    </div>
                    <div class="buttons" >
                      <pv-button :disabled="!esFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="addTemporaryUser()">Next</pv-button >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
    <div v-if="currentPath==='SpecialistForm'">
      <div class="card" style="height: 98vh ">
        <pv-card style=" border-radius: 1rem;justify-content: center;">
          <template #content>
            <div class="content" style="width: 50vw">
              <p style="margin:2rem 2rem 1rem 2rem; text-decoration-line: none;color: white; cursor: pointer " @click="goBack('Form')"  >
                Go back
              </p>
              <div class="steps" >
              </div>
              <div class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                <h1>Add your information</h1>
              </div>
              <div class="card" style="justify-content: center;">
                <div class="register" style="width: 30vw">
                  <div class="form" >
                    <div class="ContactEmail" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-input id="contactEmail" class="form-input" @input="actualizarEstadoBotonSpecialistForm()" placeholder="Contact Email" style="border-radius: 1rem" maxlength="256" v-model="user.contactEmail"></pv-input>
                    </div>
                    <div class="Expertise" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-textArea id="expertise" class="form-input" @input="actualizarEstadoBotonSpecialistForm()" placeholder="Expertise" style="border-radius: 1rem" maxlength="600" v-model="user.expertise"></pv-textArea>
                    </div>
                    <div class="AreaOfFocus" style="display: flex; justify-content: center; margin: 1rem 0">
                      <pv-textArea id="areaOfFocus" class="form-input" @input="actualizarEstadoBotonSpecialistForm()" placeholder="Area Of Focus" style="border-radius: 1rem" maxlength="600" v-model="user.areasOfFocus"></pv-textArea>
                    </div>
                  </div>
                  <div class="footer">
                    <div class="form-Text" style="margin: 3rem 0">
                      By creating my account I accept the terms of service and policy of
                      <br>FarmTrack
                    </div>
                    <div class="buttons" >
                      <pv-button :disabled="!esSpecialistFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="addTemporaryUser()">Next</pv-button >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
    <div v-if="currentPath==='ProfilePicture'">
      <div class="card" style="height: 98vh ">
        <pv-card style=" border-radius: 1rem;justify-content: center;">
          <template #content>
            <div class="content" style="width: 50vw">
              <p v-if="selectedUserType==='farmer'" style="margin:2rem 2rem 1rem 2rem; text-decoration-line: none;color: white; cursor: pointer " @click="goBack('Form')"  >
                Go back
              </p>
              <p v-else style="margin:2rem 2rem 1rem 2rem; text-decoration-line: none;color: white; cursor: pointer " @click="goBack('SpecialistForm')"  >
                Go back
              </p>

              <div class="card" style="justify-content: center;">
                <div class="profile">
                  <div v-if="this.profilePictureUploaded===false">
                    <div v-if="loadingPhoto===false" class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                      <h1>Upload a Profile Picture</h1>
                    </div>
                    <div v-if="loadingPhoto===true" class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                      <h2>Uploading a Profile Picture</h2>
                    </div>
                    <div>
                      <pv-fileUpload v-if="loadingPhoto===false" name="demo[]" customUpload @uploader="customBase64Uploader" :multiple="false" accept="image/*" :maxFileSize="10000000">
                        <template #empty>
                          <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <i class="pi pi-cloud-upload" style="font-size: 5rem; border: 2px solid white; border-radius: 50%; padding: 25px;"></i>
                            <p class="mt-4 mb-0">Drag and drop files here to upload.</p>
                          </div>
                        </template>
                      </pv-fileUpload>
                      <div v-if="loadingPhoto===true" style="display: flex;justify-content: center;margin: 3rem">
                        <i  class="pi pi-spin pi-spinner" style="font-size: 8rem"></i>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                      <h2>This is your profile picture</h2>
                    </div>
                    <div style="width: 100%; display:flex;justify-content: center">
                      <img :src="this.profilePictureURL" alt="Image" height="250" style="border-radius: 1rem" />
                    </div>
                    <h2 style="margin: 2rem">¿Do you want to continue?</h2>
                    <div class="buttons" >
                      <pv-button :disabled="!esFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkred;border-color: darkred" severity="danger" @click="deleteImage()">Reload</pv-button >
                      <pv-button v-if="parseInt(this.userPlanSelected)!==2" :disabled="!esFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="register()">Register</pv-button >
                      <pv-button v-if="parseInt(this.userPlanSelected)===2" :disabled="!esFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="uploadPhotoNext()">Continue</pv-button >
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </template>
        </pv-card>
      </div>
    </div>
    <div v-if="currentPath==='Payment'">
      <div class="card" style="height: 98vh ">
        <pv-card style=" border-radius: 1rem;justify-content: center;">
          <template #content>
            <div class="content" style="width: 50vw">
              <div class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
                <h1>Payment method</h1>
              </div>
              <div style=" display: flex; justify-content: center;align-content: center">
                <p>To complete the registration, complete the payment of your subscription using stripe</p>
              </div>
              <div class="footer">
                <div class="buttons" >
                  <div>
                    <stripe-checkout
                        ref="checkoutRef"
                        mode="payment"
                        :pk="publishableKey"
                        :line-items="lineItems"
                        :success-url="successURL"
                        :cancel-url="cancelURL"
                        @loading="v => loading = v"
                    />
                  </div>
                  <div style="display: flex;justify-content: space-around;width: 100%">
                    <pv-button style="border-radius: 1rem;color: white;background-color: darkred;border-color: darkred" severity="danger"  @click="cancelRegister()">Cancel</pv-button>
                    <pv-button style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen"  @click="registerAndPayment()">Pay subscription</pv-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>

</template>
<script>
import {UserServices} from "@/farmtrack/services/user-api.service";
import {PlansServices} from "@/farmtrack/services/plans-api.service";
import { ref, getDownloadURL, uploadBytes,deleteObject } from 'firebase/storage'
import { storage } from '../../firebaseConfig'
import { StripeCheckout } from '@vue-stripe/vue-stripe';
import {SubscriptionApiService} from "@/farmtrack/services/subscription-api.service";
export default {
  name: "sign-up-plans",
  components: {
    StripeCheckout,
  },
  data(){
    return{
      publishableKey:'pk_test_51OAzYZHe6cIQ9MTkeu2FPZCcR1olGo1LeCLLkUNdmVvEXBGmIv2Tw3jFWWhqzCDZ6agSJYrMsQhBwCOdEeeMs3zf007fpn6u8x',
      successURL:'http://localhost:5173/',
      cancelURL:'http://localhost:5173/',
      loading: false,
      lineItems: [
        {
          price: 'price_1OB0vHHe6cIQ9MTkbD9RYUzw',
          quantity: 1,
        },
      ],
      loadingPhoto:false,
      profilePictureUploaded:false,
      profilePictureFile: null,
      profilePictureURL: null,
      value1: 'Nuestros Planes',
      options: ['Nuestros Planes', 'Plan personalizado'],
      defaultPlan: true,
      customPlan: false,
      customPlanQuantity:1,
      plans:[],
      currentPath:"",
      user:{
        name:null,
        email:null,
        password:null,
        description: null,
        contactEmail:null,
        areasOfFocus:null,
        expertise:null,
      },
      esFormularioCompleto: false,
      esSpecialistFormularioCompleto:false,
      isUserTypeSelected:false,
      selectedUserType: null,
      userPlanSelected:"none",
    }
  },
  created(){   this.currentPath="Types"
    new PlansServices().getPlans().then(res=>{
      this.plans=res.data
    })
  },
  methods:{
    async customBase64Uploader(event){
      this.loadingPhoto=true
      this.profilePictureFile = event.files[0];
      if (this.profilePictureFile) {
        this.profilePictureFile.name
        const storageRef = ref(storage, 'profile_pictures/' + this.user.email);
        console.log(this.profilePictureFile.name)
        await uploadBytes(storageRef, this.profilePictureFile);
        this.profilePictureURL = await getDownloadURL(storageRef);
        this.profilePictureUploaded=true
        this.loadingPhoto=false
      }
      console.log('URL:', this.profilePictureURL)
    },
    async deleteImage() {
      this.profilePictureUploaded=false
      this.profilePictureFile=null
      this.profilePictureURL=null
    },
    uploadPhotoNext(){
      this.currentPath="Payment"
    },
    cancelRegister(){
      location.reload();
    },
    registerAndPayment(){
      let newUser={}
      newUser.name=this.user.name
      newUser.email=this.user.email
      newUser.password=this.user.password
      newUser.description=this.user.description
      newUser.imageUrl=this.profilePictureURL
      newUser.location="Lima, Peru"
      newUser.type=this.selectedUserType.toUpperCase()
      newUser.plan=parseInt(this.userPlanSelected)
      new UserServices().registerFarmer(newUser).then(response=>{
        new UserServices().getUserByEmail("",newUser.email).then(res=>{
          let subscription={}
          subscription.accountId=parseInt(res.data.accountId.toString())
          subscription.validDate=this.getActiveDateFormated().toString()
          subscription.active=false
          console.log(subscription)
          new SubscriptionApiService().createSubscription(subscription).then(r=>{
            localStorage.setItem("tempUserAccount",res.data.accountId)
            this.$refs.checkoutRef.redirectToCheckout();
          })
        })

      }).catch(error=>{
        this.$toast.add({severity:'error', summary: 'Error', detail:'Server error', life: 3000});
      })
    },
    getActiveDateFormated() {
      // Obtener la fecha actual
      let fechaActual = new Date();

      // Sumar un mes a la fecha
      fechaActual.setMonth(fechaActual.getMonth() + 1);

      // Obtener los componentes de la nueva fecha (día, mes, año)
      let dia = fechaActual.getDate().toString().padStart(2, '0');
      let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
      let anio = fechaActual.getFullYear();

      // Formatear la fecha en el formato dd/mm/aaaa
      return `${dia}/${mes}/${anio}`;
    },
    register(){
      let newUser={}
      newUser.name=this.user.name
      newUser.email=this.user.email
      newUser.password=this.user.password
      newUser.description=this.user.description
      newUser.imageUrl=this.profilePictureURL
      newUser.location="Lima, Peru"
      newUser.type=this.selectedUserType.toUpperCase()
      newUser.plan=parseInt(this.userPlanSelected)
      if(this.selectedUserType==="specialist"){
        newUser.contactEmail=this.user.contactEmail
        newUser.areasOfFocus=this.user.areasOfFocus
        newUser.expertise=this.user.expertise
      }
      if(this.selectedUserType==="farmer"){
        new UserServices().registerFarmer(newUser).then(response=>{
          this.$router.push("/sign-in")
          //this.$refs.checkoutRef.redirectToCheckout();
        }).catch(error=>{
          this.$toast.add({severity:'error', summary: 'Error', detail:'Server error', life: 3000});
        })
      }else {
        new UserServices().registerSpecialist(newUser).then(response=>{
          this.$router.push("/sign-in")
        }).catch(error=>{
          this.$toast.add({severity:'error', summary: 'Error', detail:'Server error', life: 3000});
        })
      }

    },
    nextPath(){
      if(this.selectedUserType==="farmer"){
        this.currentPath='Plans'
      }else {
        this.currentPath="Form"
      }
    },
    selectUserType(userType) {
      this.selectedUserType = userType;
      if(this.selectedUserType!==null){
        this.isUserTypeSelected=true
      }
    },
    goBack(path){
      if(path==="sign-in"){
        this.$router.push("/sign-in")
      }
      if(this.selectedUserType==="specialist"&&path==="Plans"){
        this.currentPath="Types"
      }else {
        this.currentPath=path
      }
    },
    actualizarEstadoBotonSpecialistForm(){
      this.esSpecialistFormularioCompleto = (this.user.areasOfFocus.length>0 && this.user.contactEmail.length >0 && this.user.expertise.length >0);
    },
    actualizarEstadoBoton() {
      this.esFormularioCompleto = (this.user.name.length>0 && this.user.email.length >0 && this.user.password.length >0 && this.user.description.length >0);
    },
    addTemporaryUser(){
      new UserServices().getUserByEmail("",this.user.email).then(res=>{
        this.$toast.add({severity:'error', summary: 'Email registered', detail:'Email already registered', life: 3000});
      }).catch(error=>{
        if(this.currentPath==="SpecialistForm"){
          this.currentPath="ProfilePicture"
        }
        else {
          if(this.selectedUserType==="specialist"){
            this.currentPath="SpecialistForm"
          }else {
            this.currentPath="ProfilePicture"
          }
        }
      })


    },
    validarNombre(evento) {
      const codigo = evento.keyCode || evento.which;
      const caracter = String.fromCharCode(codigo);
      const patron = /^[a-zA-Z\s]*$/; // Patrón para permitir solo letras y espacios

      if (caracter.match(patron)) {
        return true;
      } else {
        evento.preventDefault();
        return false;
      }
    },
    planSelected(plan){
      this.addTemporaryPlan(plan)
      this.currentPath="Form"
    },
    addTemporaryPlan(plan){
      this.userPlanSelected=plan
      console.log(this.userPlanSelected)

    }
  }
}
</script>
<style scoped>
.type-card.selected {
  border: 2px solid white;
}
.type-card{
  cursor: pointer;
  border-color: white;
  border-radius: 1rem;
  background-color: #111111;
  color: black;
  margin-top: 0;
  width: 15em;
}
.form label{
  display: block;
}
.form-Text{
  text-align: center;
}
.card{
  display: flex;
  justify-content: center;
  align-items: center;
}
.form{
  margin: 0;
}
.form .form-input{
  margin: 0.3rem 0;
}
.buttons{
  display: flex;
  margin: 1.3rem 0;
  justify-content: space-around;
}
.footer{
  margin-top: 0.5rem;
}
.form-input{
  width: 100%;
}
.solidColor{
  height: 2.5rem;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
}
.plan-card{
  border-radius: 1rem;
  background-color: #efefef;
  color: black;
  margin-top: 0;
  width: 18em;
}
p {
  line-height: 1.5;
  margin-bottom: 0.5rem
}
.content h2{
  margin-bottom: 0.5rem;
}
.price{

  display: flex;
}
.price h1{
  font-weight: bold;font-size: 50px
}
.price h3{
  margin-top: 0.5rem;
  color: #888888;
  font-weight: bold;font-size: 30px
}
.margin-feature{
  margin: 1rem 0 1rem 1rem
}
.feature-container{
  display: flex; height: 30px; justify-content: left; align-items: center;
}
.feature-container i{
  font-size: 1rem; margin-right: 5px; color: darkgreen
}
.feature-container p{
  font-size: 1rem; margin: 0;
}
.plan-cards{
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-evenly;
}
.planButton{
  border-radius: 1rem;
  margin-top: .5em;
}
@media (max-width:1280px){
  .type-card{
    cursor: pointer;
    border-color: white;
    border-radius: 1rem;
    background-color: #111111;
    color: black;
    width: 13em;
  }
  .plan-cards{
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-evenly;
  }
  .plan-card{
    border-radius: 1rem;
    background-color: white;
    color: black;
    margin-top: 0;
    width: 14em;
    height: 19em;
  }
  .price h1{
    font-weight: bold;font-size: 25px
  }
  .price h3{
    margin-top: 0.2rem;
    color: #888888;
    font-weight: bold;font-size: 15px
  }
  .margin-feature{
    margin: 0.5rem 0 0.5rem 0.5rem
  }
  .feature-container{
    display: flex; height: 20px; justify-content: left; align-items: center;
  }
  .feature-container i{
    font-size: 0.7rem; margin-right: 5px; color: darkgreen
  }
  .feature-container p{
    font-size: 0.7rem; margin: 0;
  }

  .content h2{
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  .content p{
    margin-top: 0;
  }
  .planButton{
    border-radius: 1rem;
    margin-top: 0;
  }
}
@media (max-width:1054px){
  .type-card{
    cursor: pointer;
    border-color: white;
    border-radius: 1rem;
    background-color: #111111;
    color: black;
    width: 13em;
  }
  .plan-cards{
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-evenly;
  }
  .plan-card{
    border-radius: 1rem;
    background-color: white;
    color: black;
    margin-top: 0;
    width: 10em;
    height: 14em;
  }
  .price h1{
    font-weight: bold;font-size: 25px
  }
  .price h3{
    visibility: hidden;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #888888;
    font-weight: bold;font-size: 1px
  }
  .content h2{
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  .content p{
    margin-top: 0;
  }
  .planButton{
    border-radius: 1rem;
    margin-top: 0;
  }
  .visible{
    visibility: hidden;
    height: 0;
    width: 0;
    margin: 0;
  }
}
@media (max-width:800px){
  .type-card{
    cursor: pointer;
    border-color: white;
    border-radius: 1rem;
    background-color: #111111;
    margin-bottom: 1rem;
    color: black;
    width: 10em;
  }
  .default{
    display: flex;
    justify-content: center;
  }
  .plan-cards{
    margin-bottom: 3rem;
    display: block;
    justify-content: center;
  }
  .plan-card{
    border-radius: 1rem;
    background-color: white;
    color: black;
    margin-bottom: 1.5rem;
    width: 10em;
    height: 14em;
  }
  .content h2{
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  .content p{
    margin-top: 0;
  }
  .planButton{
    border-radius: 1rem;
    margin-top: 0;
  }
}
@media (max-width:750px){
  .type-card{
    cursor: pointer;
    border-color: white;
    border-radius: 1rem;
    background-color: #111111;
    color: black;
    margin-bottom: 1rem;
    width: 10em;
  }
  .default{
    display: flex;
    justify-content: center;
  }
  .plan-cards{
    margin-bottom: 3rem;
    display: block;
    justify-content: center;
  }
  .switch{
    margin-left: 15vw;
  }
}
</style>