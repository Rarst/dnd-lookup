import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
  })
}

createApp(App).mount('#app')
