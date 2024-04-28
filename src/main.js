import router from './router/index.js'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue'
import App from './App.vue'


//PrimeVue Styles
import "primevue/resources/themes/arya-green/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"

import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Tag from 'primevue/tag';
import Slider from 'primevue/slider';
import ProgressBar from 'primevue/progressbar';
import Checkbox from 'primevue/checkbox';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';
import Tooltip from 'primevue/tooltip';

const vueApp  = createApp(App)

vueApp.use(PrimeVue);
vueApp.use(router)
vueApp.use(ToastService);
vueApp.directive('tooltip', Tooltip);
vueApp.component("pv-button",Button)
vueApp.component("pv-avatar",Avatar)
vueApp.component("pv-autoComplete",AutoComplete)
vueApp.component("pv-card",Card)
vueApp.component("pv-input",InputText)
vueApp.component("pv-dropdown",Dropdown)
vueApp.component("pv-dialog",Dialog)
vueApp.component("pv-dataTable",DataTable)
vueApp.component("pv-column",Column)
vueApp.component("pv-columnGroup",ColumnGroup)
vueApp.component("pv-row",Row)
vueApp.component("pv-tag",Tag)
vueApp.component("pv-slider",Slider)
vueApp.component("pv-progressBar",ProgressBar)
vueApp.component("pv-checkbox",Checkbox)
vueApp.component("pv-accordion",Accordion)
vueApp.component("pv-accordionTab",AccordionTab)
vueApp.component("pv-inputSwitch",InputSwitch)
vueApp.component("pv-textArea",Textarea)
vueApp.component("pv-calendar",Calendar)
vueApp.component("pv-toast",Toast)
vueApp.component("pv-fileUpload",FileUpload)


vueApp.mount('#app')
