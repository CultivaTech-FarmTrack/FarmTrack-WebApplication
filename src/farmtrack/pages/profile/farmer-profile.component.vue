<template>
  <div class="background">
    <div class="content-container">
      <div class="text-container">
        <h1 style="width: 100%;margin: 1.2rem 0 1.2rem 0">{{ userName }}</h1>
        <div class="profession-location">
          <div style="display: flex;justify-content: space-between; width: 100%">
            <p>Type</p>
            <p>Location</p>
          </div>
        </div>
        <div class="profession-location">
          <div style="display: flex;justify-content: space-between; width: 100%">
            <h3>Farmer</h3>
            <h5 style="display: flex;align-content: center; align-items: center">Lima, Peru</h5>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 1.2rem 0 1.2rem 0">
          <h3 >Email: {{ userEmail }}</h3>
        </div>
        <h4>Description:</h4>
        <div style="display: flex; justify-content: space-between; margin: 1.2rem 0 1.2rem 0">
          <p>{{userDescription}}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 2rem 0 0rem 0">
          <h2>Plan</h2>
        </div>
        <div class="chat-card-first">
          <div class="plan-image">
            <i v-if="planId!==1" class="pi pi-bolt" style="font-size: 2.5rem"></i>
            <i v-if="planId===1" class="pi pi-lock" style="font-size: 2.5rem"></i>
          </div>
          <div class="chat-content" >
            <div class="chat-header">
              <h3 style="margin-bottom: 0.5rem">{{ plan.name }}</h3>
              <pv-button label="UPDATE" @click="showUpdatePlanDialog" />
            </div>
            <p v-if="planId!==1" style="width: 30%">S/. {{ plan.price }}</p>
          </div>
        </div>
      </div>
      <div class="profilePicture">
        <div style="display: inline;justify-content: center">
          <div class="profile-container" @click="openEditProfilePictureDialog">
            <img
                :src="imageUrl"
                style=""
                class="profile-image"
            />
            <div class="image-overlay">
              <p>Change profile picture</p>
            </div>
          </div>
          <div class="action-buttons">
            <div class="acb" style="">
              <pv-button icon="pi pi-pencil" label="Edit profile" @click="showEditProfileDialog()" text rounded aria-label="update" />
              <pv-button icon="pi pi-times" severity="danger" label="Delete profile" text rounded aria-label="Filter" @click="deleteProfileDialogVisible=true" />
              <pv-button icon="pi pi-sign-out" severity="secondary" label="Sign Out" text rounded aria-label="Filter" @click="logOut()"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pv-dialog v-model:visible="editProfileDialogVisible" maximizable modal header="Edit Profile" :style="{ width: '700px' }">
      <div class="addplantbackground">
        <div class="crop-details">
          <div style="margin: 1rem 1rem; display: flex;justify-content: center">
            <div style="width: 90%">
              <div style="margin: 2rem 0rem">
                                <span class="p-float-label">
                               <pv-input id="username" @input="actualizarEstadoBoton()" style="border-radius: 0.5rem;width: 100%" v-model="editUserName" maxlength="56" @keypress="validarNombre($event)"/>
                                <label for="username">Name</label>
                            </span>
              </div>
              <div style="margin: 2rem 0rem">
                                <span class="p-float-label">
                                                <pv-textArea id="description" class="form-input" @input="actualizarEstadoBoton()" placeholder="Description" style="border-radius: 0.5rem;width: 100%" maxlength="600" v-model="editUserDescription"></pv-textArea>
                                                <label for="description">Description</label>
                                            </span>
              </div>
              <div style="width: 100%;display: flex;justify-content: space-between">
                <pv-button style="border-radius: 1rem;color: white;" severity="secondary" @click="editProfileDialogVisible=false">Cancel</pv-button >
                <pv-button :disabled="!esFormularioCompleto" style="border-radius: 1rem;color: white;background-color: darkgreen;border-color: darkgreen" @click="updateProfile()">Update</pv-button >
              </div>

            </div>
          </div>
        </div>
      </div>
    </pv-dialog>
    <pv-dialog v-model:visible="updateProfileDialogVisible" maximizable modal header="Edit Profile Picture" :style="{ width: '700px' }">
      <div class="addplantbackground">
        <div class="profile">
          <div>
            <div v-if="loading===false" class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
              <h1>Upload a Profile Picture</h1>
            </div>
            <div v-if="loading===true" class="phrase" style="margin-bottom: 1rem; display: flex; justify-content: center">
              <h2>Uploading a Profile Picture</h2>
            </div>
            <div>
              <pv-fileUpload v-if="loading===false" name="demo[]" customUpload @uploader="customBase64Uploader" :multiple="false" accept="image/*" :maxFileSize="10000000">
                <template #empty>
                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <i class="pi pi-cloud-upload" style="font-size: 5rem; border: 2px solid white; border-radius: 50%; padding: 25px;"></i>
                    <p class="mt-4 mb-0">Drag and drop files here to upload.</p>
                  </div>
                </template>
              </pv-fileUpload>
              <div v-if="loading===true" style="display: flex;justify-content: center;margin: 3rem">
                <i  class="pi pi-spin pi-spinner" style="font-size: 8rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </pv-dialog>
    <pv-dialog v-model:visible="updatePlanDialogVisible" maximizable modal header="Change Plan" :style="{ width: '700px' }">
      <div class="addplantbackground">
        <div class="content" >
          <div class="phrase" style="margin-bottom: 3rem; display: flex; justify-content: center; text-align: center">
            <h1>Select a new plan</h1>
          </div>
          <div class="plans">
            <div class="default">
              <div class="plan-cards">
                <div v-for="plan in plans">
                  <pv-card class="plan-card">
                    <template #content>
                      <div class="content">
                        <div style="display: flex;justify-content: space-between;height: 100%;align-items: center;justify-items: center;">
                          <div>
                            <h2>{{plan.name}}</h2>
                            <div class="visible">
                              <template v-if="plan.name==='Premium'">
                                <div class="usherVisible">
                                  <p style="margin-top: 15px">{{ plan.description }}</p>
                                </div>
                              </template>
                              <template v-if="plan.name==='Free'">
                                <div class="usherVisible">
                                  <p style="margin-top: 15px">{{ plan.description }}</p>
                                </div>
                              </template>
                            </div>
                            <div class="price" v-if="plan.name!=='Free'" STYLE="display: flex; justify-content: left;margin: 0.5rem 0">
                              <p style="font-weight: bold; margin-top: 8px;" v-if="plan.name!=='Free'">{{ plan.price }} S/ mo*</p>
                            </div>
                            <div v-if="plan.name==='Free'" style="margin-bottom: 1rem">
                            </div>
                          </div>
                          <div>

                            <pv-button class="planButton" :disabled="this.planId===1" v-if="plan.name==='Free'" style="background-color: darkgreen; border-color:darkgreen ;color:white" @click="planSelected(1)">Select</pv-button>
                            <pv-button class="planButton" :disabled="this.planId===2" v-if="plan.name==='Premium'" style="background-color: darkgreen;border-color: darkgreen; color:white" @click="planSelected(2)">Select</pv-button>
                          </div>
                        </div>
                      </div>
                    </template>
                  </pv-card >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </pv-dialog>
    <pv-dialog v-model:visible="deleteProfileDialogVisible"  modal header="Delete profile" :style="{ width: '30vw' }">
      <div class="addplantbackground">
        <h3 style="margin: 0rem 2rem 2rem 2rem">¿ Are you sure you want delete your profile ?</h3>
        <div style="display: flex;justify-content: space-around">
          <pv-button label="No" severity="danger" @click="deleteProfileDialogVisible=false"/>
          <pv-button label="Yes" severity="success" @click="deleteProfile()"/>
        </div>
      </div>
    </pv-dialog>

  </div>
</template>

<script >
import {PlansServices} from "@/farmtrack/services/plans-api.service";
import {UserServices} from "@/farmtrack/services/user-api.service";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "@/firebaseConfig";
import {StripeCheckout} from "@vue-stripe/vue-stripe";
import {SubscriptionApiService} from "@/farmtrack/services/subscription-api.service";

export default {
  components: {StripeCheckout},
  data(){
    return{
      id:parseInt(sessionStorage.getItem("id").toString()),
      plans:[],
      loading:false,
      profilePictureFile: null,
      profilePictureURL: null,
      esFormularioCompleto:false,
      deleteProfileDialogVisible:false,
      editProfileDialogVisible:false,
      updatePlanDialogVisible:false,
      updateProfileDialogVisible:false,
      userName:sessionStorage.getItem("name"),
      userDescription:sessionStorage.getItem("description"),
      userEmail:sessionStorage.getItem("email"),
      editUserName:"",
      editUserDescription:"",
      editUserEmail:"",
      imageUrl:sessionStorage.getItem("imageUrl"),
      planId:parseInt(sessionStorage.getItem("planId").toString()),
      plan: {},
      publishableKey:'pk_test_51OAzYZHe6cIQ9MTkeu2FPZCcR1olGo1LeCLLkUNdmVvEXBGmIv2Tw3jFWWhqzCDZ6agSJYrMsQhBwCOdEeeMs3zf007fpn6u8x',
      successURL:'https://agripure.netlify.app/successful-pay',
      cancelURL:'https://agripure.netlify.app/unsuccessful-pay',
      loadingP: false,
      lineItems: [
        {
          price: 'price_1OB0vHHe6cIQ9MTkbD9RYUzw',
          quantity: 1,
        },
      ],
    }
  },
  created() {
    new PlansServices().getPlans().then(res=>{
      this.plans=res.data
    })
    new PlansServices().getPlanById(this.planId).then(res=>{
      this.plan=res.data
    })
  },
  methods:{
    deleteProfile(){
      new UserServices().deleteProfile(this.id).then(res=>{
        this.logOut()
      })
    },
    planSelected(planId){
      let farmer={}
      farmer.accountId=parseInt(sessionStorage.getItem("id").toString())
      farmer.name=this.userName
      farmer.description=this.userDescription
      farmer.imageUrl=sessionStorage.getItem("imageUrl")
      farmer.location="Lima, Peru"
      farmer.planId=planId
      new UserServices().updateFarmer(farmer).then(resp=>{
        this.editProfileDialogVisible=false
        sessionStorage.setItem("planId",farmer.planId)
        this.planId=planId
        new PlansServices().getPlanById(this.planId).then(res=>{
          this.plan=res.data
          console.log(this.plan)
          console.log(this.planId)
          //areglar esta aparte
          if(this.planId===1){
            new SubscriptionApiService().updateSubscription(this.id,false).then(res=>{
              console.log(res.data)
            })
          }
          if(this.planId===2){
            new SubscriptionApiService().getSubscriptionById(this.id).then(r=>{
              new SubscriptionApiService().updateSubscription(this.id,true).then(res=>{
                console.log(res.data)
              })
            }).catch(error=>{
              let subscription={}
              subscription.accountId=parseInt(this.id)
              subscription.validDate=this.getActualDateFormated().toString()
              subscription.active=false
              new SubscriptionApiService().createSubscription().then(response=>{
                localStorage.setItem("tempUserAccount",this.id)
                this.$refs.checkoutRef.redirectToCheckout();
              })
            })
          }
        })
        this.updatePlanDialogVisible=false
      })
    },
    getActualDateFormated() {
      let fechaActual = new Date();
      let dia = fechaActual.getDate().toString().padStart(2, '0');
      let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
      let anio = fechaActual.getFullYear();
      return `${dia}/${mes}/${anio}`;
    },
    showUpdatePlanDialog(){
      this.updatePlanDialogVisible=true
    },
    async customBase64Uploader(event){
      this.loading=true
      this.profilePictureFile = event.files[0];
      if (this.profilePictureFile) {
        const storageRef = ref(storage, 'profile_pictures/' + this.userEmail);
        console.log(this.profilePictureFile.name)
        await uploadBytes(storageRef, this.profilePictureFile);
        this.profilePictureURL = await getDownloadURL(storageRef);
        let farmer={}
        farmer.accountId=parseInt(sessionStorage.getItem("id").toString())
        farmer.name=this.userName
        farmer.description=this.userDescription
        farmer.imageUrl=this.profilePictureURL
        farmer.location="Lima, Peru"
        farmer.planId=parseInt(sessionStorage.getItem("planId").toString())
        new UserServices().updateFarmer(farmer).then(resp=>{
          this.editProfileDialogVisible=false
          sessionStorage.setItem("imageUrl",farmer.imageUrl)
          this.imageUrl=this.profilePictureURL
          this.updateProfileDialogVisible=false
          this.loading=false
        })
      }
      console.log('URL:', this.profilePictureURL)
    },
    openEditProfilePictureDialog(){
      this.updateProfileDialogVisible=true
    },
    updateProfile(){
      let farmer={}
      farmer.accountId=parseInt(sessionStorage.getItem("id").toString())
      farmer.name=this.editUserName
      farmer.description=this.editUserDescription
      farmer.imageUrl=sessionStorage.getItem("imageUrl")
      farmer.location="Lima, Peru"
      farmer.planId=parseInt(sessionStorage.getItem("planId").toString())
      new UserServices().updateFarmer(farmer).then(resp=>{
        this.editProfileDialogVisible=false
        sessionStorage.setItem("name",farmer.name)
        sessionStorage.setItem("imageUrl",farmer.imageUrl)
        sessionStorage.setItem("description",farmer.description)
        this.userName= farmer.name
        this.userDescription= farmer.description
      })

    },
    showEditProfileDialog(){
      this.editUserName=this.userName
      this.editUserDescription=this.userDescription
      this.esFormularioCompleto = (this.editUserName.length>0  && this.editUserDescription.length >0);
      this.editProfileDialogVisible=true
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
    actualizarEstadoBoton() {
      this.esFormularioCompleto = (this.editUserName.length>0  && this.editUserDescription.length >0);
    },
    logOut(){
      sessionStorage.removeItem("jwt")
      sessionStorage.removeItem("id")
      sessionStorage.removeItem("description")
      sessionStorage.removeItem("email")
      sessionStorage.removeItem("name")
      sessionStorage.removeItem("imageUrl")
      sessionStorage.removeItem("type")
      sessionStorage.removeItem("planId")

      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
.plan-card{
  border-radius: 1rem;
  background-color: #171717;
  color: white;
  margin-top: 1rem;
}
@media (max-width: 1200px) {
  .card-edit{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content h2{
    margin-bottom: 0.5rem;
  }
  .chat-card-first {
    display: flex;
    align-items: center;
    padding: 1.2rem;
    background-color: #1c1c1c; /* Color de fondo negro */
    color: white; /* Color de texto blanco */
    border-radius: 10px; /* Bordes redondos */
    cursor: pointer; /* Cambia el cursor al pasar por encima para indicar que es clickeable */
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
  .acb{
    display: block;
    width: 100%;
  }
  .action-buttons{
    display: inline;justify-content: space-around; margin-top: 1rem;
    width: 100px;
  }
  .background {
    display: flex;
    flex-direction: column;
    background-color: #242424;
    color: white;
    margin: 15px 20px 15px 20px;
    border-radius: 15px;
    width: 100%;
    padding: 4rem;
    align-content: center;
  }
  .text-container {
    width: 100%;
  }
  .content-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .profilePicture {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Alinea la parte superior de la imagen */
  }
  .profile-container {
    width: 30vw;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .profile-image {
    transition: filter 0.3s;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 40vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .profile-container img{
    width: 40vw; border-radius: 0.5rem;
  }

  .profile-container:hover .profile-image {
    filter: grayscale(100%) brightness(70%);
  }

  .profile-container:hover .image-overlay {
    opacity: 1;
  }
  .plan-image{
    margin-right: 1rem;
  }

  .chat-content {
    flex-grow: 1;
    width: 10px;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .chat-header span {
    font-size: 0.9rem;
    color: #888;
  }
}
@media (min-width: 1200px) {
  .content h2{
    margin-bottom: 0.5rem;
  }
  .chat-card-sec {
    visibility: hidden;
    display: flex;
    align-items: center;
    padding: 1.2rem;
    background-color: #1c1c1c; /* Color de fondo negro */
    color: white; /* Color de texto blanco */
    border-radius: 10px; /* Bordes redondos */
    cursor: pointer; /* Cambia el cursor al pasar por encima para indicar que es clickeable */
    margin-top: 1rem;
    margin-bottom: 3rem;
  }
  .acb{
    display: block
  }
  .action-buttons{
    display: flex;justify-content: space-around; margin-top: 1rem;
  }
  .profilePicture{
    display: flex;
    justify-content: center;
  }
  .content-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .text-container {
    flex: 1;
    margin-right: 2rem;
  }
  .profile-container {
    width: 400px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .profile-container img{
    width: 30vw; border-radius: 0.5rem;
  }

  .profile-image {
    transition: filter 0.3s;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 30vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .profile-container:hover .profile-image {
    filter: grayscale(100%) brightness(70%);
  }

  .profile-container:hover .image-overlay {
    opacity: 1;
  }
  .plan-image{
    margin-right: 1rem;
  }
  .chat-card-first {
    display: flex;
    align-items: center;
    padding: 1.2rem;
    background-color: #1c1c1c; /* Color de fondo negro */
    color: white; /* Color de texto blanco */
    border-radius: 10px; /* Bordes redondos */
    cursor: pointer; /* Cambia el cursor al pasar por encima para indicar que es clickeable */
    margin-bottom: 10px; /* Espaciado entre tarjetas */
    margin-top: 1rem;
  }
  .chat-content {
    flex-grow: 1;
    width: 10px;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .chat-header span {
    font-size: 0.9rem;
    color: #888;
  }

  .background {
    display: flex;
    flex-direction: column;
    background-color: #242424;
    color: white;
    margin: 15px 20px 15px 20px;
    border-radius: 15px;
    width: 100%;
    padding: 4rem;
    align-content: center;
  }

  .profilePicture {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Alinea la parte superior de la imagen */
  }

  .text-container {
    width: 80%;
  }
  .profession-location {
    display: flex;
    align-items: center; /* Alinea los elementos verticalmente en el centro */
  }
}


</style>