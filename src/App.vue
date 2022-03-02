<template>
  <div class="h-screen overflow-scroll">
    <!-- 顶部栏 -->
    <TopBar />
    <!-- toTop 按钮 -->
    <a-back-top v-if="windowWidth >= 1280" class="rounded-md bg-gray-800 bg-opacity-60 flex-center flex-col">
      <!-- 箭头 -->
      <i class="w-2 h-2 block border-t border-l border-white transform rotate-45"></i>
      <!--Top 文字 -->
      <span class="leading-4 text-gray-100">Top</span>
    </a-back-top>
    <!-- 延迟加载 -->
    <div v-if="$store.state.network && $store.state.initialized" class="bg-gray-50">
      <!-- 路由菜单 -->
      <RouterBar :windowWidth="windowWidth" />
      <!-- 路由页面 -->
      <router-view v-if="isRouterShow"></router-view>
      <!-- Footer -->
      <Footer />
      <!-- 播放栏 -->
      <PlayBar v-if="windowWidth >= 640" class="fixed bottom-0" />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar/TopBar.vue'
import RouterBar from '@/components/RouterBar/RouterBar.vue'
import PlayBar from '@/components/PlayBar/PlayBar.vue'
import { computed } from 'vue'
import Footer from './components/Footer/Footer.vue'

export default {
  data() {
    return {
      windowWidth: document.documentElement.clientWidth,
      isRouterShow: true
    }
  },
  methods: {
    async reload() {
      this.isRouterShow = false
      await this.$nextTick()
      this.isRouterShow = true
    }
  },
  watch: {
    '$store.state.isLogin'() {
      this.reload()
    }
  },
  provide() {
    return {
      windowWidth: computed(() => this.windowWidth)
    }
  },
  created() {
    this.$store.dispatch('init')
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  },
  components: {
    TopBar,
    RouterBar,
    PlayBar,
    Footer
  }
}
</script>

<style>
:root {
  --el-color-primary: #dc2626;
  --my-blur: 10px;
  --my-line-clamp: 2;
}

.my-blur::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: blur(var(--my-blur));
  background: inherit;
  background-attachment: fixed;
  background-size: cover;
  z-index: 0;
}

.square::after {
  content: '';
  display: block;
  margin-top: 100%;
}

.webkit-box {
  display: -webkit-box;
  -webkit-line-clamp: var(--my-line-clamp);
  -webkit-box-orient: vertical;
}

.line-1 {
  --my-line-clamp: 1;
}

.emoji {
  display: inline;
  width: 21px;
  height: 21px;
}

.clearfix:after,
.clearfix:before {
  content: '';
  display: table;
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
</style>
