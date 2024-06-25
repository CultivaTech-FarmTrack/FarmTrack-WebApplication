<template>
  <div class="background">
    <div class="header" style="display: flex;justify-content: left;">
      <h1>Manage your devices</h1>
    </div>
    <div class="projects">
      <div class="card">
        <pv-dataTable ref="dt"
                      :value="devices"
                      v-model:filters="filters"
                      datakey="id"
                      :paginator="true"
                      :rows="10"
                      :filters="filters"
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      :rowsPerPageOptions="[1, 2, 3]"
                      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} habitaciones"
                      responsiveLayout="scroll"
                      :globalFilterFields="['name', 'model', 'active', 'category']"
                      tableStyle="min-width: 10rem">
          <template #header>
            <div style="display: flex; width: 100%; justify-content: space-between ">
              <pv-button severity="primary" style=" font-weight: bold" @click="addNewDevice()">Add a device</pv-button>
              <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <pv-input v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
            </div>
          </template>
          <template #empty> No devices found. </template>
          <template #loading> Loading devices data. Please wait. </template>
          <pv-column field="name" header="Name" style="min-width: 1rem"></pv-column>
          <pv-column field="cropName" header="Plant" style="min-width: 5rem"></pv-column>
          <pv-column  header="Active" style="min-width: 1rem">
            <template #body="{ data }">
              <pv-inputSwitch v-model="data.active" @click="updateActiveDevice(data)" />
            </template>
          </pv-column >
          <pv-column  header="" style="min-width: 1rem">
            <template #body="{ data }">
              <div style="display: flex;justify-content: space-evenly">
                <pv-button :disabled="isWatchDisable || !data.active" style="margin-right: 0.5rem" icon="pi pi-eye" label="Watch" severity="secondary" aria-label="Information" @click="getDeviceValue(data)"/>
                <pv-button  icon="pi pi-cog" style="margin-right: 0.5rem" severity="warning" rounded aria-label="options" @click="openInfoDeviceDialog(data)"/>
              </div>
            </template>
          </pv-column >
        </pv-dataTable>
      </div>
      <pv-dialog v-model:visible="deleteDeviceDialogVisible"  modal header="Delete device" :style="{ width: '30vw' }">
        <div class="addplantbackground">
          <h3 style="margin: 0rem 2rem 2rem 2rem">¿ Are you sure you want delete this device ?</h3>
          <div style="display: flex;justify-content: space-around">
            <pv-button label="No" severity="danger" @click="deleteDeviceDialogVisible=!deleteDeviceDialogVisible"/>
            <pv-button label="Yes" severity="success" @click="deleteDevice()"/>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="deviceValueDialogVisible" maximizable modal header="Monitoring" :style="{ width: '40rem' }">
        <div class="addplantbackground">
          <div style="display: flex;justify-items: center;align-items: center">
            <i class="pi pi-circle-fill" style="color: green;font-size: 0.7rem;margin-right: 0.5rem" ></i>
            <h3>{{currentDevice.cropName}} - {{currentDevice.model}}</h3>
          </div>
          <div v-if="currentDevice.model==='DHT22'" class="crop-details">
            <div style="display: flex; margin-top: 1rem; justify-content: space-around">
              <div v-if="isTemperatureOutOfRange()===false">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem">{{ formatNumber(currentDeviceValue.planTemperature) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem">ºC</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%">
                  <p>TEMPERATURE</p>
                </div>
              </div>
              <div v-if="isTemperatureOutOfRange()===true">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem;color: #ff4b4b">{{ formatNumber(currentDeviceValue.planTemperature) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem;color: #ff4b4b">ºC</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%;color: #ff4b4b">
                  <div>
                    <p>TEMPERATURE</p>
                    <p>OUT OF RANGE</p>
                  </div>
                </div>
              </div>

              <div v-if="isHumidityOutOfRange()===false">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem">{{ formatNumber(currentDeviceValue.planHumidity) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem"> %</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%">
                  <p>HUMIDITY</p>
                </div>
              </div>
              <div v-if="isHumidityOutOfRange()===true">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem;color: #ff4b4b">{{ formatNumber(currentDeviceValue.planHumidity) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem;color: #ff4b4b"> %</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%;color: #ff4b4b">
                  <div>
                    <p>TEMPERATURE</p>
                    <p>OUT OF RANGE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="currentDevice.model==='DS18B20'" class="crop-details">
            <div style="display: flex; margin-top: 1rem; justify-content: space-around">
              <div v-if="isTemperatureOutOfRange()===false">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem">{{ formatNumber(currentDeviceValue.planTemperature) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem">ºC</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%">
                  <p>TEMPERATURE</p>
                </div>
              </div>
              <div v-if="isTemperatureOutOfRange()===true">
                <div style="display: flex;justify-items: center;align-items: center">
                  <h2 style="margin: 1rem ; font-size: 5rem;color: #ff4b4b">{{ formatNumber(currentDeviceValue.planTemperature) }}</h2>
                  <p style="margin: 1rem 0rem 1rem 0rem ; font-size: 4rem;color: #ff4b4b">ºC</p>
                </div>
                <div style="display: flex;justify-content: center;width: 100%;color: #ff4b4b">
                  <div>
                    <p>TEMPERATURE</p>
                    <p>OUT OF RANGE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="deviceDialogVisible" maximizable modal header="Device Settings" :style="{ width: '20rem' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <div>
              <pv-input v-model="currentDeviceForInfoName" style="width: 100%;color: white" placeholder="Disabled" />
            </div>
            <h4 style="margin: 1rem ">Model: {{currentDeviceForInfo.model}}</h4>
            <div style="width: 100%;display: flex;justify-content: space-around ">
              <div style="display: flex; align-items: center;margin-left: 1rem">
                <pv-inputSwitch v-model="currentDeviceForInfo.activeNotification" />
                <p style="margin-left: 0.5rem; margin-bottom: 0;">Send notifications</p>
              </div>
              <div style="margin: 1rem">
                <pv-button outlined severity="danger" label="Delete device" aria-label="Delete" @click="openDeleteDeviceDialog(currentDeviceForInfo)"/>
              </div>
            </div>

            <div style="margin: 2rem 1rem 1rem 1rem;display: flex;justify-content: space-around">
              <pv-button icon="pi pi-times" severity="danger" label="close" aria-label="close" @click="deviceDialogVisible=false" />
              <pv-button icon="pi pi-save" severity="success" label="save" aria-label="save" @click="saveDeviceSettings(currentDeviceForInfo)"/>
            </div>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="addDeviceDialogVisible" maximizable modal header="Add Devices" :style="{ width: '80vw' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <div v-if="!buyMode" v-for="device in devicesCataloge">
              <div style="display: flex;justify-content: left; padding: 1rem">
                <img :src="device.imageUrl" alt="" style="width: 100px; height: 100px;border-radius: 1rem; margin-right: 1.5rem">
                <div style="display: flex; width: 100%;justify-content: space-between">
                  <div>
                    <h2 style="margin: 0.5rem 0">{{device.model}}</h2>
                    <h3 style="margin: 0.2rem 0">{{device.category}}</h3>
                    <h4>S/. {{device.price}}</h4>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <pv-button label="Add" @click="addDevicefromCataloge(device)"/>
                  </div>
                </div>
              </div>
            </div>
            <div v-else style="display: flex;justify-content: space-around">
              <div style="width: 50%;">
                <div style="margin: 1rem">
                  <h1> Before buy it</h1>
                  <h2> We need some information</h2>
                </div>
                <div style="margin: 2rem 0">
                  <div style="margin: 1rem">
                                    <span style="width: 100%" class="p-float-label">
                                    <pv-input @input="buyButtonDisable" style="width: 100%" v-tooltip="'We recommend a name to differentiate it from other devices'" id="username" v-model="currentDeviceName" />
                                    <label style="width: 100%" for="username">Device Name</label>
                                </span>
                  </div>

                  <div style="margin: 1rem">
                    <pv-dropdown style="width: 100%" v-model="selectedCrop"
                                 @change="buyButtonDisable()" :options="cropsForFarmer"
                                 optionLabel="name" placeholder="Crop for your device" />
                  </div>
                  <div style="margin: 2rem 1rem 1rem 1rem; display: flex;justify-content: space-around">
                    <pv-button style="margin-right: 1rem" label="Cancel"  severity="danger" aria-label="Information" @click="cancelBuyButton()"/>
                    <pv-button :disabled="isBuyButtonDisable" severity="success" label="Buy" aria-label="Delete"  @click="buyDevice()"/>
                  </div>
                </div>
              </div>
              <div style="width: 50%">
                <div style="width: 100%; display: flex;justify-content: center">
                  <img :src="currentDeviceInBuy.imageUrl" style="width: 200px; height: 200px;border-radius: 0.5rem; " alt="">
                </div>
                <div style="width: 100%; display: flex;justify-content: center">
                  <p class="device-specifications">{{currentDeviceInBuy.specifications}}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="proccessingBuyDialogVisible" modal header="Loading payment" :style="{ width: '30vw' }">
        <div class="crop-details">
          <div style="display: flex;justify-content: center;margin: 2rem 0">
            <i class="pi pi-spin pi-spinner" style="font-size: 5rem"></i>
          </div>
          <div style="display: flex;justify-content: center;margin: 2rem 0">
            <p>This process may take a few seconds.</p>
          </div>
        </div>
        <stripe-checkout
            ref="checkoutRef"
            mode="payment"
            :pk="publishableKey"
            :line-items="lineItems"
            :success-url="successURL"
            :cancel-url="cancelURL"
            @loading="v => loading = v"
        />
      </pv-dialog>
      <pv-dialog v-model:visible="isDeviceBoughtDialog"  modal header="Payment successfully processed" :style="{ width: '50vw' }">
        <div class="crop-details">
          <div style="display: flex;justify-content: center;margin: 2rem 0">
            <h2>Thank you for your patience.</h2>
          </div>
          <div style="display: flex;justify-content: center;margin: 2rem 0 0 0">
            <pv-button style="margin-right: 1rem" label="close"  severity="successful" aria-label="Close" @click="isDeviceBoughtDialog=false"/>
          </div>
        </div>
      </pv-dialog>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import {ProjectApiService} from "@/farmtrack/services/project-api.service";
import {ActivitiesApiService} from "@/farmtrack/services/activities-api.service";
import {PlantServices} from "@/farmtrack/services/plant-api.service";
import {CropServices} from "@/farmtrack/services/crop-api.service";
import {DeviceServices} from "@/farmtrack/services/device-api.service";
import {DeviceCatalogeServices} from "@/farmtrack/services/devices-cataloge-api.service";
import {StripeCheckout} from "@vue-stripe/vue-stripe";

export default {
  name: "farmer_devices",
  components: {StripeCheckout},
  data(){
    return{
      id:parseInt(sessionStorage.getItem("id").toString()),
      devices:[],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cropName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        active: { value: null, matchMode: FilterMatchMode.IN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      },
      publishableKey:'pk_test_51OAzYZHe6cIQ9MTkeu2FPZCcR1olGo1LeCLLkUNdmVvEXBGmIv2Tw3jFWWhqzCDZ6agSJYrMsQhBwCOdEeeMs3zf007fpn6u8x',
      successURL:'https://farm-track.netlify.app/devices',
      cancelURL:'https://farm-track.netlify.app/devices',
      loading: false,
      lineItems: [
        {
          price: 'price_1OB0vHHe6cIQ9MTkbD9RYUzw',
          quantity: 1,
        },
      ],
      selectedCrop:null,
      cropsForFarmer:[],
      proccessingBuyDialogVisible:false,
      deviceDialogVisible:false,
      deleteDeviceDialogVisible:false,
      addDeviceDialogVisible:false,
      deviceValueDialogVisible:false,
      currentCropForProject:{},
      currentDeviceForDelete:{},
      currentDeviceForInfo:{},
      currentDeviceForInfoName:"",
      currentDeviceInBuy:{},
      devicesCataloge:{},
      currentDeviceValue:{},
      currentDeviceName:"",
      buyMode:false,
      isBuyButtonDisable:true,
      isDeviceBoughtDialog:false,
      isWatchDisable:false,
      currentDevice:null,
      currentCropRanges:null
    };
  },
  created(){
    if(localStorage.getItem("deviceId")!==null){
      this.isDeviceBoughtDialog=true
      console.log("deviceId: "+localStorage.getItem("deviceId"))
      localStorage.removeItem("deviceId")
      localStorage.removeItem("deviceModel")
    }
    new DeviceServices().getAllDevicesByUserId(this.id).then(res=>{
      this.devices=res.data
    })
    this.getDisplayableCrops()
  },
  methods:{
    isTemperatureOutOfRange(){
      let minRange=this.currentCropRanges.minTemperature
      let maxRange=this.currentCropRanges.maxTemperature
      if(this.currentDeviceValue.planTemperature>=maxRange || this.currentDeviceValue.planTemperature<=minRange ){
        return true
      }else {
        return false
      }
    },
    isHumidityOutOfRange(){
      let minRange=this.currentCropRanges.minHumidity
      let maxRange=this.currentCropRanges.maxHumidity
      if(this.currentDeviceValue.planHumidity>=maxRange || this.currentDeviceValue.planHumidity<=minRange ){
        return true
      }else {
        return false
      }
    },
    formatNumber(number) {
      // Redondear el número a una decimal y convertirlo a una cadena
      const formated = number.toFixed(1);

      // Convertir la cadena a un número
      return parseFloat(formated);
    },
    cancelBuyButton(){
      this.currentDeviceName=null
      this.selectedCrop=null
      this.buyMode=false
    },
    buyButtonDisable(){
      if(this.currentDeviceName.length>0 && this.selectedCrop!==null){
        this.isBuyButtonDisable=false
      }else {
        this.isBuyButtonDisable=true
      }
    },
    buyDevice(){
      this.currentDeviceInBuy.name=this.currentDeviceName
      this.currentDeviceInBuy.cropName=this.selectedCrop.name
      this.currentDeviceInBuy.cropId=this.selectedCrop.cropId
      new ProjectApiService().getProjectByCropId(this.currentDeviceInBuy.cropId).then(res=>{
        new ProjectApiService().addDeviceProject(res.data.id).then(res=>{
          this.currentDeviceInBuy.projectId=res.data.id
          this.addDeviceDialogVisible=false
          this.proccessingBuyDialogVisible=true
          this.processPurchase()
        })
      }).catch(error=>{
        this.currentDeviceInBuy.projectId=0
        this.addDeviceDialogVisible=false
        this.proccessingBuyDialogVisible=true
        this.processPurchase()
      })

    },
    processPurchase(){
      if(this.currentDeviceInBuy.model==='DHT22'){
        this.lineItems[0].price='price_1OCmbGHe6cIQ9MTkGUrgef5y'
        new DeviceServices().postDevice(this.currentDeviceInBuy).then(res=>{
          localStorage.setItem("deviceId",res.data)
          localStorage.setItem("deviceModel",this.currentDeviceInBuy.model)
          this.$refs.checkoutRef.redirectToCheckout();
        })
      }
      if(this.currentDeviceInBuy.model==='DS18B20'){
        this.lineItems[0].price='price_1OCmcSHe6cIQ9MTkNAakzDBP'
        new DeviceServices().postDevice(this.currentDeviceInBuy).then(res=>{
          localStorage.setItem("deviceId",res.data)
          localStorage.setItem("deviceModel",this.currentDeviceInBuy.model)
          this.$refs.checkoutRef.redirectToCheckout();
        })
      }

    },
    getDisplayableCrops(){
      this.cropsForFarmer=[]
      new CropServices().getCropsByFarmerId("",this.id).then(response=>{
        let rawCrops=response.data
        for (let i = 0; i < rawCrops.length; i++) {
          new PlantServices().getPlantInfoById(rawCrops[i].plantId).then(res=>{
            let storableCropAndPlantInfo={}
            storableCropAndPlantInfo=res.data
            storableCropAndPlantInfo.cropId=rawCrops[i].id
            console.log(storableCropAndPlantInfo)
            this.cropsForFarmer.push(storableCropAndPlantInfo)
          })
        }

      })

    },
    addDevicefromCataloge(device){
      this.buyMode=true

      this.currentDeviceInBuy.model=device.model
      this.currentDeviceInBuy.category=device.category
      this.currentDeviceInBuy.farmerId=this.id
      this.currentDeviceInBuy.projectId=0
      this.currentDeviceInBuy.imageUrl=device.imageUrl
      this.currentDeviceInBuy.specifications=device.specifications
      this.currentDeviceInBuy.price=device.price

      //new DeviceServices().postDevice()
    },
    getDeviceValue(data){
      console.log(data)
      this.currentDevice=data
      this.currentCropRanges=this.cropsForFarmer.find(crop => crop.cropId === this.currentDevice.cropId);
      this.isWatchDisable=true
      new DeviceServices().getDeviceValueById(data.id).then(res=>{
        this.currentDeviceValue=res.data
        //this.currentDeviceValue.planMinTemperature
        //this.currentDeviceValue.planTemperature=20.33333
        //this.currentDeviceValue.planHumidity=70.33333
        this.deviceValueDialogVisible=true
      })

      let intervalId=setInterval(() => {
        if (this.deviceValueDialogVisible) {
          new DeviceServices().getDeviceValueById(data.id).then(res=>{
            this.currentDeviceValue=res.data
          })
        }
        else {
          this.isWatchDisable=false
          clearInterval(intervalId)

        }
      }, 2000);
    },
    updateActiveDevice(device){
      new DeviceServices().setDeviceStatus(device).then(res=>{
      })

    },
    addNewDevice(){
      new DeviceCatalogeServices().getAllDevices().then(response=>{
        this.devicesCataloge=response.data
        this.buyMode=false
        this.addDeviceDialogVisible=!this.addDeviceDialogVisible
      })
    },
    openDeleteDeviceDialog(device){
      this.currentDeviceForDelete=device
      this.deleteDeviceDialogVisible=!this.deleteDeviceDialogVisible
    },
    openInfoDeviceDialog(device){
      console.log(device)
      this.currentDeviceForInfo={}
      this.currentDeviceForInfo=device
      this.currentDeviceForInfoName=""
      this.currentDeviceForInfoName=device.name
      if(device.projectId>0){
        new ProjectApiService().getProjectById(device.projectId).then(response=>{

          this.currentDeviceForInfo.projectName= response.data.name.toString()
        }).then(errer=>{
          console.log(errer.data)
        })
      }
      this.deviceDialogVisible=!this.deviceDialogVisible
    },
    deleteDevice(){
      // delete device using device service
      const index = this.devices.findIndex(device => device.id === this.currentDeviceForDelete.id);
      if (index !== -1) {
        this.devices.splice(index, 1); // Elimina el dispositivo del arreglo
      }
      this.deviceDialogVisible=false
      this.deleteDeviceDialogVisible=!this.deleteDeviceDialogVisible
    },
    saveDeviceSettings(device){
      device.name=this.currentDeviceForInfoName
      new DeviceServices().updateDeviceById(device).then(res=>{
        // Buscar el índice del dispositivo en el array basándose en su ID
        const index = this.devices.findIndex(d => d.id === device.id);

        // Verificar si se encontró el dispositivo en el array
        if (index !== -1) {
          // Actualizar el dispositivo en el array
          this.devices[index] = { ...this.devices[index], ...device };
        }
        this.deviceDialogVisible=false
      })

    },
    getSeverity(status) {
      switch (status) {
        case true:
          return 'success';

        case false:
          return 'danger';
      }
    },
    openActivities(id){
      this.activitiesDialogVisible=!this.activitiesDialogVisible
      new ActivitiesApiService().getActivitiesByProjectId(id).then(response=>{
        this.currentActivities=response.data
      })
    },
  }
}
</script>

<style scoped>
.device-specifications {
  width: 60%;
  display: flex;
  margin: 1rem;
  justify-content: center;
  font-size: 15px;
  word-wrap: break-word;
  white-space: pre-line;
}
.background {
  background-color: #242424;
  color: white; /* Cambiar el color del texto si es necesario */
  margin: 15px 20px 15px 20px; /* Agregar el relleno deseado */
  border-radius: 15px; /* Agregar bordes redondeados */
  width: 100%;
  padding-bottom: 3rem;
}
.header {
  margin: 3rem 3rem 1rem 3rem;
  display: flex;
  align-items: center; /* Centra verticalmente los elementos */
}
.projects{
  padding: 1.5rem;
}


.profile-image img {
  width: 100%; /* Ajusta la imagen de perfil al círculo */
  height: 100%;
  object-fit: cover; /* Mantiene la relación de aspecto de la imagen */
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