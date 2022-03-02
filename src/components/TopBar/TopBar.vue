<template>
  <div class="w-full h-16 bg-red-600">
    <!-- 版心 -->
    <div class="max-w-6xl h-full mx-auto pl-4 flex items-center justify-between relative">
      <!-- 左边 -->
      <div class="flex items-center">
        <!-- logo -->
        <router-link to="/" class="logo w-40 sm:w-8 md:w-40 h-8 block bg-no-repeat" :style="bgTopBar"></router-link>
        <!-- 搜索框 -->
        <div class="hidden sm:flex w-56 h-8 ml-8 pl-3 bg-red-900 rounded-full text-gray-300">
          <!-- 输入框 -->
          <input
            type="text"
            class="w-44 bg-transparent outline-none text-xs placeholder-red-400"
            placeholder="搜索音乐，视频，歌词，电台"
            v-model="search"
          />
          <!-- 搜素按钮 -->
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center hover:text-white"
            @click="$store.dispatch('verifyCaptcha')"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M756.565333 697.258667c2.133333 1.493333 4.224 3.157333 6.101334 5.12l241.664 241.621333c16.256 16.256 16.512 43.52-0.128 60.16a42.453333 42.453333 0 0 1-60.202667 0.170667l-241.664-241.664a41.429333 41.429333 0 0 1-5.034667-6.101334A424.917333 424.917333 0 0 1 426.666667 853.333333C191.018667 853.333333 0 662.314667 0 426.666667S191.018667 0 426.666667 0s426.666667 191.018667 426.666666 426.666667c0 102.698667-36.266667 196.949333-96.768 270.592zM426.666667 768a341.333333 341.333333 0 1 0 0-682.666667 341.333333 341.333333 0 0 0 0 682.666667z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <!-- 中间 -->
      <div class="hidden sm:flex w-full h-full items-center justify-center">
        <router-link to="" class="h-full px-4 flex items-center text-sm text-red-100 hover:text-white hover:bg-red-800"
          >发现音乐</router-link
        >
        <router-link to="" class="h-full px-4 flex items-center text-sm text-red-100 hover:text-white hover:bg-red-800"
          >我的音乐</router-link
        >
        <router-link to="" class="h-full px-4 flex items-center text-sm text-red-100 hover:text-white hover:bg-red-800"
          >关注</router-link
        >
      </div>
      <!-- 右边 -->
      <div class="hidden sm:flex h-full items-center">
        <!-- 头像 -->
        <div
          v-if="isLogin"
          class="w-16 mr-4 h-full flex items-center justify-center"
          @mouseenter="showDropdown = true"
          @mouseleave="showDropdown = false"
        >
          <img class="w-8 h-8 rounded-full" :src="$store.state.userInfo.avatarUrl + '?param=48y48'" />
          <i v-show="showDropdown" class="w-3 h-3 bg-gray-800 absolute top-13 transform rotate-45"></i>
          <UserDropDown v-show="showDropdown" @hideList="showDropdown = false" />
        </div>
        <!-- 登录按钮 -->
        <Login v-else></Login>
      </div>
      <div class="w-20 sm:hidden mr-4 sm:mr-8">
        <a
          href="https://music.163.com/api/package/download/deeplink"
          class="w-20 h-9 flex items-center justify-center rounded-full bg-white text-red-600"
          >下载APP</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import UserDropDown from '@/components/TopBar/UserDropDown/UserDropDown.vue'
import Login from '@/components/Login/Login.vue'

export default {
  data() {
    return {
      bgTopBar: `background-image : url(${require('@/assets/sprite/topbar.png')})`,
      search: '',
      showDropdown: false
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    }
  },
  methods: {
    async logout() {
      api.logout()
      this.$store.commit('setUserInfo', null)
    }
  },
  components: {
    UserDropDown,
    Login
  }
}
</script>

<style scoped>
.logo {
  background-position: 0 -19px;
}
</style>
