import { createApp } from 'vue'
//import VueRuter from 'vue-router'o
import App from './App.vue'
//import { loadFonts } from './plugins/webfontloader'
import ElementPlus from 'element-plus'
import IconVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

//loadFonts()

createApp(App)
    .use(ElementPlus)
    .use(IconVue)
    .mount('#app')
