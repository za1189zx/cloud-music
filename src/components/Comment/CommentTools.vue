<template>
  <!-- 输入框 -->
  <div class="h-16 border border-gray-300 rounded-sm relative">
    <textarea
      class="w-full h-full p-1.5 resize-none"
      :placeholder="replyText ? '' : '评论'"
      ref="commentIpt"
      @input="textareaInputHandler"
      v-model="text"
    ></textarea>
    <slot></slot>
  </div>
  <!-- 底部按钮 -->
  <div class="w-full pt-2.5 text-sm">
    <!-- emoji -->
    <button class="w-5 h-5 mr-3"><EmojiIcon class="fill-gray-500" /></button>
    <!-- @ -->
    <button class="w-5 h-5"><AtIcon class="fill-gray-500" /></button>
    <!-- 发送评论 -->
    <button
      class="w-12 h-6 border border-blue-700 rounded float-right bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white"
      @click="sendCommentHandler"
    >
      {{ btnText }}
    </button>
    <!-- 字数 -->
    <div :class="`h-6 mr-3 float-right leading-6 ${wordLimit >= 0 ? 'text-gray-600' : 'text-red-700'}`">{{ wordLimit }}</div>
  </div>
</template>

<script>
import EmojiIcon from '../Icon/EmojiIcon/EmojiIcon.vue'
import AtIcon from '../Icon/AtIcon/AtIcon.vue'
import api from '@/api'

export default {
  data() {
    return {
      wordLimit: 140,
      text: this.replyText
    }
  },
  props: {
    btnText: {
      type: String,
      default: '评论'
    },
    replyText: String,
    // 资源的 id
    resourceId: [String, Number],
    // 评论的 id
    cid: Number,
    // 1 发送, 2 回复
    t: Number,
    // 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频; 6: 动态
    type: Number
  },
  methods: {
    textareaInputHandler() {
      this.wordLimit = Math.floor(140 - this.$refs.commentIpt.value.replace(/(?!\s)[^x00-xff]/g, '**').length / 2)
    },
    async sendCommentHandler() {
      if (this.wordLimit < 0) {
        this.$toast('输入不能超过140个字符')
        return false
      }

      let text = this.text
      if (this.replyText) text = text.replace(this.replyText, '')
      const { data: res } = await api.comment(this.resourceId, this.cid, this.t, this.type, text)
      if (res.code === 200) {
        setTimeout(() => {
          this.text = null
          this.wordLimit = 140
          this.$emit('refresh')
          this.$toast('评论成功')
        }, 500)
      }
    }
  },
  emits: ['refresh'],
  mounted() {
    this.textareaInputHandler()
    this.$refs.commentIpt.focus()
  },
  components: { EmojiIcon, AtIcon }
}
</script>

<style></style>
`
