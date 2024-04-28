<template>
  <div class="background" >
    <div class="container">

    </div>
    <div class="header" style="display: flex;justify-content: left;">
      <h1>Good morning {{ userName }}!</h1>
      <div style="width: 40%; display: flex;justify-content: center;margin:  2rem 0 2rem 0">
        <i class="pi pi-search" style="margin-top: 0.5rem; margin-right: 1rem"></i>
        <div class="card p-fluid" style="width: 80%">
          <pv-autoComplete v-model="searchInventorValue"
                           :suggestions="searchInventorItems"
                           @complete="inventorySearch"
                           @itemSelect="inventorySearchSelected"
                           placeholder="Search your plant"
                           class="searchBar"
          />
        </div>
      </div>
    </div>
    <div class="inventory">
      <div style="margin-left: 1rem">
        <h2>Your plants:</h2>
        <p v-if="currentInventoryResultsPlants.length !== displayableCrops.length" @click="resetInventory()" style="text-decoration: underline; cursor: pointer;margin-top: 1.5rem">Reset search</p>
      </div>
      <div class="cards" style="margin-top: 2rem">
        <div v-for="crop in currentInventoryResultsPlants" :key="crop.id">
          <pv-card style="width: 17em; border-radius: 15px;">
            <template #header>
              <img alt="user header" :src="crop.imageUrl" style="margin: 1em; width: 15em; height: 150px; border-radius: 15px;"/>
            </template>
            <template #title>{{ crop.name }}</template>
            <template #footer>
              <div style="display: flex; justify-content: center">
                <pv-button label="Detail" severity="warning" @click="showCropDetails(crop)" />
              </div>
            </template>
          </pv-card>
        </div>
        <pv-card style="width: 17em; border-radius: 15px;">
          <template #content>
            <pv-button text @click="addPlant" style="border-radius: 15px; width: 100%; height: 17rem; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <h3 style="margin: 0;">+ ADD PLANTS</h3>
            </pv-button>
          </template>
        </pv-card>
      </div>
      <pv-dialog v-model:visible="visible" maximizable modal header="Add a plant" :style="{ width: '800px' }">
        <div class="addplantbackground" >
          <div class="detail" v-if="showDetailsForSearch">
            <div class="crop-details">
              <div style="display: flex; justify-content: space-around;width: 100%">
                <div>
                  <div class="title">
                    <h1 class="title-text">{{ currentPlantInSearch.name }} Details</h1>
                  </div>
                  <div class="detail">
                    <p class="detail-text">Scientific name: {{ currentPlantInSearch.scientificName }}</p>
                  </div>
                  <div class="detail">
                    <p class="detail-text">Variety: {{ currentPlantInSearch.variety }}</p>
                  </div>
                  <div class="detail-row">
                    <p class="detail-text">Land type: {{ currentPlantInSearch.landType }}</p>
                  </div>
                  <div class="detail-row">
                    <p class="detail-text">Distance between plants: {{ currentPlantInSearch.distanceBetweenPlants }}</p>
                  </div>
                  <div class="detail-row">
                    <p class="detail-text">Weather conditions: {{ currentPlantInSearch.weatherConditions }}</p>
                  </div>
                </div>
                <div>
                  <div class="image-container">
                    <img :src="currentPlantInSearch.imageUrl" alt="crop Image" class="centered-image" style="width: 300px">
                  </div>
                </div>
              </div>
              <div style="margin-top: 2rem; display: flex; width: 100%;justify-content: space-around">
                <pv-button severity="secondary" style="margin-right: 3rem; color: white; font-weight: bold; text-align: center;" @click="showDetailsForSearch=!showDetailsForSearch">
                  <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; height: 100%;">cancel</div>
                </pv-button>
                <pv-button :disabled="isAddPlantDisable" style="width: 10rem; color: white; font-weight: bold;" @click="addPlantToCrop">
                  <div style="display: flex; justify-content: center; align-items: center; height: 100%;width: 100%">Add plant</div>
                </pv-button>
              </div>
            </div>
          </div>
          <div class="results" v-if="!showDetailsForSearch">
            <div style="margin: 0 3rem 0 3rem">
              <h1 style="margin-bottom: 2rem;">Search for a new plant</h1>
              <div class="card p-fluid" style="margin: 0 3rem 0rem 3rem">
                <pv-autoComplete v-model="searchNewPlantValue"
                                 :suggestions="searchNewPlantItems"
                                 @complete="newPlantSearch"
                                 @itemSelect="newPlantSearchSelected"
                                 placeholder="What are you looking for?"
                                 class="searchBar" />
              </div>
            </div>
            <div class="inventory">
              <h2 style="margin-left: 2rem">Results:</h2>
              <p v-if="currentResultsPlants !== defaultResultsPlants" @click="resetAddPlant()" style="text-decoration: underline; cursor: pointer;margin-top: 1.5rem;margin-left: 1.9rem">Reset search</p>
              <div class="cards" style="margin-top: 2rem">
                <div v-for="crop in currentResultsPlants" :key="crop.id">
                  <pv-card  style="width: 17em; border-radius: 15px;background-color: #171717">
                    <template #header>
                      <img
                          alt="user header"
                          :src="crop.imageUrl"
                          style="margin: 1em; width: 15em; height: 150px; border-radius: 15px;"
                      />
                    </template>
                    <template #title>{{ crop.name }}</template>
                    <template #footer>
                      <div style="display: flex; justify-content: center">
                        <pv-button label="Detail" severity="warning" @click="showDetailsForPlantInSearch(crop)" />
                      </div>
                    </template>
                  </pv-card>
                </div>

              </div>
            </div>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="cropDetailsVisible" maximizable modal header="Crop Detail" :style="{ width: '700px' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <div style="display: flex; justify-content: space-around;width: 100%">
              <div>
                <div class="title">
                  <h1 class="title-text">{{ currentCrop.name }} Details</h1>
                </div>
                <div class="detail">
                  <p class="detail-text">Scientific name: {{ currentCrop.scientificName }}</p>
                </div>
                <div class="detail">
                  <p class="detail-text">Variety: {{ currentCrop.variety }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Land type: {{ currentCrop.landType }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Distance between plants: {{ currentCrop.distanceBetweenPlants }}</p>
                </div>
                <div class="detail-row">
                  <p class="detail-text">Weather conditions: {{ currentCrop.weatherConditions }}</p>
                </div>
              </div>
              <div>
                <div class="image-container">
                  <img :src="currentCrop.imageUrl" alt="crop Image" class="centered-image" style="width: 300px">
                </div>
              </div>
            </div>
            <div style="margin: 1rem 1rem 1rem 1rem;width: 100%; display: flex; justify-content: space-around; align-items: center;">
              <p >Project specialist:</p>
              <pv-dropdown :disabled="allowAddSpecialist()" style="width: 60%" v-model="selectedContact" :options="currentContactForSpecialist"
                           optionLabel="name" placeholder="Select a specialist" />
              <pv-button v-if="isSpecialistForProjectAssigned!==true" :disabled="deleteCropButtonDisable" severity="secondary" style="color: white; font-weight: bold; text-align: center;" icon="pi pi-save" @click="setSpecialistToProject()"/>
              <pv-button v-else :disabled="deleteCropButtonDisable" severity="danger" style="color: white; font-weight: bold; text-align: center;" icon="pi pi-times" @click="removeSpecialistToProject()"/>

            </div>
            <div style="margin-top: 2rem; display: flex; width: 100%;justify-content: space-around">
              <pv-button :disabled="deleteCropButtonDisable" severity="danger" style="width: 10rem; color: white; font-weight: bold;" @click="deleteCrop">
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;width: 100%">Delete plant</div>
              </pv-button>
              <pv-button severity="secondary" style="color: white; font-weight: bold; text-align: center;" @click="cropDetailsVisible=!cropDetailsVisible">
                <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; height: 100%;">Close</div>
              </pv-button>
            </div>
          </div>
        </div>
      </pv-dialog>
    </div>
  </div>
</template>

<script>
import {CropServices} from "../../services/crop-api.service"
import {PlantServices} from "../../services/plant-api.service"
import { ref } from "vue";
import {ProjectApiService} from "@/farmtrack/services/project-api.service";
import {ContactServices} from "@/farmtrack/services/contacts-api.service";
import {UserServices} from "@/farmtrack/services/user-api.service";
export default {
  name: "crop_inventory",
  data(){
    return{
      token: sessionStorage.getItem("jwt"),
      userName: sessionStorage.getItem("name"),
      planId: parseInt(sessionStorage.getItem("planId").toString()),
      searchInventorValue: ref(""),
      searchInventorItems: ref([]),
      searchNewPlantValue: ref(""),
      searchNewPlantItems: ref([]),
      selectedContact: null,
      currentContactForSpecialist:[],
      newPlantsSearchOptions:[],
      showDropdown: false,
      displayableCrops:[],
      currentCrop:{},
      currentPlantInSearch:{},
      defaultResultsPlants:[],
      visible :false,
      isAddPlantDisable :true,
      cropDetailsVisible :false,
      showDetailsForSearch:false,
      currentResultsPlants:[],
      currentInventoryResultsPlants:[],
      deleteCropButtonDisable:false,
      isSpecialistForProjectAssigned:false

    }
  },
  created(){
    new CropServices().getCropsByFarmerId(this.token,sessionStorage.getItem("id")).then(response=>{
      console.log(response.data)
      this.getDisplayableCrops(response.data)
    })

  },
  methods:{
    allowAddSpecialist() {
      if(this.planId===1){
        return this.currentInventoryResultsPlants.some(crop => crop.specialistId !== 0);
      }
      else{
        return false
      }
    },
    getCurrentSpecialistForCrop(crop){
      if(crop.specialistId===0){
        this.selectedContact=null
        this.isSpecialistForProjectAssigned=false
      }
      else {
        new UserServices().getUserById(crop.specialistId).then(res=>{
          this.selectedContact=res.data
          this.isSpecialistForProjectAssigned=true
        })
      }
    },
    setSpecialistToProject(){
      new CropServices().setSpecialistToCrop(this.token,this.currentCrop.cropId,this.selectedContact.accountId).then(res=>{
        const cropIdToFind = this.currentCrop.cropId;

        const indexToModify = this.currentInventoryResultsPlants.findIndex(crop => crop.cropId === cropIdToFind);

        if (indexToModify !== -1) {
          this.currentInventoryResultsPlants[indexToModify].cropId =this.selectedContact.accountId;
        } else {
          console.log('Crop no encontrado en currentInventoryResultsPlants');
        }
        this.currentCrop.specialistId=this.selectedContact.accountId
        this.isSpecialistForProjectAssigned=true
        this.$toast.add({severity:'success', summary: 'Specialist Established', detail:'Added successfully', life: 3000});
      })
    },
    removeSpecialistToProject(){
      new CropServices().setSpecialistToCrop(this.token,this.currentCrop.cropId,0).then(res=>{
        const cropIdToFind = this.currentCrop.cropId;

        const indexToModify = this.currentInventoryResultsPlants.findIndex(crop => crop.cropId === cropIdToFind);

        if (indexToModify !== -1) {
          this.currentInventoryResultsPlants[indexToModify].cropId =this.selectedContact.accountId;
        } else {
          console.log('Crop no encontrado en currentInventoryResultsPlants');
        }
        this.selectedContact=null
        this.currentCrop.specialistId=0
        console.log(res.data)
        this.isSpecialistForProjectAssigned=false
        this.$toast.add({severity:'success', summary: 'Specialist removed', detail:'Removed successfully', life: 3000});
      })
    },
    getContacts(){
      this.currentContactForSpecialist=[]
      new ContactServices().getContactsForFarmer(this.token,sessionStorage.getItem("id")).then(response=>{
        let rawContact=response.data
        for (let i = 0; i < rawContact.length; i++) {
          new UserServices().getUserById(rawContact[i].specialistId).then(response=>{
            this.currentContactForSpecialist.push(response.data)
          })
        }
      })
    },
    resetInventory(){
      this.currentInventoryResultsPlants=this.displayableCrops
      this.searchInventorValue=""
    },
    resetAddPlant(){
      this.currentResultsPlants = this.defaultResultsPlants
      this.searchNewPlantValue=""
    },
    inventorySearchSelected(){
      for (let i = 0; i < this.currentInventoryResultsPlants.length; i++) {
        if(this.currentInventoryResultsPlants[i].name===this.searchInventorValue){
          let temp=this.currentInventoryResultsPlants[i]
          this.currentInventoryResultsPlants=[]
          this.currentInventoryResultsPlants.push(temp)
        }
      }
    },
    newPlantSearchSelected() {
      for (let i = 0; i < this.currentResultsPlants.length; i++) {
        if(this.currentResultsPlants[i].name===this.searchNewPlantValue){
          let temp=this.currentResultsPlants[i]
          this.currentResultsPlants=[]
          this.currentResultsPlants.push(temp)
        }
      }
    },
    inventorySearch(event) {
      const matchingCrops = this.displayableCrops.filter(crop =>
          crop.name.toLowerCase().includes(this.searchInventorValue.toString().toLowerCase())
      );
      if(matchingCrops.length===0){
        this.currentInventoryResultsPlants=[]
      }else {
        this.searchInventorItems = matchingCrops.map(crop => crop.name);
        this.currentInventoryResultsPlants=matchingCrops
      }
    },
    newPlantSearch(event){
      // Filtra los objetos cuyo atributo "name" coincide con searchInventorValue
      const matchingNewPlants = this.defaultResultsPlants.filter(plant =>
          plant.name.toLowerCase().includes(this.searchNewPlantValue.toString().toLowerCase())
      );
      if(matchingNewPlants.length===0){
        this.currentResultsPlants=[]
      }else {
        this.searchNewPlantItems = matchingNewPlants.map(plant => plant.name);
        this.currentResultsPlants=matchingNewPlants
      }
    },
    getDisplayableCrops(rawCrop){
      this.displayableCrops=[]
      for (let i = 0; i < rawCrop.length; i++) {

        let tempDisplayableCrop={}
        new PlantServices().getPlantInfoById(rawCrop[i].plantId).then(response=>{
          tempDisplayableCrop=response.data
          tempDisplayableCrop.cropId=rawCrop[i].id
          tempDisplayableCrop.specialistId=rawCrop[i].specialistId
          this.displayableCrops.push(tempDisplayableCrop)
        })
        this.currentInventoryResultsPlants=this.displayableCrops
      }
    },
    deleteCrop(){
      // delete plant in service
      new CropServices().deleteCropById(this.token,this.currentCrop.cropId).then(res=>{
        this.displayableCrops = this.currentInventoryResultsPlants.filter(crop => crop.id !== this.currentCrop.id);
        this.currentInventoryResultsPlants=this.displayableCrops
        this.cropDetailsVisible=!this.cropDetailsVisible
      })

    },
    getAllPlants(){
      new PlantServices().getAllPlants().then(response=>{
        this.defaultResultsPlants=response.data
        this.currentResultsPlants=this.defaultResultsPlants
      })
    },
    showCropDetails(crop) {
      this.getContacts()
      this.getCurrentSpecialistForCrop(crop)
      new ProjectApiService().getProjectByFarmerId(sessionStorage.getItem("id")).then(res=>{
        let projects=res.data
        for (let i = 0; i < projects.length; i++) {
          if(projects[i].cropId===crop.cropId){
            this.deleteCropButtonDisable=true
          }else{
            this.deleteCropButtonDisable=false
          }
        }
      })
      this.cropDetailsVisible=!this.cropDetailsVisible
      this.currentCrop= crop;
    },
    showDetailsForPlantInSearch(crop){
      this.currentPlantInSearch=crop;
      this.isPlantRepeated()
      this.showDetailsForSearch=!this.showDetailsForSearch
    },
    findIndexById(id) {
      //return this.rooms.findIndex((room) => room.id === id);
    },
    addPlant(){
      //this.$router.push("/farmer/createCrop")
      this.searchNewPlantValue=""
      this.visible=!this.visible
      this.showDetailsForSearch=false
      this.getAllPlants()
    },
    addPlantToCrop(){
      //add plant in service
      new CropServices().addCrop(this.token,parseInt(sessionStorage.getItem("id").toString()),parseInt(this.currentPlantInSearch.id)).then(response=>{
        new CropServices().getCropsByFarmerId(this.token,sessionStorage.getItem("id")).then(response=>{
          this.getDisplayableCrops(response.data)
        })
        this.visible=!this.visible
        this.showDetailsForSearch=false
      })

    },
    isPlantRepeated() {
      if(this.displayableCrops.some(plant => plant.name === this.currentPlantInSearch.name)){
        this.isAddPlantDisable=true
      }else {
        this.isAddPlantDisable=false
      }
    }

  }
}

</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17em, 1fr)); /* 3 columnas y tamaño mínimo de 17em */
  gap: 2rem; /* Espacio entre las cartas */
  justify-items: center; /* Centra las cartas horizontalmente */
  margin-top: 2rem;

}

.background {
  background-color: #242424;
  color: white; /* Cambiar el color del texto si es necesario */
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
}
.addplantbackground {
  color: white; /* Cambiar el color del texto si es necesario */
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
  padding-top: 1rem;
}

.header {
  margin: 3rem 3rem 1rem 3rem;
  display: flex;
  align-items: center; /* Centra verticalmente los elementos */
}

.searchBar {
  width: 100%; /* Establece el ancho del pv-autoComplete al 100% del contenedor */
}

.inventory{
  padding: 1.5rem;
}

.crop-details {
  color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alinea los elementos a la izquierda */
  text-align: left; /* Alinea el texto a la izquierda */
}
.title {
  margin-right: 20px; /* Espacio entre el título y el borde derecho */
}

.title-text {
  font-weight: bold;
}

.detail {
  margin-right: 20px; /* Espacio entre los detalles y el borde derecho */
  margin-top: 15px;
}

.detail-text {
  font-weight: bold;
}
.image-container {
  text-align: center; /* Centrar la imagen horizontalmente */
  margin-top: 15px;

}

.centered-image {
  max-width: 100%; /* Asegura que la imagen no sea más ancha que su contenedor */
  max-height: 300px; /* Límite de altura máximo */
  height: auto; /* Mantiene la proporción de aspecto de la imagen */
  border-radius: 15px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;

}

.divider {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.5); /* Color de línea divisoria */
  margin: 10px 0;
  margin-top: 15px;
}

</style>

