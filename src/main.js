import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/main.css'

const app = createApp(App)

store.init()

app.use(router)

app.mount('#app')
