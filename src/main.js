import Vue from 'vue'
import app from './app.vue'
import {router} from './router'
import {store} from './store/store'
import './assets/styles/main.scss'
import draggable from 'vuedraggable'
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import VueDragscroll from 'vue-dragscroll'
import TextareaAutosize from 'vue-textarea-autosize'
import "@lottiefiles/lottie-player";

Vue.use(TextareaAutosize)
Vue.use(VueDragscroll)
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  draggable,
  render: h => h(app)
}).$mount('#app')


