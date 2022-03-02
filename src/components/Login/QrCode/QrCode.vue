<template>
  <div class="w-45 h-50 relative flex flex-col items-center">
    <!-- 二维码错误/加载中 -->
    <div
      v-if="!qrImg || needToRefresh"
      class="w-45 h-45 absolute top-0 left-0 flex items-center justify-center bg-white bg-opacity-90"
    >
      <!-- 加载中 -->
      <van-loading size="48" v-if="!qrImg && !needToRefresh" vertical>努力加载中…</van-loading>
      <!-- 错误 -->
      <div v-if="needToRefresh" class="h-16 flex flex-col items-center justify-between">
        <div class="text-sm">{{ needToRefresh }}</div>
        <a-button type="primary" size="mini" @click="init" :disabled="needToRefresh === '网络故障'">点击刷新</a-button>
      </div>
    </div>
    <!-- 二维码 -->
    <canvas ref="canvas" width="180" height="180"></canvas>
    <!-- 文字指引 -->
    <div class="text-sm">
      使用<a class="text-blue-500 hover:underline" href="https://music.163.com/#/download" target="_blank">网易云app</a>扫码登录
    </div>
  </div>
</template>

<script>
import { errorInfo } from '@/utils'
import api from '@/api'

export default {
  data() {
    return {
      needToRefresh: '',
      qrImg: '',
      timer: null
    }
  },
  watch: {
    qrImg(newVal) {
      if (newVal) this.createQrCode(newVal)
    }
  },
  methods: {
    createQrCode(src) {
      const img = new Image()
      img.src = src
      this.$nextTick(() => {
        this.$refs.canvas.getContext('2d').drawImage(img, 0, 0)
      })
    },
    init() {
      this.needToRefresh = ''
      this.loginByQrCode().catch(err => {
        this.needToRefresh = errorInfo(err)
      })
    },
    // 扫描二维码登录
    async loginByQrCode() {
      const { data: res } = await api.getQrKey()
      if (res.code !== 200 || res.data.code !== 200) return (this.needToRefresh = '请求失败')
      const key = res.data.unikey
      const { data: res2 } = await api.getQrImg(key)
      if (res2.code !== 200) return (this.needToRefresh = '请求失败')
      this.qrImg = res2.data.qrimg
      this.timer = setInterval(async () => {
        const { data: status } = await api.checkQrStatus(key)
        if (status.code === 800) {
          clearInterval(this.timer)
          this.needToRefresh = '二维码已失效'
        } else if (status.code === 803) {
          clearInterval(this.timer)
          this.$store.dispatch('init')
        }
      }, 2000)
    }
  },
  created() {
    this.init()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
