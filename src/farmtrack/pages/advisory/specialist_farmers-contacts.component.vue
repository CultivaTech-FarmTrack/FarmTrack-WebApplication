<template>
  <div class="background">
    <div class="container">
      <div class="header" style="display: flex;justify-content: left;">
        <h1>Good morning {{ username }}!</h1>
        <div style="width: 40%; display: flex;justify-content: center;margin:  2rem 0 2rem 0">
          <i class="pi pi-search" style="margin-top: 0.5rem; margin-right: 1rem"></i>
          <div class="card p-fluid" style="width: 80%">
            <pv-autoComplete v-model="searchContactValue"
                             :suggestions="searchContactItems"
                             @complete="contactSearch"
                             @itemSelect="contactSearchSelected"
                             placeholder="Search a contact"
                             class="searchBar"
            />
          </div>
        </div>
      </div>
      <div class="inventory" style="margin-bottom: 20px;">
        <h2 v-if="currentContactResultsFarmers.length>=1" style="margin: 2rem 0 2rem 0">Contacts:</h2>
        <h2 v-else="currentContactResultsFarmers.length>=1" style="margin: 2rem 0 2rem 0">You have no contacts</h2>
        <p v-if="currentContactResultsFarmers.length !== displayableContacts.length" @click="resetContacts()" style="text-decoration: underline; cursor: pointer;margin-top: 1.5rem">Reset search</p>
        <div class="cards">
          <div v-if="currentContactResultsFarmers.length>=1" v-for="contact in currentContactResultsFarmers" :key="contact.id">
            <pv-card style="width: 17em; border-radius: 15px;">
              <template #header>
                <img
                    alt="user header"
                    :src="contact.imageUrl"
                    style="margin: 1em; width: 15em; height: 150px; border-radius: 15px;"
                />
              </template>
              <template #title>{{ contact.name }}</template>
              <template #footer>
                <div style="display: flex; justify-content: center">
                  <pv-button label="Detail" severity="warning" @click="showFarmerDetails(contact)" />
                </div>
              </template>
            </pv-card>
          </div>
        </div>
      </div>
      <pv-dialog v-model:visible="contactDetailsVisible" maximizable modal header="Specialist Detail" :style="{ width: '70vw' }">
        <div class="addplantbackground">
          <div class="agriculture-specialist-details">
            <div class="title" style="display: flex; justify-content: center">
              <h1 class="title-text">Agriculture Specialist Details</h1>
            </div>
            <div style="display: flex; justify-content: space-around">
              <div style="margin-top: 2rem">
                <div class="detail">
                  <p class="detail-text">Name: {{ currentContact.name }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Location: {{ currentContact.location }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Contact Email: {{ currentContact.email }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Description: {{ currentContact.description }}</p>
                </div>
              </div>
              <div>
                <div class="image-container">
                  <img
                      :src="currentContact.imageUrl"
                      alt="Specialist Image"
                      style="border-radius: 1rem;width: 300px"
                  />
                </div>
              </div>
            </div>
            <div style="display: flex;justify-content: space-evenly;  margin-top: 1.5rem;">
              <pv-button :disabled="deleteContactDisableButton" class="red-button" @click="deleteFarmer()">Delete contact</pv-button>
              <pv-button class="green-button" @click="contactFarmer()">Open Chat</pv-button>
            </div>
          </div>

        </div>
      </pv-dialog>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {ContactServices} from "../../services/contacts-api.service"
import {UserServices} from "../../services/user-api.service"
import {ProjectApiService} from "@/farmtrack/services/project-api.service";

export default {
  name: "Specialist_farmers",
  data() {
    return {
      username:sessionStorage.getItem("name"),
      token: sessionStorage.getItem("jwt"),
      searchContactValue: ref(""),
      searchContactItems: ref([]),
      showDropdown: false,
      displayableContacts:[],
      contactDetailsVisible: false,
      currentContact:{},
      showDetailsForSearch:false,
      currentSpecialistInSearch:{},
      currentContactResultsFarmers:[],
      deleteContactDisableButton:false,
    };
  },
  created() {
    new ContactServices().getContactsForSpecialist(sessionStorage.getItem("id")).then(response=>{
      this.getDisplayableContacts(response.data)
    })
  },
  methods: {
    deleteFarmer(){
      // add delete specialist service
      new ContactServices().deleteContactById(this.currentContact.contactId).then(res=>{
        this.displayableContacts = this.currentContactResultsFarmers.filter(specialist => specialist.id !== this.currentContact.id);
        this.currentContactResultsFarmers=this.displayableContacts
        this.contactDetailsVisible=false
      })

    },
    resetContacts(){
      this.currentContactResultsFarmers=this.displayableContacts
      this.searchContactValue=""
    },
    contactSearchSelected(){
      for (let i = 0; i < this.currentContactResultsFarmers.length; i++) {
        if(this.currentContactResultsFarmers[i].name===this.searchContactValue){
          let temp=this.currentContactResultsFarmers[i]
          this.currentContactResultsFarmers=[]
          this.currentContactResultsFarmers.push(temp)
        }
      }
    },
    contactSearch(event) {
      // Filtra los objetos cuyo atributo "name" coincide con searchInventorValue
      const matchingContacts = this.displayableContacts.filter(contact =>
          contact.name.toLowerCase().includes(this.searchContactValue.toString().toLowerCase())
      );
      if(matchingContacts.length===0){
        this.currentContactResultsFarmers=[]
      }else {
        this.searchContactItems = matchingContacts.map(contact => contact.name);
        this.currentContactResultsFarmers=matchingContacts
      }
    },
    getDisplayableContacts(rawContacts){
      for (let i = 0; i < rawContacts.length; i++) {
        new UserServices().getUserById(rawContacts[i].farmerId).then(response=>{
          let temp=response.data
          temp.contactId=rawContacts[i].id
          this.displayableContacts.push(temp)
        })
        this.currentContactResultsFarmers=this.displayableContacts
      }
    },
    showFarmerDetails(contact) {
      this.currentContact= contact;
      new ProjectApiService().getProjectByFarmerId(this.currentContact.accountId).then(res=>{
        let project=res.data
        console.log(project)
        if(project.length>0){
          this.deleteContactDisableButton=true
        }else {
          this.deleteContactDisableButton=false
        }
      })
      this.contactDetailsVisible=!this.contactDetailsVisible

    },
    contactFarmer() {
      this.$router.push("/specialist/chat/" + this.currentContact.contactId)
    }
  },
};
</script>

<style scoped>
.background {
  background-color: #242424;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
}

.container {
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.searchBar {
  width: 100%;
}

.inventory {
  margin-bottom: 200px;
  flex-wrap: wrap;
  gap: 90px;
  justify-content: space-between;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17em, 1fr)); /* 3 columnas y tamaño mínimo de 17em */
  gap: 2rem; /* Espacio entre las cartas */
  justify-items: center; /* Centra las cartas horizontalmente */
  margin-top: 2rem;
}

.pi {
  color: white;
}

.green-button {
  margin-top: 1.5rem;
  color: white;
}
.red-button {
  margin-top: 1.5rem;
  color: white;
}

.agriculture-specialist-details {
  text-align: left;
  padding: 20px;
}

.title-text {
  font-size: 24px;
  margin-bottom: 10px;
  color: #fff;
}

.detail-text {
  font-size: 18px;
  color: #fff;
  margin: 10px 0;
}

.image-container {
  margin-top: 20px;
}

.green-button {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}
.red-button {
  background-color: #ee7979;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}
.red-button:hover {
  background-color: darkred;
}

.green-button:hover {
  background-color: darkgreen;
}
</style>
