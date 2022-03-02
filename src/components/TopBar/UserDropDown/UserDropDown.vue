<template>
  <ul class="w-36 absolute top-14 right-0 rounded-lg bg-gray-800 overflow-hidden z-10">
    <li v-for="item in dropdownList" :key="item.label" class="h-9 hover:bg-gray-700" @click="$emit('hideList')">
      <router-link
        :to="item.linkTo"
        class="pl-2 w-full h-full flex items-center text-xs text-gray-300 hover:text-gray-50"
        @click="item.logout && logout()"
      >
        <span
          class="w-5 h-5 mx-1"
          :style="`background: url(${require('@/assets/sprite/toplist.png')}) ${item.iconPos} no-repeat`"
        ></span>
        <span>{{ item.label }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      dropdownIcon: `background-image: url(${require('@/assets/sprite/toplist.png')})`,
      dropdownList: [
        { iconPos: '0 -79px', label: '我的主页', linkTo: '' },
        { iconPos: '-20px -119px', label: '我的消息', linkTo: '' },
        { iconPos: '0 -99px', label: '我的等级', linkTo: '' },
        { iconPos: '0 -219px', label: 'VIP会员', linkTo: '' },
        { iconPos: '0 -139px', label: '个人设置', linkTo: '' },
        {
          iconPos: '0 -199px',
          label: '退出',
          linkTo: '',
          logout: true
        }
      ]
    }
  },
  methods: {
    logout() {
      api.logout()
      this.$store.commit('setUserInfo', null)
    }
  }
}
</script>

<style scoped>
.mine {
  background-position: 0 -79px;
}
</style>
