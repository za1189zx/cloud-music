<template>
  <div v-if="playlist" class="max-w-5xl min-h-180 mx-auto lg:border-l lg:border-r border-gray-300 flex bg-white text-xs">
    <!-- 页面左边 -->
    <div class="w-full lg:w-3/4 pl-10 pr-7 py-12 lg:border-r border-gray-300">
      <div class="flex">
        <!-- 歌单封面 -->
        <div class="w-1/3 max-w-60 p-1">
          <img :src="playlist.coverImgUrl + '?param=250y250'" alt="" class="ring-1 ring-gray-300 ring-offset-4" />
        </div>
        <!-- 歌单信息 -->
        <div class="w-2/3 pl-6 pt-1.5">
          <!-- 歌单名 -->
          <p class="flex text-xl"><span class="playlist w-14 min-w-14 h-6 mr-2" :style="icon"></span>{{ playlist.name }}</p>
          <!-- 歌单创建者 -->
          <p class="h-9 flex items-center text-xs">
            <!-- 头像 -->
            <router-link to="">
              <img :src="playlist.creator.avatarUrl + '?param=36y36'" class="h-full" alt="" />
            </router-link>
            <!-- 名字 -->
            <router-link to="" class="ml-3 text-blue-500 hover:text-blue-500 hover:underline">
              {{ playlist.creator.nickname }}
            </router-link>
            <!-- 徽章 -->
            <img v-if="playlist.creator.avatarDetail" :src="playlist.creator.avatarDetail.identityIconUrl" class="h-3" />
            <!-- 创建时间 -->
            <span class="ml-4">
              {{ dayjs(this.playlist.createTime).format('YYYY-MM-DD') + ' 创建' }}
            </span>
          </p>
          <!-- 按钮组 -->
          <p class="h-8 mb-6 flex items-center gap-x-1.5 whitespace-nowrap">
            <!-- 播放按钮组 -->
            <span
              class="h-full border border-blue-700 rounded inline-flex items-center bg-gradient-to-b from-blue-500 to-blue-600 text-white"
            >
              <!-- 播放按钮 -->
              <button
                class="h-full pl-2 pr-1.5 flex items-center gap-1.5 bg-gradient-to-b hover:from-blue-400 hover:to-blue-500"
                title="播放"
              >
                <FillPlayIcon class="w-4 fill-white" /> 播放
              </button>
              <!-- 分割线 -->
              <span class="h-4 border-l border-blue-800"></span>
              <!-- 添加到播放列表 -->
              <button class="w-7 h-full px-1.5 bg-gradient-to-b hover:from-blue-400 hover:to-blue-500" title="添加到播放列表">
                <AddIcon class="w-4 fill-white" />
              </button>
            </span>
            <!-- 收藏按钮 -->
            <button
              :disabled="playlist.subscribed"
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100 disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default"
            >
              <AddFolderIcon :class="`w-4 ${playlist.subscribed ? 'fill-gray-400' : 'fill-black'} `" />
              {{ windowWidth >= 768 && playlist.subscribedCount ? `(${numToUnitWan(playlist.subscribedCount)})` : '收藏' }}
            </button>
            <!-- 分享按钮 -->
            <button
              class="h-full pl-2 pr-1.5 flex items-center gap-1.5 border border-gray-400 rounded bg-gradient-to-b from-white to-gray-200 hover:to-gray-100"
            >
              <ShareIcon class="w-4 fill-black" />
              {{ windowWidth >= 768 && playlist.shareCount ? `(${numToUnitWan(playlist.shareCount)})` : '分享' }}
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
              {{ windowWidth >= 768 ? `(${playlist.commentCount})` : '评论' }}
            </button>
          </p>
          <!-- 标签 -->
          <ul class="text-xs flex items-center text-gray-600">
            <li>标签：</li>
            <li v-for="item in playlist.tags" :key="item" class="h-6 mr-2">
              <router-link
                to=""
                class="h-full px-3 border border-gray-400 rounded-full flex-center bg-gray-100 hover:bg-gray-50 text-gray-600 hover:text-gray-600"
              >
                {{ item }}
              </router-link>
            </li>
          </ul>
          <!-- 介绍 -->
          <p class="mb-0 relative overflow-hidden text-gray-600 whitespace-pre-line" ref="description">
            介绍：{{ descEllip && !opened ? descEllip : playlist.description }}
          </p>
          <!-- 展开介绍 -->
          <p>
            <a v-if="descEllip" class="flex-center gap-0.5 float-right hover:underline" @click="opened = !opened"
              >{{ opened ? '收起' : '展开'
              }}<i
                :class="`w-2 h-2 block border-gray-600 transform rotate-45 ${
                  opened ? 'border-t-2 border-l-2 translate-y-0.5' : 'border-b-2 border-r-2'
                }`"
              ></i
            ></a>
          </p>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <Header left="歌曲列表" leftClass="text-xl">
        <template v-slot:left>
          <!-- 歌曲数量 -->
          <span class="pl-4 text-gray-600">{{ playlist.trackCount + '首歌' }}</span>
        </template>
        <template v-slot:right>
          <!-- 播放次数 -->
          <div class="text-gray-600">
            播放：<span class="text-red-800 font-bold">{{ playlist.playCount }}</span
            >次
          </div>
        </template>
      </Header>
      <!-- 列表 -->
      <table class="w-full border border-gray-300 table-fixed">
        <thead class="h-9 border-b border-gray-300">
          <tr class="divide-x divide-gray-300 bg-gradient-to-b from-white to-gray-100">
            <th></th>
            <th class="w-1/3 pl-3 text-gray-600 font-normal">歌曲标题</th>
            <th class="w-1/6 pl-3 text-gray-600 font-normal">时长</th>
            <th class="pl-3 text-gray-600 font-normal">歌手</th>
            <th class="w-1/5 pl-3 text-gray-600 font-normal">专辑</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in playlist.tracks" :key="item.id" class="w-full h-8 odd:bg-gray-100">
            <!-- 标号 -->
            <td>
              <div class="flex items-center justify-around">
                <span>{{ index + 1 }}</span>
                <button class="w-4"><FillPlayIcon class="fill-gray-400 hover:fill-gray-500" /></button>
              </div>
            </td>
            <!-- 歌名 -->
            <td class="px-2.5 truncate">
              <router-link
                to=""
                class="text-gray-700 hover:text-gray-700 hover:underline"
                :title="item.name + (item.alia[0] ? ` - (${item.alia[0]})` : '')"
              >
                {{ item.name }} </router-link
              ><span v-if="item.alia[0]" class="text-gray-400" :title="item.alia[0]"> - ({{ item.alia[0] }})</span>
            </td>
            <!-- 时长 -->
            <td class="px-2.5 text-gray-500">{{ dayjs(item.dt).format('mm:ss') }}</td>
            <!-- 歌手们 -->
            <td class="px-2.5 truncate">
              <ArtistNames :artists="item.ar" textColor="text-gray-700" intactTitle />
            </td>
            <!-- 专辑 -->
            <td class="px-2.5 truncate">
              <router-link to="" class="text-gray-700 hover:text-gray-700 hover:underline" :title="item.al.name">
                {{ item.al.name }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 更多内容下载 -->
      <div
        v-if="playlist.trackCount > playlist.tracks.length"
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
      <Comment
        :commentCount="playlist.commentCount"
        :list="list"
        :callback="commentCallback"
        :resourceId="$route.query.id"
        :type="2"
        ref="comment"
      />
    </div>
    <!-- 页面右边 -->
    <div v-if="windowWidth >= 1024" class="w-1/4 h-full pl-7 pr-10 py-5">
      <!-- 喜欢这个歌单的人 -->
      <MiniHeader v-if="playlist.subscribers && playlist.subscribers.length" left="喜欢这个歌单的人" />
      <!-- 头像列表 -->
      <ul class="grid grid-cols-4 gap-3 mb-6">
        <li v-for="item in playlist.subscribers" :key="item.id">
          <router-link to=""><img :src="item.avatarUrl + '?param=40y40'" /></router-link>
        </li>
      </ul>
      <!-- 热门歌单-->
      <MiniHeader left="热门歌单" />
      <ul v-if="relatedList">
        <li v-for="item in relatedList" :key="item.id" class="w-full mb-4">
          <!-- 封面 -->
          <router-link :to="`/playlist?id=${item.id}`" class="w-12 float-left" :title="item.name">
            <img :src="item.coverImgUrl + '?param=50y50'"
          /></router-link>
          <div class="w-full pl-14">
            <!-- 歌单名 -->
            <p class="w-full h-6 mb-0 leading-6 truncate">
              <router-link
                :to="`/playlist?id=${item.id}`"
                class="text-sm text-black hover:text-black hover:underline"
                :title="item.name"
                >{{ item.name }}</router-link
              >
            </p>
            <!-- 创建者 -->
            <p class="h-6 mb-0 leading-6 text-gray-500">
              by
              <router-link to="" class="text-gray-600 hover:text-gray-600 hover:underline" :title="item.creator.nickname">{{
                item.creator.nickname
              }}</router-link>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="msg" class="max-w-5xl min-h-180 mx-auto pt-10 lg:border-l lg:border-r border-gray-300 flex justify-center">
    <h1 class="text-4xl font-bold">{{ msg }}</h1>
  </div>
</template>

<script>
import api from '@/api'
import { numToUnitWan } from '@/utils'
import MiniHeader from '../../components/Header/MiniHeader.vue'
import AddIcon from '../../components/Icon/AddIcon/AddIcon.vue'
import FillPlayIcon from '../../components/Icon/PlayIcon/FillPlayIcon.vue'
import ShareIcon from '../../components/Icon/ShareIcon/ShareIcon.vue'
import AddFolderIcon from '../../components/Icon/AddFolderIcon/AddFolderIcon.vue'
import DownLoadIcon from '../../components/Icon/DownLoadIcon/DownLoadIcon.vue'
import CommentIcon from '../../components/Icon/CommentIcon/CommentIcon.vue'
import Header from '../../components/Header/Header.vue'
import ArtistNames from '../../components/ArtistNames/ArtistNames.vue'
import Comment from '../../components/Comment/Comment.vue'

export default {
  data() {
    return {
      playlist: null,
      icon: `background-image : url(${require('@/assets/sprite/icon.png')})`,
      opened: false,
      relatedList: null,
      list: {
        hotComments: null,
        comments: null
      },
      // 错误信息
      msg: null
    }
  },
  watch: {
    '$route.query.id': {
      handler(id) {
        this.getPlaylist(id)
      },
      immediate: true
    }
  },
  computed: {
    descEllip() {
      const desc = this.playlist.description
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
  inject: ['windowWidth'],
  methods: {
    async getPlaylist(id) {
      const [{ data: res1 }, { data: res2 }, { data: res3 }] = await Promise.all([
        api.getPlaylistDetail(id),
        api.getPlaylistRelated(id),
        api.getPlaylistComment(id)
      ]).catch(err => {
        this.playlist = null
        this.msg = err.data.msg
        if (err.data.msg.match('登录')) {
          this.$store.commit('toLogin', true)
        }
      })
      if (res1.code === 200) {
        this.playlist = res1.playlist
        document.title = res1.playlist.name + ' - 歌单 - 网易云音乐'
      }
      if (res2.code === 200) {
        this.relatedList = res2.playlists
      }
      if (res3.code === 200) {
        this.list.hotComments = res3.hotComments
        this.list.comments = res3.comments
      }
    },
    description() {
      if (this.descSwitch || !this.playlist) return
      if (this.$refs.description.scrollHeight > this.$refs.description.clientHeight) {
        this.descSwitch = true
      }
    },
    commentBtnHandler() {
      this.$refs.scrollTo.scrollIntoView(true)
      this.$refs.scrollTo.nextElementSibling.nextElementSibling.getElementsByTagName('textarea')[0].focus()
    },

    numToUnitWan,
    commentCallback: api.getPlaylistComment
  },
  updated() {
    this.description()
  },
  components: {
    MiniHeader,
    AddIcon,
    FillPlayIcon,
    ShareIcon,
    AddFolderIcon,
    DownLoadIcon,
    CommentIcon,
    Header,
    ArtistNames,
    Comment
  }
}
</script>

<style scoped>
.playlist {
  background-position: 0 -243px;
}
</style>
