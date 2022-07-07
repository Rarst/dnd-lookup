import { createApp } from "vue";
import App from "./App.vue";
import ItemHeader from "./components/ItemHeader.vue";
import ItemLink from "./components/ItemLink.vue";
import LinksSection from "./components/LinksSection.vue";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

const app = createApp(App);

app.component("ItemHeader", ItemHeader);
app.component("ItemLink", ItemLink);
app.component("LinksSection", LinksSection);

app.mount("#app");
