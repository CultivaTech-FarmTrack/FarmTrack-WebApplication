<template>
  <div class="background">
    <div class="header" style="display: flex;justify-content: left;">
      <h1>Manage your projects</h1>
    </div>
    <div class="projects">
      <div class="card">
        <pv-dataTable ref="dt"
                      :value="projects"
                      v-model:filters="filters"
                      datakey="id"
                      :paginator="true"
                      :rows="10"
                      :filters="filters"
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      :rowsPerPageOptions="[1, 2, 3]"
                      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} habitaciones"
                      responsiveLayout="scroll"
                      :globalFilterFields="['name', 'isProjectStarted', 'weeks', 'description']"
                      tableStyle="min-width: 50rem">
          <template #header>
            <div class="flex" style="display:flex;justify-content: space-between;width: 100%;">
                            <span class="p-input-icon-left">
                              <pv-button label="Create project" severity="success" @click="createProject()"  />
                            </span>
              <span class="p-input-icon-left">
                              <i class="pi pi-search" />
                              <pv-input v-model="filters['global'].value" placeholder="Keyword Search" />
                            </span>
            </div>
          </template>
          <template #empty> No projects found. </template>
          <template #loading> Loading projects data. Please wait. </template>
          <pv-column field="name" header="Name" style="min-width: 7rem"></pv-column>
          <pv-column field="farmerName" header="Farmer" style="min-width: 7rem">
          </pv-column>
          <pv-column field="durationDays" header="Duration" style="min-width: 7rem">
            <template #body="{ data }">
              <p>{{data.durationDays}} days</p>
            </template>
          </pv-column>
          <pv-column field="totalActivities" header="Activities" style="min-width: 7rem">
            <template #body="{ data }">
              <pv-button severity="secondary" rounded size="small" @click="openActivities(data)">{{ data.activitiesDone }}/{{ data.totalActivities }}</pv-button>
            </template>
          </pv-column>
          <pv-column field="projectStarted" header="Status" style="min-width: 1rem">
            <template #body="{ data }">
              <pv-tag :value="getStatusProject(data.projectStarted)" :severity="getSeverity(data.projectStarted)" />
            </template>
          </pv-column >
          <pv-column  header="" style="min-width: 1rem">
            <template #body="{ data }">
              <pv-button :disabled="isShowDataButtonDisable" v-show="data.device" style="margin-right: 0.5rem" icon="pi pi-tablet"
                         severity="secondary" aria-label="Information" @click="openDeviceDialog(data)"/>
            </template>
          </pv-column >
          <pv-column  header="" style="min-width: 1rem">
            <template #body="{ data }">
              <pv-button label="Details" severity="success" @click="showProjectDetail(data)"  />
            </template>
          </pv-column >
        </pv-dataTable>
      </div>
      <pv-dialog v-model:visible="activitiesDialogVisible" maximizable modal header="Activities" :style="{ width: '80vw' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <div v-for="activities in currentActivities"
                 :key="activities.id">
              <pv-accordion>
                <pv-accordionTab>
                  <template #header>
                    <div style="width: 100%;display: flex;justify-content: space-between">
                      <span>{{ activities.title }}</span>
                      <pv-tag v-if="activities.completed" severity="success" >Finished</pv-tag>
                      <pv-tag v-if="!activities.completed" severity="danger" >Pending</pv-tag>
                    </div>
                  </template>
                  <div class="chat-card">
                    <div class="chat-content" >
                      <div class="chat-header">
                        <h3 style="margin-bottom: 0.5rem">{{ activities.description }}</h3>
                      </div>
                      <div style="display: flex;">
                        <i class="pi pi-calendar" style="margin-right: 1rem"></i>
                        <p style="width: 50%">{{ activities.date }}</p>
                      </div>
                    </div>
                  </div>
                </pv-accordionTab>
              </pv-accordion>
            </div>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="projectDetailsDialogVisible" maximizable modal header="Details" :style="{ width: '80vw' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <h1>{{currentProjectDetail.name}}</h1>
            <h4>{{currentProjectDetail.description}}</h4>
            <h5>Farmer: {{currentProjectDetail.farmerName}}</h5>
            <h5>Status: {{getStatusProject(currentProjectDetail.projectStarted)}}</h5>
            <h5>Crop: {{currentCropForProject.name}}</h5>
            <h5>Duration: {{currentProjectDetail.durationDays}} days</h5>
            <h5>Activities: {{ currentProjectDetail.activitiesDone }} of {{ currentProjectDetail.totalActivities }} done</h5>

          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="createProjectVisible" maximizable modal header="Create a project" :style="{ width: '800px' }">
        <div class="addplantbackground">
          <div v-if="this.devices.length > 0" style="margin: 0rem 2rem 2rem 2rem; display: flex; align-items: center;">
            <p style="margin-right: 0.5rem;">This crop has {{ this.devices.length }} monitoring</p>
            <pv-button :disabled="isShowDataButtonDisable" label="devices" severity="secondary"
                       aria-label="Information"  @click="openDeviceDialog(selectedCrop)" />
          </div>
          <div v-if="selectionStep">
            <div v-if="!stepContactSelected">
              <div style="display:flex; justify-content: center">
                <h2 style="margin-bottom: 2rem">SELECT A CONTACT</h2>
              </div>
              <div style="display:flex; justify-content: center">
                <pv-dropdown style="width: 90%" v-model="selectedContact"  :options="currentContactForSpecialist"
                             optionLabel="name" placeholder="Select a contact" @change="getCropForProject()"/>
              </div>
            </div>
            <div v-if="stepContactSelected">
              <div style="display:flex; justify-content: center">
                <h2 style="margin: 0 2rem 2rem 0">SELECT A CROP</h2>
              </div>
              <div style="display:flex; justify-content: center">
                <pv-dropdown style="width: 90%" :disabled="selectedContact===null" v-model="selectedCrop"
                             @change="this.isNextButtonDisable=false"  :options="currentCropsForFarmer"
                             optionLabel="name" placeholder="Select a crop" />
              </div>
            </div>
          </div>
          <div v-if="informationStep">
            <div style="display:flex; justify-content: center">
              <h2 style="margin: 0rem 2rem 2rem 0">INFORMATION</h2>
            </div>

            <div style="display:flex; justify-content: center; width: 100%;">
                        <span style="margin: 1.5rem 2rem 0rem 2rem;width: 100%;display:flex; justify-content: center;" class="p-float-label">
                          <pv-input @input="validateNextButtonDisable" v-model="projectName" style="width: 100%"/>
                          <label style="width: 100%">Project name</label>
                        </span>
            </div>
            <div style="display:flex; justify-content: center; width: 100%;">
                        <span style="margin: 1.8rem 2rem 2rem 2rem;width: 100%;display:flex; justify-content: center;" class="p-float-label">
                          <pv-textArea style="width: 100%" @input="validateNextButtonDisable" rows="3" cols="15" v-model="projectDescription"/>
                          <label style="width: 100%">Project description</label>
                        </span>
            </div>



          </div>
          <div v-if="dateStep">
            <h2 style="margin: 0 2rem 1rem 0">Project duration</h2>
            <div style="display: flex; justify-content: center; width: 100%;">
              <div style="width: 90%;">
                <p style="margin: 1rem 0 0.5rem 0">Start date</p>
                <pv-calendar @dateSelect="validateNextButtonDisable" v-model="startProjectDate" date-format="dd/mm/yy" style="width: 100%" showIcon :minDate="startProjectMinDate" :manualInput="false" />
              </div>
            </div>
            <div style="display: flex; justify-content: center; width: 100%;">
              <div style="width: 90%;">
                <p style="margin: 1.5rem 0 0.5rem 0">Finish date</p>
                <pv-calendar @dateSelect="validateNextButtonDisable" v-model="finishProjectDate" date-format="dd/mm/yy" style=" width: 100%;margin-bottom: 1rem" showIcon :minDate="startProjectDate" :manualInput="false" />
              </div>
            </div>
          </div>
          <div v-if="taskStep">
            <h2 style="margin: 0 2rem 2rem 0">Add tasks</h2>
            <div style="display: flex;justify-content: space-around">
              <div style="width: 35%">
                <div style="display:flex; justify-content: center; width: 100%;">
                                <span style="margin: 0 1rem 0 0;width: 100%;display:flex; justify-content: center;" class="p-float-label">
                                  <pv-input @input="validateAddTaskButtonDisable" style="width: 100%" v-model="taskName" />
                                  <label style="width: 100%">Task name</label>
                               </span>
                </div>
                <div style="display:flex; justify-content: center; width: 100%;">
                                <span style="margin: 1.5rem 1rem 0 0;width: 100%;display:flex; justify-content: center;" class="p-float-label">
                                  <pv-textArea @input="validateAddTaskButtonDisable" style="width: 100%" rows="2" cols="15" v-model="taskDescription" />
                                  <label style="width: 100%">Task description</label>
                                </span>
                </div>
                <div style="display: flex;justify-content: center; width: 93%">
                  <pv-button :disabled="isAddTaskButtonDisable" style="margin-top: 1rem; width: 100%"  label="Add" severity="success" @click="addTask()"/>
                </div>
                <div class="task-grid" style="height: 100%">
                  <div class="task-icon" v-for="task in taskForProject">
                    <div>
                      <div class="overlay"></div> <!-- Agrega la capa overlay aquí -->
                      <div class="content" @click="deleteTask(task.id)">
                        <div class="calendar-day">{{ formatCardDate(task.date) }}</div>
                        <div class="task-name">{{ task.name }}</div>
                        <div class="delete-text" style="font-weight: bold">Delete</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div style="width: 65%">
                <div class="card flex justify-content-center">
                  <pv-calendar @dateSelect="validateAddTaskButtonDisable" v-model="activityProjectDate" :minDate="startProjectDate" :maxDate="finishProjectDate" inline showWeek />
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex;justify-content: space-between; margin: 2rem 1rem 0 1rem">
            <pv-button v-if="!stepContactSelected" label="Cancel" severity="danger" @click="addProjectStepPrevious()"  />
            <pv-button v-if="stepContactSelected" label="Previous" severity="secondary" @click="addProjectStepPrevious()"  />
            <pv-button v-if="!taskStep" :disabled="isNextButtonDisable" label="Next" severity="success" @click="addProjectStepNext()"/>
            <pv-button v-if="taskStep" :disabled="isCreateProjectButtonDisable" label="Create" severity="success" @click="sendCreatedProject()"/>
          </div>
        </div>
      </pv-dialog>
      <pv-dialog v-model:visible="isDeviceDialogVisible" maximizable modal header="Devices" :style="{ width: '30rem' }">
        <div class="addplantbackground">
          <div class="crop-details">
            <div v-if="!isDeviceShowingData">
              <div v-for="device in currentDevices"
                   :key="device.id">
                <div class="chat-card">
                  <div class="profile-image">
                    <i class="pi pi-tablet" style="font-size: 2.5rem"></i>
                  </div>
                  <div class="chat-content" >
                    <div class="chat-header">
                      <div style="width: 100%;">
                        <h3 style="margin-bottom: 0.5rem">{{ device.name }}</h3>
                        <p>{{device.category}}</p>
                      </div>
                      <div>
                        <pv-button :disabled="isShowDataButtonDisable" icon="pi pi-eye" severity="success" label="value" @click="showRealTimeValue(device)"  aria-label="watch"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="currentDeviceInShowingData.model==='DHT22'">
                <h2 style="margin: 1rem ">Temperature: {{currentDeviceValue.planTemperature}} C</h2>
                <h2 style="margin: 1rem ">Humedity: {{currentDeviceValue.planHumidity}} %</h2>
              </div>
              <div v-if="currentDeviceInShowingData.model==='DS18B20'">
                <h2 style="margin: 1rem ">Temperature: {{currentDeviceValue.planTemperature}} C</h2>
              </div>
              <div style="width: 100%;display: flex;justify-content: right">
                <pv-button severity="secondary" label="return" @click="stopShowingDeviceData()"  aria-label="watch"/>
              </div>
            </div>

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
import {UserServices} from "@/farmtrack/services/user-api.service";
import {ContactServices} from "@/farmtrack/services/contacts-api.service";
import {DeviceServices} from "@/farmtrack/services/device-api.service";
import {ChatServices} from "@/farmtrack/services/chat-api.service";

export default {
  name: "farmer_projects",
  data(){
    return{
      token: sessionStorage.getItem("jwt"),
      id: parseInt(sessionStorage.getItem("id").toString()),
      isShowDataButtonDisable:false,
      isDeviceShowingData:false,
      isDeviceDialogVisible:false,
      currentDevices:[],
      currentDeviceValue:{},
      selectionStep:true,
      informationStep:false,
      dateStep:false,
      taskStep:false,
      stepContactSelected:false,
      startProjectDate: null,
      startProjectMinDate: new Date(),
      finishProjectDate: null,
      activityProjectDate: null,
      projects:[],
      devices:0,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        weeks: { value: null, matchMode: FilterMatchMode.IN },
        projectStarted: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      },
      activitiesDialogVisible:false,
      projectDetailsDialogVisible:false,
      createProjectVisible:false,
      currentActivities:[],
      currentProjectDetail:{},
      currentSpecialistForProject:{},
      currentCropForProject:{},
      currentContactForSpecialist:[],
      currentCropsForFarmer:[],
      selectedContact: null,
      selectedCrop: null,
      projectName:"",
      projectDescription:"",
      taskName:"",
      taskDescription:"",
      taskForProject:[],
      isNextButtonDisable:true,
      isAddTaskButtonDisable:true,
      isCreateProjectButtonDisable:true,
      currentDeviceInShowingData:null
    };
  },
  created(){
    this.startProjectMinDate = new Date();
    new ProjectApiService().getProjectsBySpecialistId(this.id).then(response=>{
      this.projects=response.data
      this.setFarmerDataToProject()
      this.setDurationDayToProject()
      this.setActivitysForProject()
    })
  },
  methods:{
    showRealTimeValue(device){
      this.currentDeviceInShowingData=device
      console.log(this.currentDeviceInShowingData)
      this.isShowDataButtonDisable=true
      let tempDevice={}
      tempDevice.id=device.deviceId
      tempDevice.active=false
      new DeviceServices().getDeviceById(tempDevice.id).then(r=>{
        let shouldTurnOff=!r.data.active
        new DeviceServices().setDeviceStatus(tempDevice).then(res=>{
          this.isDeviceShowingData=true
          this.watchData(tempDevice,shouldTurnOff)

        })
      })
    },
    stopShowingDeviceData(){
      this.isDeviceShowingData=false
    },
    watchData(device,shouldTurnOff){
      let intervalId=setInterval(() => {
        if(!this.isDeviceDialogVisible){
          let deviceOff=device
          deviceOff.active=true
          if(shouldTurnOff){
            new DeviceServices().setDeviceStatus(deviceOff).then(res=>{
              this.isShowDataButtonDisable=false
              clearInterval(intervalId)

            })
          }else{
            this.isShowDataButtonDisable=false
            clearInterval(intervalId)

          }
        }
        if ( this.isDeviceShowingData) {
          new DeviceServices().getDeviceValueById(device.id).then(res=>{
            this.currentDeviceValue=res.data
            console.log(this.currentDeviceValue)
          })
        }
        else {
          let deviceOff=device
          deviceOff.active=true
          if(shouldTurnOff){
            new DeviceServices().setDeviceStatus(deviceOff).then(res=>{
              this.isShowDataButtonDisable=false
              clearInterval(intervalId)

            })
          }else{
            this.isShowDataButtonDisable=false
            clearInterval(intervalId)

          }
        }
      }, 2000);

    },
    openDeviceDialog(data){
      this.isDeviceShowingData=false
      new DeviceServices().getDeviceInfoByCropId(data.cropId).then(res=>{
        this.isDeviceDialogVisible=true
        this.currentDevices=res.data
        for (let i = 0; i < this.currentDevices.length; i++) {
          new DeviceServices().getDeviceById(this.currentDevices[i].deviceId).then(r=>{
            this.currentDevices[i].model=r.data.model
            this.currentDevices[i].category=r.data.category
          })
        }


        console.log(this.currentDevices)
      })
    },
    setActivitysForProject(){
      for (let i = 0; i < this.projects.length; i++) {
        new ActivitiesApiService().getActivitiesByProjectId(this.token,this.projects[i].id).then(response=>{
          let activities=response.data
          let activitiesDone=0
          for (let i = 0; i < activities.length; i++) {
            if(activities[i].completed===true){
              activitiesDone+=1
            }
          }
          this.projects[i].totalActivities=activities.length
          this.projects[i].activitiesDone=activitiesDone
        })
      }

    },
    setDurationDayToProject(){
      for (let i = 0; i < this.projects.length; i++) {
        this.projects[i].durationDays=this.calculateDurationDay(this.projects[i].startDate,this.projects[i].endDate)
      }
    },
    calculateDurationDay(start, end) {
      const [startDay, startMonth, startYear] = start.split('/');
      const [endDay, endMonth, endYear] = end.split('/');

      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      const timeDifference = endDate - startDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return daysDifference;
    },
    validateNextButtonDisable(){
      if(this.selectionStep){
        if(this.selectedCrop!==null){
          this.isNextButtonDisable=false
        }
        if(this.projectName !== "" && this.projectDescription !== ""){
          this.isNextButtonDisable=false
        }
      }
      if(this.informationStep){
        if(this.startProjectDate !== null && this.finishProjectDate !== null){
          this.isNextButtonDisable=false
        }
        if(this.projectName !== "" && this.projectDescription !== ""){
          this.isNextButtonDisable=false
        }
      }
      if(this.dateStep){

        if(this.startProjectDate !== null && this.finishProjectDate !== null){
          this.isNextButtonDisable=false
        }
      }
      if(this.taskForProject.length!==0){
        this.isCreateProjectButtonDisable=false
      }

    },
    validateAddTaskButtonDisable(){
      if(this.taskName !== "" && this.taskDescription !== "" && this.activityProjectDate!==null){
        this.isAddTaskButtonDisable=false
      }
    },
    sendCreatedProject(){
      let newProject={}
      newProject.id=this.projects.length+1//solucion temporal
      newProject.name=this.projectName
      newProject.description=this.projectDescription
      newProject.farmerId=this.selectedContact.accountId
      newProject.farmerName=this.selectedContact.name
      newProject.farmerImageUrl=this.selectedContact.imageUrl
      newProject.cropId=this.selectedCrop.cropId
      newProject.startDate=this.formatPeruvianDate(this.startProjectDate)
      newProject.endDate=this.formatPeruvianDate(this.finishProjectDate)
      newProject.specialistId=this.id
      newProject.durationDays=this.calculateDurationDay(this.formatPeruvianDate(this.startProjectDate),this.formatPeruvianDate(this.finishProjectDate))
      newProject.totalActivities=this.taskForProject.length
      newProject.activitiesDone=0
      newProject.projectStarted=this.isProjectStarted()
      newProject.device = this.devices.length > 0;
      console.log(newProject)
      new ProjectApiService().createProject(newProject).then(res=>{
        new ProjectApiService().getProjectsBySpecialistId(newProject.specialistId).then(response=>{
          for (let i = 0; i < response.data.length; i++){
            if(newProject.name===response.data[i].name){
              newProject.id=response.data[i].id
              this.projects.push(newProject)
              //add task as activities
              this.createStorableTaskForProject()
              this.updateProjectIdInDevices(newProject.cropId,response.data[i].id)
              this.createProjectVisible=false
              this.taskStep=false
              this.selectionStep=true
              this.cleanProjectData()
            }
          }
        })

      })
    },
    updateProjectIdInDevices(cropId,projectId){
      new DeviceServices().getFullDeviceInfoByCropId(cropId).then(res=>{
        let deviceList=res.data
        for (let i = 0; i < deviceList.length; i++) {
          let tempDevice=deviceList[i]
          tempDevice.projectId=projectId
          console.log(tempDevice)
          new DeviceServices().updateDeviceById(tempDevice).then(r=>{

          })
        }

      })
    },
    createStorableTaskForProject(){
      let tempStorableTaskList=[]
      for (let i = 0; i < this.taskForProject.length; i++) {
        let tempStorableTask={}
        tempStorableTask.id=i+1
        tempStorableTask.projectId=this.projects[this.projects.length-1].id//project.id
        tempStorableTask.title=this.taskForProject[i].name
        tempStorableTask.description=this.taskForProject[i].description
        tempStorableTask.date=this.formatPeruvianDate(this.taskForProject[i].date)
        tempStorableTask.completed=false
        tempStorableTaskList.push(tempStorableTask)
      }
      this.uploadTaskAsActivities(tempStorableTaskList)
    },
    uploadTaskAsActivities(tempStorableTaskList){
      for (let i = 0; i < tempStorableTaskList.length; i++) {
        new ActivitiesApiService().addActivity(tempStorableTaskList[i]).then(res=>{
        })
      }

    },
    isProjectStarted() {
      // Obtiene la fecha actual
      const currentDate = new Date();

      // Compara currentDate con startProjectDate
      if (currentDate >= this.startProjectDate) {
        // La fecha actual es igual o posterior a startProjectDate
        return true;
      } else {
        // La fecha actual es anterior a startProjectDate
        return false;
      }
    },
    addProjectStepNext(){
      this.isNextButtonDisable=true
      if(this.dateStep){
        this.dateStep = false
        this.taskStep=true
      }
      if(this.informationStep){
        this.informationStep = false
        this.dateStep = true
      }
      if(this.selectionStep){
        if(this.stepContactSelected){
          if(this.projectName !== ""&&this.projectDescription!== ""){
            this.isNextButtonDisable=false
          }
          new DeviceServices().getDeviceInfoByCropId(this.selectedCrop.cropId).then(res=>{
            this.devices=res.data
            console.log(this.devices.length)
            this.selectionStep=false
            this.informationStep=true
          })
        }
        else{
          if(this.selectedContact!==null){
            this.isNextButtonDisable=true
          }
          this.stepContactSelected=true

        }
      }
    },
    addProjectStepPrevious(){
      if(this.selectionStep){
        if(this.stepContactSelected===false){
          this.createProjectVisible=false
          this.cleanProjectData
        }
        else{
          if(this.selectedContact!==null){
            this.isNextButtonDisable=false
          }
          this.stepContactSelected=false
        }
      }
      if(this.informationStep){
        if(this.selectedCrop!==null){
          this.isNextButtonDisable=false
        }
        this.informationStep=false
        this.selectionStep=true
      }
      if(this.dateStep){
        if(this.projectName !== "" && this.projectDescription !== ""){
          this.isNextButtonDisable=false
        }
        this.informationStep=true
        this.dateStep=false
      }
      if(this.taskStep){
        if(this.startProjectDate !== null && this.finishProjectDate !== null){
          this.isNextButtonDisable=false
        }
        this.dateStep=true
        this.taskStep=false
      }
    },
    formatCardDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}`;
    },
    formatPeruvianDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    addTask(){
      let newTask= {}
      newTask.id=this.taskForProject.length+1
      newTask.name=this.taskName
      newTask.description=this.taskDescription
      newTask.date=this.activityProjectDate
      if(this.isTaskUnique(newTask)){
        this.taskForProject.push(newTask)
      }else {
        this.$toast.add({severity:'error', summary: 'Repeated task ', detail:'You have entered a repeated task on the same day', life: 3000});
      }
      this.taskName=""
      this.taskDescription=""
      this.activityProjectDate=null
      this.isAddTaskButtonDisable=true
      this.isCreateProjectButtonDisable=false
    },
    isTaskUnique(task) {
      // Verifica si existe algún elemento en el arreglo con el mismo name y date
      return !this.taskForProject.some(existingTask => {
        return (
            existingTask.name === task.name &&
            existingTask.date.getTime() === task.date.getTime()
        );
      });
    },
    deleteTask(id) {
      if(this.taskForProject.length===1){
        this.isCreateProjectButtonDisable=true
      }
      // Filtrar el arreglo para excluir el elemento con el ID proporcionado
      this.taskForProject = this.taskForProject.filter(task => task.id !== id);
    },
    getCropForProject(){
      this.currentCropsForFarmer=[]
      this.isNextButtonDisable=false

      new CropServices().getCropsByFarmerId(this.token,this.selectedContact.accountId).then(response=>{
        let cropsForFarmer=response.data
        for (let i = 0; i < cropsForFarmer.length; i++) {
          new ProjectApiService().getProjectByFarmerId(this.selectedContact.accountId).then(res=>{
            let projects=res.data
            if(cropsForFarmer[i].specialistId===this.id){
              if(projects.length>0){
                for (let j = 0; j < projects.length; j++) {
                  if(projects[j].cropId!==cropsForFarmer[i].id){
                    let storableCropAndPlantInfo={}
                    new PlantServices().getPlantInfoById(cropsForFarmer[i].plantId).then(res=>{
                      storableCropAndPlantInfo=res.data
                      storableCropAndPlantInfo.cropId=cropsForFarmer[i].id
                      this.currentCropsForFarmer.push(storableCropAndPlantInfo)
                    })
                  }
                }
              }else {
                let storableCropAndPlantInfo={}
                new PlantServices().getPlantInfoById(cropsForFarmer[i].plantId).then(res=>{
                  storableCropAndPlantInfo=res.data
                  storableCropAndPlantInfo.cropId=cropsForFarmer[i].id
                  this.currentCropsForFarmer.push(storableCropAndPlantInfo)
                })
              }
            }
          })

        }
      })
    },
    cleanProjectData(){
      this.devices=[]
      this.selectedContact=null
      this.selectedCrop=null
      this.projectName=""
      this.projectDescription=""
      this.startProjectDate=null
      this.finishProjectDate=null
      this.activityProjectDate=null
      this.taskName=""
      this.taskDescription=""
      this.taskForProject=[]
    },
    createProject(){
      this.cleanProjectData()
      this.isAddTaskButtonDisable=true
      this.isCreateProjectButtonDisable=true
      this.isNextButtonDisable=true
      this.informationStep=false
      this.dateStep=false
      this.taskStep=false
      this.selectionStep=true
      this.stepContactSelected=false
      this.currentContactForSpecialist=[]
      new ContactServices().getContactsForSpecialist(this.id).then(response=>{
        let rawContact=response.data
        for (let i = 0; i < rawContact.length; i++) {
          new UserServices().getUserById(rawContact[i].farmerId).then(response=>{
            this.currentContactForSpecialist.push(response.data)
          })
        }
        this.createProjectVisible=!this.createProjectVisible
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
    setFarmerDataToProject(){
      for (let i = 0; i < this.projects.length; i++) {
        new UserServices().getUserById(this.projects[i].farmerId).then(response=>{
          this.projects[i].farmerName=response.data.name
          this.projects[i].farmerImageUrl=response.data.imageUrl
        })
      }

    },
    showProjectDetail(project){
      this.getCropInfo(project.cropId)
      this.currentProjectDetail=project
      this.projectDetailsDialogVisible=!this.projectDetailsDialogVisible
    },
    getStatusProject(status){
      switch (status) {
        case true:
          return 'Started';

        case false:
          return 'Pending';
      }
    },
    openActivities(project){
      this.activitiesDialogVisible=!this.activitiesDialogVisible
      new ActivitiesApiService().getActivitiesByProjectId(this.token,project.id).then(response=>{
        this.currentActivities=response.data
      })
    },
    getCropInfo(cropId){
      new CropServices().getCropInfoById(this.token,cropId).then(response=>{
        new PlantServices().getPlantInfoById(response.data.plantId).then(resp=>{
          this.currentCropForProject=resp.data
        })
      })
    }
  },
}
</script>

<style scoped>
.task-grid {
  margin-top: 1rem;
  margin-right: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); /* Ajusta el ancho de las columnas según tus necesidades */
  gap: 10px; /* Espacio entre las tarjetas */
  max-height: 200px; /* Establece la altura máxima según tus necesidades */
  overflow-y: auto; /* Habilita el desplazamiento vertical */
}
.task-icon {
  max-height: 70px;
  position: relative;
  border-radius: 5px;
  background-color: black;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  text-align: center;
  transition: transform 0.3s;
}

.task-icon:hover {
  transform: scale(1.05); /* Agranda la tarjeta al pasar el mouse */
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1; /* Asegura que el contenido esté sobre la capa negra */
}

.calendar-day {
  font-size: 20px;
  font-weight: bold;
}

.task-name {
  font-size: 10px;
  margin-top: 5px;
}

.delete-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2; /* Asegura que el texto esté sobre la capa negra */
  font-size: 12px;
  opacity: 0;
}

.task-icon:hover .delete-text {
  cursor: pointer;
  opacity: 1; /* Muestra el texto "Eliminar" al pasar el mouse */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Color negro con opacidad */
  border-radius: 5px;
  z-index: 0; /* Asegura que esté detrás del contenido */
  opacity: 0; /* Inicialmente transparente */
  transition: opacity 0.3s;
}

.task-icon:hover .overlay {
  opacity: 1; /* Muestra la capa negra al pasar el mouse */
}



/* Ajusta los estilos según tus preferencias */


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

.chat-card {
  display: flex;
  align-items: center;
  background-color: #1c1c1c; /* Color de fondo negro */
  color: white; /* Color de texto blanco */
  border-radius: 10px; /* Bordes redondos */
  margin-bottom: 10px; /* Espaciado entre tarjetas */
}

.profile-image {
  width: 50px; /* Ancho de la imagen de perfil */
  height: 50px; /* Alto de la imagen de perfil */
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
}

.chat-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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