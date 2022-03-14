<template>
  <div
    class="backdrop-filter backdrop-blur-sm w-full h-12 border-t border-b border-black fixed bottom-0 bg-opacity-80 bg-gray-900 z-50"
  >
    <!-- 版心 -->
    <div class="max-w-5xl h-full mx-auto flex items-center justify-between relative">
      <!-- 左侧按钮组 -->
      <div class="w-28 h-9 ml-14 flex items-center justify-between">
        <!-- 上一首按钮 -->
        <button class="prev w-7 h-7 rounded-full bg-no-repeat" :style="bgPlayBar" @click="prevSong"></button>
        <!-- 播放/暂停按钮 -->
        <button
          class="w-9 h-9 rounded-full bg-no-repeat"
          :class="`${isPlaying ? 'stop' : 'play'}`"
          :style="bgPlayBar"
          @click="playSwitch"
        ></button>
        <!-- 下一首按钮 -->
        <button class="next w-7 h-7 rounded-full bg-no-repeat" :style="bgPlayBar" @click="nextSong"></button>
      </div>
      <!-- 中间播发进度 -->
      <div class="w-96 lg:w-136 h-9 flex items-center justify-center md:justify-between">
        <!-- 封面缩略图 -->
        <div class="hidden md:block w-9 h-9 pr-0.5 pb-0.5 relative">
          <img :src="currentSong ? currentSong.al.picUrl + '?param=34y34' : ''" class="h-full" />
          <div v-if="!currentSong" class="mask w-full h-full absolute top-0 z-10" :style="bgPlayBar"></div>
          <router-link v-else to="" class="mask w-full h-full absolute top-0 z-10" :style="bgPlayBar"></router-link>
        </div>
        <!-- 播放进度条 -->
        <!-- 条 -->
        <div class="w-10/12 md:w-2/3 h-2 bg-black rounded-full" @mousedown="changeProgressHandler" ref="progressBar">
          <!-- 进度 -->
          <div
            class="h-full flex items-center justify-end bg-red-700 rounded-full relative"
            :style="`width: ${currentProgress}%`"
          >
            <!-- 进度点 -->
            <button
              class="w-4 h-4 transform translate-x-1/2 bg-white rounded-full flex items-center justify-center absolute"
              @mousedown.stop="clickBlockHandler"
            >
              <div class="w-1.5 h-1.5 bg-red-700 rounded-full"></div>
            </button>
          </div>
        </div>
        <!-- 时间进度表 -->
        <div class="hidden md:block w-18 h-9 leading-9 text-xs text-center text-gray-300">
          {{ currentTime }}/{{ dayjs(currentDt).format('mm:ss') }}
        </div>
      </div>
      <!-- 右侧按钮组 -->
      <div class="w-28 h-6 mr-14 flex items-center justify-between">
        <div class="relative">
          <!-- 音量按钮 -->
          <div
            class="w-6 h-6 cursor-pointer"
            :class="`${volume ? 'volume' : 'muted'}`"
            :style="bgPlayBar"
            @click="showVolumeBar = !showVolumeBar"
          ></div>
          <!-- 音量拉条 -->
          <div
            v-if="showVolumeBar"
            v-clickoutside.parent="() => (showVolumeBar = false)"
            class="w-6 h-32 px-2 pt-5 absolute -left-0.5 bottom-9 bg-gray-700"
          >
            <!-- 条 -->
            <div
              class="w-2 h-24 rounded-full bg-black flex items-end justify-center"
              ref="volumeBar"
              @mousedown="changeVolumeHandler"
            >
              <!-- 音量 -->
              <div
                class="w-2 flex flex-col items-center justify-start bg-red-700 rounded-full relative"
                :style="`height: ${volume * 100}%`"
              >
                <!-- 拉条点 -->
                <button
                  class="w-4 h-4 transform -translate-y-1/2 bg-white rounded-full flex items-center justify-center absolute"
                  @mousedown.stop="clickVolumeBlockHandler"
                >
                  <div class="w-1.5 h-1.5 bg-red-700 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 播放模式按钮 -->
        <div class="w-6 h-6 cursor-pointer" :class="`play-mode-${playmode}`" :style="bgPlayBar" @click="changePlaymode"></div>
        <!-- 播放列表按钮 -->
        <div
          class="play-list w-15 h-6 pl-5 cursor-pointer text-gray-400 text-center"
          :style="bgPlayBar"
          @click="showBoard = !showBoard"
        >
          {{ tracks && tracks.length ? tracks.length : '' }}
        </div>
      </div>
      <!-- 播放面板 -->
      <div
        v-show="showBoard"
        v-clickoutside.parent="() => (showBoard = false)"
        class="max-w-5xl w-full h-80 rounded-t-lg absolute bottom-11.5 bg-gray-900 overflow-hidden"
      >
        <!-- 头部 -->
        <div class="max-w-5xl w-full h-10 rounded-t-lg border-b border-black text-gray-200 flex bg-gray-900 fixed z-20">
          <!-- 左边 -->
          <div class="h-full flex items-center justify-between flex-grow border-r border-black">
            <span class="ml-6 font-semibold">播放列表{{ tracks && tracks.length ? `(${tracks.length})` : '' }}</span>
            <div class="pr-4 flex items-center gap-3">
              <!-- 收藏全部按钮 -->
              <button class="flex items-center gap-1 fill-gray-200 hover:text-white hover:fill-white">
                <AddFolderIcon class="w-4" />收藏全部
              </button>
              <span class="text-black">|</span>
              <!-- 清除列表按钮 -->
              <button
                class="flex items-center gap-1 fill-gray-200 hover:text-white hover:fill-white"
                @click="$store.commit('cleanTracks')"
              >
                <CleanIcon class="w-4" />清除
              </button>
            </div>
          </div>
          <!-- 右边 -->
          <div class="w-2/5 h-full flex-center relative">
            <div v-if="currentId" class="text-gray-200 text-center">{{ currentSong.name }}</div>
            <button class="w-6 h-6 absolute right-2" @click="showBoard = false">
              <XIcon class="stroke-gray-400" />
            </button>
          </div>
        </div>
        <!-- 盒子 -->
        <div class="pt-10 w-full h-80 flex text-gray-200 bg-center overflow-hidden" :style="bgImage">
          <!-- 左边 -->
          <div class="backdrop-filter backdrop-blur-xl h-70 flex-grow bg-opacity-90 bg-gray-900 text-white">
            <c-scrollbar
              height="100%"
              :vBarStyle="{ 'background-color': 'black' }"
              :vThumbStyle="{ 'background-color': 'rgba(255, 255, 255, 0.2)' }"
            >
              <!--  -->
              <div v-if="!tracks" class="w-full h-70 flex-center bg-gray-900">你还没有添加任何歌曲</div>
              <!-- 列表 -->
              <ul v-if="tracks" class="mb-0">
                <li
                  v-for="item in tracks"
                  :key="item.id"
                  class="h-7 pr-3 flex items-center hover:bg-black text-gray-300 hover:text-white text-xs group cursor-pointer"
                  @click="liClickHandler(item.id)"
                >
                  <!-- 歌名 -->
                  <div class="pl-7 flex-grow truncate">{{ item.name }}</div>
                  <!-- 按钮组 -->
                  <div></div>
                  <!-- 歌手 -->
                  <div class="w-20 mr-4 flex-shrink-0 truncate">
                    <ArtistNames
                      :artists="item.ar"
                      textColor="text-gray-400"
                      hoverColor="text-white"
                      groupHoverColor="text-white"
                      intactTitle
                    />
                  </div>
                  <!-- 歌曲时长 -->
                  <div class="mr-1.5 text-gray-500 group-hover:text-gray-100 font-semibold">
                    {{ dayjs(item.dt).format('mm:ss') }}
                  </div>
                </li>
              </ul>
            </c-scrollbar>
          </div>
          <div class="backdrop-filter backdrop-blur-xl w-2/5 h-full flex-shrink-0 bg-opacity-80 bg-gray-900">
            <c-scrollbar
              height="100%"
              :vBarStyle="{ 'background-color': 'black' }"
              :vThumbStyle="{ 'background-color': 'rgba(255, 255, 255, 0.2)' }"
            >
              <Lyric
                v-if="lrc"
                :lyric="lrc.lyric"
                :tlyric="lrc.tlyric"
                :opened="true"
                beCenter
                :lyricProgress="lyricProgress"
                currentClass="text-gray-200 text-sm"
                class="text-gray-500 text-xs"
                v-model:manualChangeProgress="manualChangeProgress"
              />
            </c-scrollbar>
          </div>
        </div>
      </div>
      <audio
        ref="audio"
        @canplay="canplay = true"
        @timeupdate="timeupdateHandler"
        @ended="nextSong(true)"
        @pause="isPlaying = false"
        @play="isPlaying = true"
        @error="error"
      ></audio>
    </div>
  </div>
</template>

<script>
import AddFolderIcon from '../Icon/AddFolderIcon/AddFolderIcon.vue'
import CleanIcon from '../Icon/CleanIcon/CleanIcon.vue'
import ArtistNames from '../ArtistNames/ArtistNames.vue'
import api from '@/api'
import XIcon from '../Icon/XIcon/XIcon.vue'
import Lyric from '@/components/Lyric/Lyric.vue'

export default {
  data() {
    return {
      bgPlayBar: `background-image : url(${require('@/assets/sprite/playbar.png')})`,
      // 播放状态
      isPlaying: false,
      // 音乐文件是否可播放状态
      canplay: false,
      // 音量
      volume: 1,
      // 音量拉条显示状态
      showVolumeBar: false,
      // 是否可移动进度条滑块
      volumeBlockCanMove: false,
      // 循环模式
      playmode: 'cycle',
      // 播放面板显示状态
      showBoard: false,
      // 当前播放的音乐 id
      currentId: 0,
      // 当前播放的音乐 url
      currentUrl: '',
      // 当前播放的音乐的备用 url
      backupUrl: '',
      // 当前播放的音乐信息
      currentSong: null,
      // 当前播放的音乐时长
      currentDt: 0,
      // 当前播放的音乐时间
      currentTime: '00:00',
      // 当前播放的音乐进度条位置
      currentProgress: 0,
      // 是否可移动进度条滑块
      progressBlockCanMove: false,
      lrc: {
        lyric: '',
        lyricUser: null,
        tlyric: '',
        transUser: null
      },
      lyricProgress: -1,
      manualChangeProgress: false
    }
  },
  computed: {
    // 列表
    tracks() {
      return this.$store.state.moduleAudio.tracks
    },
    bgImage() {
      if (this.currentSong) return `background-image: url(${this.currentSong.al.picUrl + '?param=500y500'})`
      else return ''
    },
    // 播放器
    audio() {
      if (this.$refs.audio) return this.$refs.audio
      else return null
    },
    // 播放队列
    playQueue() {
      if (!this.tracks || !this.currentId) return null
      if (this.playmode === 'random') {
        const que = this.tracks.map((_item, index) => index)
        const randomQue = []
        const length = que.length
        for (var i = 0; i < length; i++) {
          var num = Math.floor(Math.random() * (que.length - 1))
          randomQue.push(que[num])
          que.splice(num, 1)
        }
        return randomQue.map(idx => this.tracks[idx].id)
      } else return this.tracks.map(item => item.id)
    },
    currentIndex() {
      if (!this.playQueue) return -1
      else return this.playQueue.findIndex(id => id === this.currentId)
    }
  },
  watch: {
    async currentId(newId) {
      if (!this.tracks || !newId) return
      this.canplay = false
      this.currentSong = this.tracks.find(item => item.id === newId)
      this.currentDt = Math.floor(this.currentSong.dt / 1000) * 1000
      this.backupUrl = `https://music.163.com/song/media/outer/url?id=${newId}.mp3`
      const [{ data: res1 }, { data: res2 }] = await Promise.all([api.getSongUrl(newId), api.getLyric(newId)])
      if (res1.code === 200 && res1.data[0].url) this.currentUrl = res1.data[0].url
      else this.currentUrl = this.backupUrl
      this.audio.src = this.currentUrl
      if (res2.code === 200) {
        res2.lrc.lyric && (this.lrc.lyric = res2.lrc.lyric)
        res2.lyricUser && (this.lrc.lyricUser = res2.lyricUser)
        res2.tlyric && (this.lrc.tlyric = res2.tlyric.lyric)
        res2.transUser && (this.lrc.transUser = res2.transUser)
      }
    },
    canplay(val) {
      if (val) {
        this.audio.play()
        this.volume = this.audio.volume
      }
    },
    '$store.state.moduleAudio.toPlayId': {
      handler(id) {
        if (id) {
          this.liClickHandler(id)
          this.$store.commit('toPlay')
        }
      },
      immediate: true
    }
  },
  methods: {
    error() {
      if (this.audio.error.code === 4 && this.currentSong.fee === 4) {
        this.resetCurrent()
        this.$toast('数字专辑请前往官方购买渠道')
      }
    },
    timeupdateHandler(e) {
      if (this.progressBlockCanMove) return
      const sec = Math.floor(e.target.currentTime)
      const progress = (sec * 100000) / this.currentDt
      this.lyricProgress = e.target.currentTime.toFixed(2) - 0
      this.currentProgress = progress
      this.currentTime = this.dayjs(0).second(sec).format('mm:ss')
    },
    getPos(bar, dir) {
      const e = window.event
      const pos = bar.getBoundingClientRect()
      let direction
      let divPos
      let div
      if (dir === 'x') {
        direction = e.pageX
        divPos = pos.left
        div = pos.width
      } else if (dir === 'y') {
        direction = e.pageY
        divPos = pos.top
        div = pos.height
      } else return 0
      let offset = direction - divPos
      if (direction < divPos) offset = 0
      else if (offset > div) offset = div
      return offset / div
    },
    // 音量条点击事件
    changeVolumeHandler() {
      if (!this.currentId) return
      this.volume = 1 - this.getPos(this.$refs.volumeBar, 'y').toFixed(2)
      this.audio.volume = this.volume
    },
    // 音量滑块点击事件
    clickVolumeBlockHandler() {
      if (!this.currentId) return
      this.volumeBlockCanMove = true
      window.addEventListener('mousemove', this.moveVolumeBlockHandler)
      window.addEventListener(
        'mouseup',
        () => {
          this.volumeBlockCanMove = false
          window.removeEventListener('mousemove', this.moveVolumeBlockHandler)
        },
        { once: true }
      )
    },
    // 音量滑块移动事件
    moveVolumeBlockHandler() {
      if (!this.volumeBlockCanMove) return
      this.volume = 1 - this.getPos(this.$refs.volumeBar, 'y').toFixed(2)
      this.audio.volume = this.volume
    },
    // 进度条点击事件
    changeProgressHandler() {
      if (!this.currentId) return
      this.audio.currentTime = Math.ceil((this.getPos(this.$refs.progressBar, 'x') * this.currentDt) / 1000)
      this.manualChangeProgress = true
    },
    // 进度滑块点击事件
    clickBlockHandler() {
      if (!this.currentId) return
      this.progressBlockCanMove = true
      window.addEventListener('mousemove', this.moveBlockHandler)
      window.addEventListener(
        'mouseup',
        () => {
          this.progressBlockCanMove = false
          window.removeEventListener('mousemove', this.moveBlockHandler)
          this.audio.currentTime = (this.currentProgress * this.currentDt) / 100000
          this.manualChangeProgress = true
        },
        { once: true }
      )
    },
    // 进度滑块移动事件
    moveBlockHandler() {
      if (!this.progressBlockCanMove) return
      const pos = this.getPos(this.$refs.progressBar, 'x')
      this.currentProgress = pos * 100
      this.currentTime = this.dayjs(0)
        .second((pos * this.currentDt) / 1000)
        .format('mm:ss')
    },
    // 改变播放模式
    changePlaymode() {
      if (this.playmode === 'random') this.playmode = 'single'
      else if (this.playmode === 'single') this.playmode = 'cycle'
      else this.playmode = 'random'
    },
    // 点击列表项目
    liClickHandler(id) {
      if (this.currentId === id) {
        this.audio.currentTime = 0
        this.manualChangeProgress = true
        this.audio.play()
      } else this.currentId = id
    },
    // 播放/暂停
    async playSwitch() {
      if (!this.currentId && !this.tracks) return
      if (!this.currentId) {
        this.currentId = this.tracks[0].id
        return
      }
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
    },
    resetCurrent() {
      this.currentSong = null
      this.currentUrl = ''
      this.backupUrl = ''
      this.currentId = 0
      this.currentDt = 0
      this.currentProgress = 0
      this.currentTime = '00:00'
    },
    // 下一首
    nextSong(auto) {
      this.lyricProgress = -1
      if (auto === true) {
        if (!this.playQueue || this.currentIndex < 0) {
          this.resetCurrent()
          return
        }
        if (this.playmode === 'single') {
          this.audio.currentTime = 0
          this.manualChangeProgress = true
          this.audio.play()
          return
        }
      }
      if (!this.playQueue || this.currentIndex < 0) return
      if (this.currentIndex === this.playQueue.length - 1) {
        this.currentId = this.playQueue[0]
      } else {
        this.currentId = this.playQueue[this.currentIndex + 1]
      }
    },
    // 上一首
    prevSong() {
      this.lyricProgress = -1
      if (!this.playQueue || this.currentIndex < 0) return
      if (this.currentIndex === 0) {
        this.currentId = this.playQueue[this.playQueue.length - 1]
      } else {
        this.currentId = this.playQueue[this.currentIndex - 1]
      }
    }
  },
  components: { AddFolderIcon, CleanIcon, ArtistNames, XIcon, Lyric }
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
.muted {
  background-position: -106px -69px;
  &:hover {
    background-position: -128px -69px;
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
