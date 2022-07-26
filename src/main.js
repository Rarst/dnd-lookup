import { createApp } from "vue";
import App from "./App.vue";
import { ViteSSG } from "vite-ssg/single-page";
import ItemHeader from "./components/ItemHeader.vue";
import ItemLink from "./components/ItemLink.vue";
import LinksSection from "./components/LinksSection.vue";
import Markdown from "./components/Markdown.vue";
import "./index.css";

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

const app = createApp(App);

// recognition works
const Vue = app;
Vue.component("ItemHeader", ItemHeader);

// recognition doesn't work
app.component("ItemLink", ItemLink);
app.component("LinksSection", LinksSection);
app.component("Markdown", Markdown);
