<template>
  <ul>
    <li
      v-for="(item, index) in list"
      :key="item.commentId"
      class="clearfix group w-full py-4 border-b border-dotted last:border-0 border-gray-300 leading-5"
    >
      <!-- 评论者头像 -->
      <router-link to="" class="float-left">
        <img :src="item.user.avatarUrl + '?param=48y48'" class="w-12 h-12" />
      </router-link>
      <div class="ml-15">
        <p>
          <!-- 昵称 -->
          <router-link to="" class="text-blue-700 hover:text-blue-700 hover:underline whitespace-nowrap">{{
            item.user.nickname
          }}</router-link
          ><span v-if="item.user.avatarDetail" class="h-4 ml-1 py-0.5 inline-block align-text-bottom">
            <!-- 徽章 -->
            <img :src="item.user.avatarDetail.identityIconUrl" class="h-3" /></span
          >&nbsp;：&nbsp;<CommentContent :content="item.content" />
        </p>
        <!-- 引用回复 -->
        <p v-if="item.beReplied.length" class="w-full px-5 py-2 border border-gray-300 relative bg-gray-100">
          <!-- 昵称 -->
          <router-link to="" class="text-blue-700 hover:text-blue-700 hover:underline">{{
            item.beReplied[0].user.nickname
          }}</router-link
          >&nbsp;：&nbsp;<CommentContent :content="item.beReplied[0].content" />
          <!-- 箭头 -->
          <i class="w-2 h-2 block border-t border-l border-gray-300 absolute -top-1 left-2 bg-gray-100 transform rotate-45"></i>
        </p>
        <p class="h-5 mb-0 flex items-center justify-between">
          <!-- 发表时间 -->
          <span class="text-gray-500">{{ time(item.time, item.timeStr) }}</span>
          <span class="flex items-center">
            <span
              v-if="$store.state.userInfo && item.user.userId === $store.state.userInfo.userId"
              class="hidden group-hover:flex items-center"
            >
              <!-- 删除 -->
              <a
                href="javascript:;"
                class="text-gray-500 hover:text-gray-500 hover:underline"
                @click="deleteCommentHandler(item.commentId)"
                >删除</a
              >
              <!-- 分割线 -->
              <span class="h-3 mt-px mx-2 border-r border-gray-400"></span>
            </span>
            <!-- 点赞 -->
            <a
              href="javascript:;"
              class="flex items-center text-gray-800 hover:text-gray-800 hover:underline"
              @click="likeCommentHandler(item.commentId, index)"
              ><LikeIcon :class="`h-3 mr-1 inline align-text-top ${likedMap[index] ? 'fill-red-800' : 'fill-blue-700'}`" />{{
                likedCountMap[index] ? `(${numToUnitWan(likedCountMap[index], 5)})` : ''
              }}</a
            >
            <!-- 分割线 -->
            <span class="h-3 mt-px mx-2 border-r border-gray-400"></span>
            <!-- 回复按钮 -->
            <a href="javascript:;" class="text-gray-500 hover:text-gray-500 hover:underline" @click="replyHandler(index)">回复</a>
          </span>
        </p>
        <!-- 回复框 -->
        <div v-if="toReplyIndex === index" class="mt-3 p-4 border border-gray-400 relative bg-gray-100">
          <CommentTools
            btnText="回复"
            :replyText="`回复${item.user.nickname}:`"
            :resourceId="resourceId"
            :type="type"
            :cid="item.commentId"
            :t="2"
            @refresh="refreshHandler"
          />
          <!-- 箭头 -->
          <i class="w-2 h-2 block border-t border-l border-gray-400 absolute -top-1 right-2 bg-gray-100 transform rotate-45"></i>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import CommentContent from './CommentContent.vue'
import LikeIcon from '../Icon/LikeIcon/LikeIcon.vue'
import { numToUnitWan } from '@/utils'
import api from '@/api'
import CommentTools from './CommentTools.vue'

export default {
  data() {
    return {
      // 防止点赞过快
      likedFlag: true,
      likedMap: null,
      likedCountMap: null,
      toReplyIndex: -1,
      replyFlag: true
    }
  },
  props: {
    list: Array,
    // 资源的 id
    resourceId: [String, Number],
    // 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频; 6: 动态
    type: Number
  },
  methods: {
    numToUnitWan,
    time(timestamp, timeStr) {
      const arr = timeStr.match(/-/g) || timeStr.match('天')
      if (arr && arr.length === 2) return this.dayjs(timestamp).format('YYYY年MM月DD日')
      else if (arr && arr.length === 1) return this.dayjs(timestamp).format('MM月DD日 hh:mm')
      else return timeStr
    },
    likedMapInit() {
      this.likedMap = this.list.map(item => item.liked)
      this.likedCountMap = this.list.map(item => item.likedCount)
    },
    async likeCommentHandler(cid, index) {
      this.likedFlag = false
      const liked = this.likedMap[index]
      const { data: res } = await api.likeComment(this.resourceId, cid, liked ? 0 : 1, this.type)
      if (res.code === 200) {
        this.likedMap[index] = !liked
        if (liked) this.likedCountMap[index]--
        else if (!liked) this.likedCountMap[index]++
      }
      this.likedFlag = true
    },
    replyHandler(index) {
      this.toReplyIndex === index ? (this.toReplyIndex = -1) : (this.toReplyIndex = index)
      this.replyFlag = false
      this.$store.commit('replyFlag', false)
    },
    async deleteCommentHandler(cid) {
      const { data: res } = await api.comment(this.resourceId, cid, 0, this.type, this.text)
      if (res.code === 200) {
        setTimeout(() => {
          this.$emit('refresh')
          this.$toast('删除成功')
        }, 500)
      }
    },
    refreshHandler() {
      this.toReplyIndex = -1
      this.$emit('refresh')
    }
  },
  emits: ['refresh'],
  watch: {
    '$store.state.moduleComment.replyFlag'(val) {
      if (val) return false
      if (this.replyFlag) {
        this.toReplyIndex = -1
      } else {
        this.replyFlag = true
        this.$nextTick(function () {
          this.$store.commit('replyFlag', true)
        })
      }
    }
  },
  created() {
    this.likedMapInit()
  },
  components: {
    CommentContent,
    LikeIcon,
    CommentTools
  }
}
</script>

<style></style>
