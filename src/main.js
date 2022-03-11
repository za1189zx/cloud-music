import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

// 引入 tailwind css
import 'tailwindcss/tailwind.css'
import '@/assets/tailwimd.layer.css'
// 引入 vant
import { Toast, Loading } from 'vant'
// 引入 antDesign
import { antD } from '@/antD'
// 引入 emoji 映射
import { emojiMap } from '@/assets/emoji.js'
// 引入自定义指令
import directive from '@/directive'
// 引入自定义滚动条组件
import CScrollbar from 'c-scrollbar'

const app = createApp(App)

// eslint-disable-next-line no-undef
app.config.globalProperties.dayjs = dayjs
app.config.globalProperties.emojiMap = emojiMap
app.config.unwrapInjectedRef = true
app.use(Toast).use(Loading).use(antD).use(directive).use(CScrollbar)

app.use(store).use(router).mount('#app')
