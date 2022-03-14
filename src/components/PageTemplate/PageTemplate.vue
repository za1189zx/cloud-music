<template>
  <div class="max-w-5xl min-h-180 mx-auto lg:border-l lg:border-r border-gray-300 flex bg-white text-xs">
    <!-- 页面左边 -->
    <div class="w-full lg:w-3/4 pl-10 pr-7 py-12 lg:border-r border-gray-300">
      <div class="flex">
        <!-- 封面 -->
        <div class="w-1/3 max-w-60 p-1">
          <slot name="cover"></slot>
        </div>
        <!-- 信息 -->
        <div class="w-2/3 pl-6 pt-1.5">
          <!-- 资源名 -->
          <div :class="`w-14 min-w-14 h-6 mr-2 float-left ${iconClass}`" :style="icon"></div>
          <div class="ml-16 mb-2">
            <div class="flex text-xl">{{ resourceName }}</div>
            <div v-if="alia" class="text-gray-400">{{ alia }}</div>
          </div>
          <slot name="info"></slot>
          <!-- 按钮组 -->
          <p class="h-8 mb-6 flex items-center gap-x-1.5 whitespace-nowrap">
            <!-- 播放按钮组 -->
            <span
              v-if="!disabled"
              class="h-full border border-blue-700 rounded inline-flex items-center bg-gradient-to-b from-blue-500 to-blue-600 text-white"
            >
              <!-- 播放按钮 -->
              <button
                class="h-full pl-2 pr-1.5 flex items-center gap-1.5 bg-gradient-to-b hover:from-blue-400 hover:to-blue-500"
                title="播放"
                @click="
                  () => {
                    $store.commit('resetAudioTracks', tracks)
                    $store.commit('toPlay', 'first')
                  }
                "
              >
                <FillPlayIcon class="w-4 fill-white" /> 播放
              </button>
              <!-- 分割线 -->
              <span class="h-4 border-l border-blue-800"></span>
              <!-- 添加到播放列表 -->
              <button
                class="w-7 h-full px-1.5 bg-gradient-to-b hover:from-blue-400 hover:to-blue-500"
                title="添加到播放列表"
                @click="$store.commit('addAudioTracks', tracks)"
              >
                <AddIcon class="w-4 fill-white" />
              </button>
            </span>
            <!-- 禁止播放 -->
            <button
              v-if="disabled"
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gray-200 text-gray-400 cursor-default"
              title="亲爱的, 暂无版权"
            >
              <FillPlayIcon class="w-4 fill-gray-400" /> 播放
            </button>

            <!-- 收藏按钮 -->
            <button
              :disabled="subscribed"
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100 disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default"
            >
              <AddFolderIcon :class="`w-4 ${subscribed ? 'fill-gray-400' : 'fill-black'} `" />
              {{ windowWidth >= 768 && subscribedCount ? `(${numToUnitWan(subscribedCount)})` : '收藏' }}
            </button>
            <!-- 分享按钮 -->
            <button
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100"
            >
              <ShareIcon class="w-4 fill-black" />
              {{ windowWidth >= 768 && shareCount ? `(${numToUnitWan(shareCount)})` : '分享' }}
            </button>
            <!-- 下载按钮 -->
            <button
              class="h-full pl-2 pr-1.5 flex items-center gap-0.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100"
            >
              <DownLoadIcon class="w-4 fill-black" />下载
            </button>
            <!-- 评论按钮 -->
            <button
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100"
              @click="commentBtnHandler"
            >
              <CommentIcon class="w-4 fill-black" />
              {{ windowWidth >= 768 ? `(${commentList.total})` : '评论' }}
            </button>
          </p>
          <!-- 标签 -->
          <ul v-if="tags" class="text-xs flex items-center text-gray-600">
            <li>标签：</li>
            <li v-for="item in tags" :key="item" class="h-6 mr-2">
              <router-link
                to=""
                class="h-full px-3 border border-gray-400 rounded-full flex-center bg-gray-100 hover:bg-gray-50 text-gray-600 hover:text-gray-600"
              >
                {{ item }}
              </router-link>
            </li>
          </ul>
          <!-- 介绍 -->
          <p v-if="description" class="mb-0 relative overflow-hidden text-gray-600 whitespace-pre-line" ref="description">
            介绍：{{ descEllip && !opened ? descEllip : description }}
          </p>
          <!-- 歌词 -->
          <Lyric v-if="lrc" :lyric="lrc.lyric" :tlyric="lrc.tlyric" :opened="opened" @tooLong="lyricEllip = true" />
          <!-- 展开 -->
          <p class="h-4">
            <a
              v-if="descEllip || lyricEllip"
              :class="`flex-center gap-0.5 hover:underline ${descEllip ? 'float-right' : 'float-left'}`"
              @click="opened = !opened"
              >{{ opened ? '收起' : '展开'
              }}<i
                :class="`w-2 h-2 block border-gray-600 transform rotate-45 ${
                  opened ? 'border-t-2 border-l-2 translate-y-0.5' : 'border-b-2 border-r-2'
                }`"
              ></i
            ></a>
          </p>
          <!-- 歌词贡献者 -->
          <p v-if="lrc && (lrc.lyricUser || lrc.transUser)" class="text-gray-600 text-right">
            <span v-if="lrc.lyricUser">贡献滚动歌词：</span
            ><router-link to="" v-if="lrc.lyricUser" class="text-blue-600 hover:text-blue-600 underline hover:underline">{{
              lrc.lyricUser.nickname
            }}</router-link
            ><span v-if="lrc.transUser" class="ml-6">贡献翻译：</span
            ><router-link v-if="lrc.transUser" to="" class="text-blue-600 hover:text-blue-600 underline hover:underline">{{
              lrc.transUser.nickname
            }}</router-link>
          </p>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <Header v-if="tracks && resourceType" left="歌曲列表" leftClass="text-xl">
        <template v-if="trackCount" v-slot:left>
          <!-- 歌曲数量 -->
          <span class="pl-4 text-gray-600">{{ trackCount + '首歌' }}</span>
        </template>
        <template v-if="playCount" v-slot:right>
          <!-- 播放次数 -->
          <div class="text-gray-600">
            播放：<span class="text-red-800 font-bold">{{ playCount }}</span
            >次
          </div>
        </template>
      </Header>
      <!-- 列表 -->
      <table v-if="tracks && resourceType" class="w-full border border-gray-300 table-fixed">
        <thead class="h-9 border-b border-gray-300">
          <tr class="divide-x divide-gray-300 bg-gradient-to-b from-white to-gray-100">
            <th></th>
            <th :class="`${resourceType == 3 ? 'w-1/2' : 'w-1/3'} pl-3 text-gray-600 font-normal`">歌曲标题</th>
            <th class="w-1/6 pl-3 text-gray-600 font-normal">时长</th>
            <th class="pl-3 text-gray-600 font-normal">歌手</th>
            <th v-if="resourceType !== 3" class="w-1/5 pl-3 text-gray-600 font-normal">专辑</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tracks"
            :key="item.id"
            :class="`w-full h-8 odd:bg-gray-100 ${item.disabled ? 'text-gray-400' : ''}`"
          >
            <!-- 标号 -->
            <td>
              <div class="flex items-center justify-around">
                <span>{{ index + 1 }}</span>
                <span v-if="item.disabled" class="w-4"><FillPlayIcon class="fill-gray-300" /></span>
                <!-- 播放按钮 -->
                <button
                  v-else
                  class="w-4"
                  @click="
                    () => {
                      $store.commit('addAudioTracks', [item])
                      $store.commit('toPlay', item.id)
                    }
                  "
                >
                  <FillPlayIcon class="fill-gray-400 hover:fill-gray-500" />
                </button>
              </div>
            </td>
            <!-- 歌名 -->
            <td class="px-2.5 truncate">
              <router-link
                :to="`song?id=${item.id}`"
                :class="`hover:underline ${
                  item.disabled ? 'text-gray-400 hover:text-gray-400 ' : 'text-gray-700 hover:text-gray-700'
                }`"
                :title="item.name + (item.alia[0] ? ` - (${item.alia[0]})` : '')"
              >
                {{ item.name }} </router-link
              ><span v-if="item.alia[0]" class="text-gray-400" :title="item.alia[0]"> - ({{ item.alia[0] }})</span>
            </td>
            <!-- 时长 -->
            <td class="group px-2.5">
              <span :class="`block ${item.disabled ? '' : 'group-hover:hidden'}`">{{ dayjs(item.dt).format('mm:ss') }}</span>
              <!-- 按钮组 -->
              <div v-if="!item.disabled" class="w-20 h-4 mr-4 flex-shrink-0 hidden group-hover:flex justify-between">
                <!-- 添加到播放列表 -->
                <button class="w-4 h-4" title="添加到播放列表" @click="$store.commit('addAudioTracks', [item])">
                  <AddIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 收藏 -->
                <button class="w-4 h-4" title="收藏">
                  <AddFolderIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 分享 -->
                <button class="w-4 h-4" title="分享">
                  <ShareIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
                <!-- 下载 -->
                <button class="w-4 h-4" title="下载">
                  <DownLoadIcon class="fill-gray-500 hover:fill-gray-600" />
                </button>
              </div>
            </td>
            <!-- 歌手们 -->
            <td class="px-2.5 truncate">
              <ArtistNames :artists="item.ar" :textColor="item.disabled ? 'text-gray-400' : 'text-gray-700'" intactTitle />
            </td>
            <!-- 专辑 -->
            <td v-if="resourceType !== 3" class="px-2.5 truncate">
              <router-link
                :to="`/album?id=${item.al.id}`"
                :class="`hover:underline ${
                  item.disabled ? 'text-gray-400 hover:text-gray-400 ' : 'text-gray-700 hover:text-gray-700'
                }`"
                :title="item.al.name"
              >
                {{ item.al.name }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 更多内容下载 -->
      <div
        v-if="tracks && trackCount && trackCount > tracks.length"
        class="w-full h-16 mt-8 flex flex-col items-center justify-between"
      >
        <div class="text-sm">查看更多内容，请下载客户端</div>
        <router-link
          to=""
          class="w-32 h-8 rounded-full flex-center flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 text-white hover:text-white"
          >立即下载</router-link
        >
      </div>
      <!-- 评论区 -->
      <div ref="scrollTo"></div>
      <Comment />
    </div>
    <!-- 页面右边 -->
    <div v-if="windowWidth >= 1024" class="w-1/4 h-full pl-7 pr-10 py-5">
      <!-- 喜欢这个XX的人 -->
      <MiniHeader v-if="subscribers && subscribers.length && subscribersTitle" :left="subscribersTitle" />
      <!-- 头像列表 -->
      <ul v-if="subscribers && subscribers.length" class="grid grid-cols-4 gap-3 mb-6">
        <li v-for="item in subscribers" :key="item.id">
          <router-link to=""><img :src="item.avatarUrl + '?param=40y40'" /></router-link>
        </li>
      </ul>
      <!-- 相关歌单-->
      <MiniHeader v-if="relatedList && relatedList.length && playlistTitle" :left="playlistTitle" />
      <!-- 相关列表 -->
      <ul v-if="relatedList && relatedList.length">
        <li v-for="item in relatedList" :key="item.id" class="w-full mb-4">
          <!-- 封面 -->
          <router-link :to="`/${relatedType}?id=${item.id}`" class="w-12 float-left" :title="item.name">
            <img :src="(item.coverImgUrl || item.picUrl) + '?param=50y50'"
          /></router-link>
          <div class="w-full pl-14">
            <!-- 歌单名 -->
            <p class="w-full h-6 mb-0 leading-6 truncate">
              <router-link
                :to="`/${relatedType}?id=${item.id}`"
                class="text-sm text-black hover:text-black hover:underline"
                :title="item.name"
                >{{ item.name }}</router-link
              >
            </p>
            <!-- 创建者 -->
            <p v-if="item.creator" class="h-6 mb-0 leading-6 text-gray-500">
              by
              <router-link to="" class="text-gray-600 hover:text-gray-600 hover:underline" :title="item.creator.nickname">{{
                item.creator.nickname
              }}</router-link>
            </p>
            <!-- 发行时间 -->
            <p v-else-if="resourceType === 3" class="h-6 mb-0 leading-6 text-gray-500">
              {{ dayjs(item.publishTime).format('YYYY-MM-DD') }}
            </p>
          </div>
        </li>
      </ul>
      <!-- 相似歌曲 -->
      <MiniHeader v-if="simiSongsList && simiSongsList.length" left="相似歌曲" />
      <ul>
        <li v-for="item in simiSongsList" :key="item.id" class="mb-3 flex items-center justify-between">
          <div class="w-36 flex flex-col">
            <!-- 歌名 -->
            <router-link :to="`song?id=${item.id}`" class="text-sm text-black hover:text-black hover:underline truncate">{{
              item.name
            }}</router-link>
            <!-- 歌手 -->
            <div class="truncate"><ArtistNames :artists="item.artists" textColor="text-gray-500" /></div>
          </div>
          <!-- 按钮 -->
          <div class="w-10 flex items-center justify-between">
            <!-- 播放 -->
            <button class="w-4 h-4" title="播放">
              <FillPlayIcon class="fill-gray-500 hover:fill-gray-600" />
            </button>

            <!-- 添加到播放列表 -->
            <button class="w-4 h-4" title="添加到播放列表">
              <AddIcon class="fill-gray-500 hover:fill-gray-600" />
            </button>
          </div>
          <div></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue'
import Comment from '../Comment/Comment.vue'
import MiniHeader from '../../components/Header/MiniHeader.vue'
import ArtistNames from '../ArtistNames/ArtistNames.vue'
import AddIcon from '../Icon/AddIcon/AddIcon.vue'
import FillPlayIcon from '../Icon/PlayIcon/FillPlayIcon.vue'
import ShareIcon from '../Icon/ShareIcon/ShareIcon.vue'
import AddFolderIcon from '../Icon/AddFolderIcon/AddFolderIcon.vue'
import DownLoadIcon from '../Icon/DownLoadIcon/DownLoadIcon.vue'
import CommentIcon from '../Icon/CommentIcon/CommentIcon.vue'
import Lyric from '@/components/Lyric/Lyric.vue'
import { numToUnitWan } from '@/utils'

export default {
  data() {
    return {
      icon: `background-image : url(${require('@/assets/sprite/icon.png')})`,
      opened: false,
      lyricEllip: false
    }
  },
  props: {
    // 左侧数据
    // 资源名
    resourceName: String,
    // 资源别名
    alia: String,
    // 是否已收藏
    subscribed: { type: Boolean, default: false },
    // 收藏数量
    subscribedCount: Number,
    // 分享数量
    shareCount: Number,
    // 评论数量
    commentCount: Number,
    // 标签
    tags: Array,
    // 介绍
    description: String,
    // 歌词
    lrc: Object,
    // 播放列表数量
    trackCount: Number,
    // 播放量
    playCount: Number,
    // 播放列表
    tracks: Array,
    // 右侧数据
    // 收藏
    subscribersTitle: String,
    subscribers: Array,
    // 相关歌单
    playlistTitle: String,
    relatedList: Array,
    // 相似歌曲
    simiSongsList: Array
  },
  computed: {
    disabled() {
      if (this.tracks.some(item => !item.disabled)) return false
      else return true
    },
    iconClass() {
      switch (this.resourceType) {
        case 0:
          return 'song'
        case 2:
          return 'playlist'
        case 3:
          return 'album'
        default:
          return ''
      }
    },
    relatedType() {
      switch (this.resourceType) {
        case 0:
        case 2:
          return 'playlist'
        case 3:
          return 'album'
        default:
          return ''
      }
    },
    descEllip() {
      if (!this.description) return false
      const desc = this.description
      let len = 0
      const reg = /[^x00-xff]/
      for (const i in desc) {
        if (reg.test(desc[i])) len += 2
        else len += 1
        if (len >= 200) {
          return desc.slice(0, i * 1 + 1) + '...'
        }
      }
      return false
    }
  },
  inject: ['windowWidth', 'resourceType', 'commentList'],
  methods: {
    commentBtnHandler() {
      this.$refs.scrollTo.scrollIntoView(true)
      this.$refs.scrollTo.nextElementSibling.nextElementSibling.getElementsByTagName('textarea')[0].focus()
    },
    numToUnitWan
  },
  components: {
    Header,
    Comment,
    MiniHeader,
    ArtistNames,
    AddIcon,
    FillPlayIcon,
    ShareIcon,
    AddFolderIcon,
    DownLoadIcon,
    CommentIcon,
    Lyric
  }
}
</script>

<style scoped>
.playlist {
  background-position: 0 -243px;
}
.song {
  background-position: 0 -463px;
}
.album {
  background-position: 0 -186px;
}
</style>
