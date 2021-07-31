import { createApp } from "vue";
import router from "./router";
import store from "./store";
import "./index.scss";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Panel from "primevue/panel";
import ScrollPanel from "primevue/scrollpanel";
import ProgressSpinner from "primevue/progressspinner";
import App from "./App.vue";
import OverlayPanel from "primevue/overlaypanel";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import Steps from "primevue/steps";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Galleria from "primevue/galleria";
import ToastService from "primevue/toastservice";
import Textarea from "primevue/textarea";
import infiniteScroll from "vue-infinite-scroll";
import md from "markdown-it";

createApp(App)
  .use(router)
  .use(store)
  .use(md)
  .use(infiniteScroll)
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .directive("tooltip", Tooltip)
  .component("InputText", InputText)
  .component("InputNumber", InputNumber)
  .component("Textarea",Textarea)
  .component("Card", Card)
  .component("Button", Button)
  .component("Panel", Panel)
  .component("OverlayPanel", OverlayPanel)
  .component("ScrollPanel", ScrollPanel)
  .component("Steps", Steps)
  .component("ProgressSpinner", ProgressSpinner)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("ColumnGroup", ColumnGroup)
  .component("TabView", TabView)
  .component("TabPanel", TabPanel)
  .component("Galleria", Galleria)
  .mount("#app");
