<template>
  <a
    class="w-8 h-8 mr-8 leading-8 text-red-200 cursor-pointer hover:text-white hover:underline"
    @click="$store.commit('toLogin', true)"
    >登录</a
  >
  <!-- 遮罩层 -->
  <a-modal
    centered
    destroyOnClose
    :footer="null"
    title="登录"
    :maskClosable="false"
    :maskStyle="{ 'background-color': 'transparent' }"
    :bodyStyle="{ padding: 0 }"
    width="420px"
    :visible="$store.state.toLogin"
    :z-index="2000"
    @cancel="$store.commit('toLogin', false)"
  >
    <!-- 手机登录页 -->
    <div class="w-full h-70 px-16 relative flex items-end justify-center" v-if="!useQrCode">
      <LoginForm></LoginForm>
      <!-- 右下角标 -->
      <div class="w-13 h-13 absolute right-0 bottom-0 cursor-pointer" :style="qrLoginIcon" @click="useQrCode = true"></div>
    </div>
    <!-- 二维码登录页 -->
    <div class="w-full h-70 flex flex-col items-center justify-around" v-if="useQrCode">
      <div class="w-full h-50 flex items-center justify-center">
        <QrCode></QrCode>
      </div>
      <div
        class="w-32 h-6 rounded-full border border-gray-700 text-xs text-center leading-6 cursor-pointer"
        @click="useQrCode = false"
      >
        选择手机登录模式
      </div>
    </div>
  </a-modal>
</template>

<script>
import QrCode from '@/components/Login/QrCode/QrCode.vue'
import LoginForm from '@/components/Login/LoginForm/LoginForm.vue'

export default {
  data() {
    return {
      qrLoginIcon: `background : url(${require('@/assets/img/qr_login_icon.png')}) 0 0 / cover no-repeat`,
      useQrCode: false
    }
  },
  components: {
    QrCode,
    LoginForm
  }
}
</script>

<style>
.ant-modal-header {
  user-select: none;
}
</style>
