<template>
  <div
    class="backdrop-filter backdrop-blur-sm w-full h-12 border-t border-b border-black fixed bottom-0 bg-opacity-80 bg-gray-900 z-50"
  >
    <!-- 版心 -->
    <div class="max-w-6xl h-full mx-auto px-14 flex items-center justify-between">
      <!-- 左侧按钮组 -->
      <div class="w-28 h-9 flex items-center justify-between">
        <!-- 上一首按钮 -->
        <button class="prev w-7 h-7 rounded-full bg-no-repeat" :style="bgPlayBar"></button>
        <!-- 播放/暂停按钮 -->
        <button class="w-9 h-9 rounded-full bg-no-repeat" :class="`${isPlaying ? 'stop' : 'play'}`" :style="bgPlayBar"></button>
        <!-- 下一首按钮 -->
        <button class="next w-7 h-7 rounded-full bg-no-repeat" :style="bgPlayBar"></button>
      </div>
      <!-- 中间播发进度 -->
      <div class="w-96 lg:w-136 h-9 flex items-center justify-center md:justify-between">
        <!-- 封面缩略图 -->
        <div class="mask hidden md:block w-9 h-9 pr-px pb-px cursor-pointer" :style="bgPlayBar">
          <img src="" class="h-full mr-px" />
        </div>
        <!-- 播放进度条 -->
        <!-- 条 -->
        <div class="w-10/12 md:w-2/3 h-2 bg-black rounded-full cursor-pointer">
          <!-- 进度 -->
          <div class="w-1/2 h-full flex items-center justify-end bg-red-700 rounded-full">
            <!-- 进度点 -->
            <div class="w-4 h-4 transform translate-x-1/2 bg-white rounded-full flex items-center justify-center">
              <div class="w-1.5 h-1.5 bg-red-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <!-- 时间进度表 -->
        <div class="hidden md:block w-18 h-9 leading-9 text-xs text-center text-gray-300">00:00/00:00</div>
      </div>
      <!-- 右侧按钮组 -->
      <div class="w-28 h-6 flex items-center justify-between">
        <!-- 音量按钮 -->
        <div class="w-6 h-6 cursor-pointer" :class="`volume${isSilent ? '-silent' : ''}`" :style="bgPlayBar"></div>
        <!-- 播放模式按钮 -->
        <div class="w-6 h-6 cursor-pointer" :class="`play-mode-${playmode}`" :style="bgPlayBar"></div>
        <!-- 播放列表按钮 -->
        <div class="play-list w-15 h-6 cursor-pointer" :style="bgPlayBar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgPlayBar: `background-image : url(${require('@/assets/sprite/playbar.png')})`,
      isPlaying: false,
      isSilent: false,
      playmode: 'random'
    }
  }
}
</script>

<style lang="less" scoped>
.prev {
  background-position: 0 -130px;
  &:hover {
    background-position: -30px -130px;
  }
}
.play {
  background-position: 0 -204px;
  &:hover {
    background-position: -40px -204px;
  }
}
.stop {
  background-position: 0 -165px;
  &:hover {
    background-position: -40px -165px;
  }
}
.next {
  background-position: -80px -130px;
  &:hover {
    background-position: -110px -130px;
  }
}
.mask {
  background-position: 0 -80px;
}
.volume {
  background-position: -3px -248px;
  &:hover {
    background-position: -32px -248px;
  }
}
.volume-silent {
  background-position: -104px -69px;
  &:hover {
    background-position: -126px -69px;
  }
}
.play-mode-random {
  background-position: -67px -248px;
  &:hover {
    background-position: -94px -248px;
  }
}
.play-mode-cycle {
  background-position: -3px -344px;
  &:hover {
    background-position: -33px -344px;
  }
}
.play-mode-single {
  background-position: -67px -344px;
  &:hover {
    background-position: -94px -344px;
  }
}
.play-list {
  background-position: -42px -70px;
  &:hover {
    background-position: -42px -100px;
  }
}
</style>
