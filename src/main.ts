import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)

app.mount('#app')
