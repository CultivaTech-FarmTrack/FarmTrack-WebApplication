<template>
  <div class="background">
    <div style="margin: 2rem 2rem 2rem 2rem" >
      <h1 style="margin: 4rem 0rem 2rem 0rem">Hello {{ userName }}!</h1>

      <div v-if="notifications.length>=1" v-for="notification in notifications"
           :key="notification.id">
        <div class="chat-card">
          <div class="profile-image" @click="redirectTo(notification.notificationType)">
            <img :src="notification.imageUrl" alt="Foto de perfil">
          </div>
          <div class="chat-content" >
            <div class="chat-header">
              <div @click="redirectTo(notification.notificationType)" style="width: 100%;">
                <h3 style="margin-bottom: 0.5rem">{{ notification.message }}</h3>
                <p>{{this.calculateTime(notification.date)}}</p>
              </div>
              <div style="width: 100%" @click="redirectTo(notification.notificationType)">
                ‎
              </div>
              <div>
                <pv-button icon="pi pi-times" severity="danger" @click="deleteNotification(notification)" text rounded aria-label="Cancel"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h3>You have no notifications at the moment</h3>
      </div>
    </div>
  </div>
</template>


<script>
import {FilterMatchMode} from "primevue/api";
import {NotificationApiService} from "@/farmtrack/services/notification-api.service";
import {useRoute} from "vue-router";

export default {
  name: "specialist_notifications",
  data(){
    return {
      route: null,

      userName: sessionStorage.getItem("name"),
      token: sessionStorage.getItem("jwt"),
      notifications:{},
    };
  },
  created(){
    this.route = useRoute(); // Obtener la ruta actual

    new NotificationApiService().getAllNotificationByUserId(sessionStorage.getItem("id")).then(response=>{
      if(response.data!==null){
        this.notifications=response.data
        const fecha = new Date(); // Obtiene la fecha y hora actual
        this.getFormatDay(fecha)
      }
      else {
        this.notifications=[]
      }

    })
    let intervalId=setInterval(() => {
      if (this.route) {
        const path = this.route.path;
        if(path==="/specialist/notifications"){
          new NotificationApiService().getAllNotificationByUserId(sessionStorage.getItem("id")).then(response=>{
            if(response.data!==null){
              this.notifications=response.data
              const fecha = new Date(); // Obtiene la fecha y hora actual
              this.getFormatDay(fecha)
            }
            else {
              this.notifications=[]
            }

          })
          console.log("ImplementarWebSocket")
        }else {
          clearInterval(intervalId)
        }
      }

    }, 5000);

  },
  methods:{
    redirectTo(notificationType){
      console.log(notificationType)
      switch (notificationType) {
        case 'request':
          console.log("request");
          this.$router.push("/specialist/farmers")
          return 0
      }
    },
    getFormatDay(fecha){
      // Formatea la fecha y la hora en una cadena legible
      const fechaFormateada = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
      //console.log(fechaFormateada);
      const [fechaParte, horaParte] = fechaFormateada.split(' ');
      // Divide la fecha en día, mes y año
      const [dia, mes, año] = fechaParte.split('/');
      // Divide la hora en horas, minutos y segundos
      const [hora, minutos, segundos] = horaParte.split(':');
      // Asegúrate de que JavaScript interprete el mes como 0-indexed (enero=0, febrero=1, etc.)
      const fechaConvertida = new Date(Number(año), Number(mes) - 1, Number(dia), Number(hora), Number(minutos), Number(segundos));
      //console.log(fechaConvertida);
    },
    calculateTime(dateTimeString) {
      // Convierte la cadena en un objeto Date
      const [fechaParte, horaParte] = dateTimeString.split(' ');
      // Divide la fecha en día, mes y año
      const [dia, mes, año] = fechaParte.split('/');
      // Divide la hora en horas, minutos y segundos
      const [hora, minutos, segundos] = horaParte.split(':');
      // Asegúrate de que JavaScript interprete el mes como 0-indexed (enero=0, febrero=1, etc.)
      const fechaHora = new Date(Number(año), Number(mes) - 1, Number(dia), Number(hora), Number(minutos), Number(segundos));

      // Calcula la diferencia en milisegundos entre la fecha/hora proporcionada y la fecha/hora actual
      const diferenciaEnMilisegundos = new Date() - fechaHora;

      // Convierte la diferencia a segundos
      const segundosTranscurridos = Math.floor(diferenciaEnMilisegundos / 1000);

      if (segundosTranscurridos < 60) {
        return "Hace un momento";
      } else if (segundosTranscurridos < 3600) {
        const minutos = Math.floor(segundosTranscurridos / 60);
        return `Hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
      } else if (segundosTranscurridos < 86400) {
        const horas = Math.floor(segundosTranscurridos / 3600);
        return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
      } else {
        const dias = Math.floor(segundosTranscurridos / 86400);
        return `Hace ${dias} ${dias === 1 ? "día" : "días"}`;
      }
    },
    deleteNotification(notification) {
      //delete notifications with notification service
      new NotificationApiService().deleteNotification(notification.id).then(res=>{
        const index = this.notifications.findIndex(item => item.id === notification.id);
        if (index !== -1) {
          this.notifications.splice(index, 1); // Elimina la notificación del arreglo
        }
      })

    }
  }
}
</script>


<style scoped>
.background {
  background-color: #242424;
  color: white; /* Cambiar el color del texto si es necesario */
  margin: 15px 20px 15px 20px; /* Agregar el relleno deseado */
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
  padding-bottom: 3rem;
}
.chat-card {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background-color: #1c1c1c; /* Color de fondo negro */
  color: white; /* Color de texto blanco */
  border-radius: 10px; /* Bordes redondos */
  cursor: pointer; /* Cambia el cursor al pasar por encima para indicar que es clickeable */
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

p {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>