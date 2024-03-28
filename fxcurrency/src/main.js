import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import "@/assets/css/reset.css";
import "@/assets/css/global.css";
import "@/assets/css/componentsGlobal.css";
import "@/assets/css/colorGlobal.css";
import "@/assets/css/display.css";
import "@/assets/css/element.css";
import "animate.css";

const app = createApp(App);

import { fnToDoDirective } from "@/common/directiveCommon";
fnToDoDirective(app);

app.use(i18n).use(store).use(router).mount("#app");
