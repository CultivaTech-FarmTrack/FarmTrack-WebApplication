<template>
  <div class="background">
    <div class="chat-space" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      <div class="info-card">
        <i class="pi pi-angle-left" style="margin-right: 1rem; cursor: pointer;" @click="goback"></i>
        <div class="profile-image">
          <img :src="displayableContactInfo.imageUrl" alt="Foto de perfil">
        </div>
        <div class="chat-info">
          <div class="chat-header">
            <h3 style="margin-bottom: 0.5rem; margin-left: 1rem">{{ displayableContactInfo.name }}</h3>
          </div>
        </div>
      </div>
      <div class="message-content" >
        <div v-for="rawMessage in rawMessages"  >
          <div v-if="rawMessage.authorId === userId" class="bubble-right">
            <p class="bubble">{{ rawMessage.message }}</p>
          </div>
          <div v-else class="bubble-left">
            <p class="bubble">{{ rawMessage.message }}</p>
          </div>
        </div>
      </div>
      <div class="message-box" style="display: flex; justify-content: space-between; align-items: center;">
        <pv-input @input="checkSendButtonDisable" v-model="message" type="text" placeholder="Escribe tu mensaje aquí" style="width: 95%;"/>
        <pv-button :disabled="isSendButtonDisable" @click="sendMessage" style="width: 5%; display: flex; justify-content: center; align-items: center;">
          <i class="pi pi-send"></i>
        </pv-button>

      </div>
    </div>
  </div>
</template>

<script>
import {UserServices} from "../../services/user-api.service"
import {ChatServices} from "@/farmtrack/services/chat-api.service";
import {ContactServices} from "@/farmtrack/services/contacts-api.service";
import {useRoute} from "vue-router";

export default {
  name: "specialist_chatMessages",
  props: ['id'], // Declara que esperas recibir el parámetro 'id' como prop
  data() {
    return {
      route: null,
      token: sessionStorage.getItem("jwt"),
      displayableContactInfo:{},
      rawMessages:[],
      userId:parseInt(sessionStorage.getItem("id").toString()),
      message:"",
      isSendButtonDisable:true,
      chatStarted:false
    };
  },
  created() {
    this.route = useRoute(); // Obtener la ruta actual
    new ChatServices().getChatByContactId(this.id).then(response=>{
      this.rawMessages=response.data
    })
    new ContactServices().getContactById(this.id).then(response=>{
      this.chatStarted =response.data.isChatStarted
      new UserServices().getUserById(response.data.farmerId).then(response=>{
        this.displayableContactInfo=response.data
        this.scrollBottom()
      })
    })
    let intervalId=setInterval(() => {
      if (this.route) {
        const path = this.route.path;
        if(path===("/specialist/chats/"+this.id)){
          new ChatServices().getChatByContactId(this.id).then(response=>{
            this.rawMessages=response.data
          })
          console.log("ImplementarWebSocket para chat")
        }else {
          clearInterval(intervalId)
        }
      }

    }, 5000);
  },
  methods:{
    goback(){
      this.$router.push("/specialist/chats")
    },
    formatTimeWithAmPm(date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const amPm = hours < 12 ? "am" : "pm";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${amPm}`;
    },
    checkSendButtonDisable(){
      if(this.message!==""){
        this.isSendButtonDisable=false
      }else {
        this.isSendButtonDisable=true
      }
    },
    sendMessage(){
      let newMessage={}
      newMessage.contactId=this.id
      newMessage.authorId=parseInt(sessionStorage.getItem("id").toString())
      newMessage.message=this.message
      newMessage.order=this.rawMessages.length+1
      newMessage.hour=this.formatTimeWithAmPm(new Date())
      if(this.chatStarted===false){
        new ContactServices().startChatContact(this.id).then(res=>{

        })
      }
      new ChatServices().sendMessage(newMessage).then(res=>{
        this.rawMessages.push(newMessage)
        //Enviar el mensaje en el service
        this.message=""
        setTimeout(this.scrollBottom,100)
      })


    },
    scrollBottom(){
      let messageContainer = document.querySelector(".message-content"); // Cambia la clase aquí
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }
}
</script>

<style scoped>
.message-content{
  max-width: 81vw;
  flex-grow: 1;
  max-height: 76vh;
  overflow-y: scroll;
}
.background {
  background-color: #242424;
  color: white; /* Cambiar el color del texto si es necesario */
  margin: 15px 20px 15px 20px; /* Agregar el relleno deseado */
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
}

.bubble {
  background-color: #1c1c1c;
  color: #fff;
  max-width: 50%; /* Ajusta el ancho máximo según tus preferencias */
  padding: 15px;
  border-radius: 10px;
  margin: 10px;
  white-space: normal; /* Permite que el texto se ajuste y divida en líneas */
}




.bubble-right {
  display: flex;
  justify-content: flex-end;
}

.bubble-left {
  display: flex;
  justify-content: flex-start;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background-color: #1c1c1c; /* Color de fondo negro */
  color: white; /* Color de texto blanco */
  margin-bottom: 10px; /* Espaciado entre tarjetas */
}

.profile-image {
  width: 50px; /* Ancho de la imagen de perfil */
  height: 50px; /* Alto de la imagen de perfil */
  border-radius: 50%; /* Hace que la imagen sea redonda */
  overflow: hidden; /* Oculta cualquier parte de la imagen fuera del círculo */
  margin-right: 10px;
}

.profile-image img {
  width: 100%; /* Ajusta la imagen de perfil al círculo */
  height: 100%;
  object-fit: cover; /* Mantiene la relación de aspecto de la imagen */
}

.chat-info {
  flex-grow: 1;
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

p {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>