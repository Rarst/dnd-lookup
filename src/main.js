import { createApp } from "vue";
import App from "./App.vue";
import ItemHeader from "./components/ItemHeader.vue";
import ItemLink from "./components/ItemLink.vue";
import LinksSection from "./components/LinksSection.vue";
import Markdown from "./components/Markdown.vue";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

const Vue = createApp(App);

Vue.component("ItemHeader", ItemHeader);
Vue.component("ItemLink", ItemLink);
Vue.component("LinksSection", LinksSection);
Vue.component("Markdown", Markdown);

Vue.mount("#app");
