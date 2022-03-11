<template>
  <!-- 输入框 -->
  <div class="h-16 border border-gray-300 rounded-sm relative">
    <textarea
      class="w-full h-full p-1.5 absolute z-10 resize-none"
      :placeholder="replyText ? '' : '评论'"
      ref="commentIpt"
      v-model="text"
      @input="wordLimitHandler"
      @mouseup="selectionHandler"
      @keydown="keydownHandler"
      @keyup="atHandler"
    ></textarea>
    <!-- 用于光标定位的镜像 -->
    <div class="w-full h-full p-1.5 absolute overflow-y-scroll break-words whitespace-pre-line" v-html="cloneText"></div>
    <!-- @ 栏 -->
    <ul
      class="border border-gray-300 absolute bg-white z-50"
      :style="`top: ${atListTop}; left: ${atListLeft}`"
      v-if="showAtList && atKeyword !== null"
      v-clickoutside.parent="() => (showAtList = false)"
    >
      <li class="px-1.5 py-1 mb-1">{{ atList && atList.length !== 0 ? '选择最近@的人或直接输入' : '轻敲空格完成输入' }}</li>
      <li
        :class="`px-1.5 py-1 mb-1 truncate ${focusIndex === index ? 'bg-gray-200' : ''}`"
        v-for="(item, index) of atList"
        :key="item"
        @mouseup="insertHandler(item + ' ')"
        @mouseover="focusIndex = index"
      >
        {{ item }}
      </li>
      <!-- 箭头 -->
      <i class="w-2 h-2 block border-t border-l border-gray-300 absolute -top-1 left-2 bg-white transform rotate-45"></i>
    </ul>
    <slot></slot>
  </div>
  <!-- 底部按钮 -->
  <div class="w-full pt-2.5 text-sm">
    <!-- emoji -->
    <button class="w-5 h-5 mr-3 relative" @click="showEmojiList = true">
      <EmojiIcon class="fill-gray-500" />
      <!-- emoji 栏 -->
      <ul
        class="w-70 p-1 border border-gray-300 absolute top-8 -left-1 grid grid-cols-10 gap-1 grid-rows-6 bg-white"
        v-if="showEmojiList"
        v-clickoutside="() => (showEmojiList = false)"
      >
        <li
          v-for="(img, name) in this.emojiMap"
          :key="name"
          v-html="img"
          class="border border-transparent hover:border-blue-500 cursor-pointer"
          @click="insertHandler(name)"
        ></li>
        <!-- 箭头 -->
        <i class="w-2 h-2 block border-t border-l border-gray-300 absolute -top-1 left-2 bg-white transform rotate-45"></i>
      </ul>
    </button>
    <!-- @ -->
    <button class="w-5 h-5" @click="insertHandler('@')"><AtIcon class="fill-gray-500" /></button>
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
      // 字数限制
      wordLimit: 140,
      // 输入框文本
      text: this.replyText || '',
      // 选中（头
      selectionStart: null,
      // 选中（尾
      selectionEnd: null,
      // emoji 表显示状态
      showEmojiList: false,
      // @ 栏显示状态
      showAtList: false,
      // @ 栏坐标
      atListTop: null,
      // @ 栏坐标
      atListLeft: null,
      // @ 栏选中项的索引
      focusIndex: 0,
      // @ 栏关键字
      atKeyword: null
    }
  },
  inject: ['resourceType', 'resourceId'],
  props: {
    btnText: {
      resourceType: String,
      default: '评论'
    },
    replyText: String,
    // 评论的 id
    cid: Number,
    // 1 发送, 2 回复
    t: Number
  },
  computed: {
    atList() {
      if (this.$store.state.isLogin && this.$store.getters.atList) {
        return this.$store.getters.atList.filter(item => item.match(this.atKeyword)).slice(0, 5)
      } else return null
    },
    cloneText() {
      return (
        this.text.slice(0, this.selectionStart) +
        '<span class="clone">|</span>' +
        this.text.slice(this.selectionStart, this.text.length)
      )
    }
  },
  watch: {
    'atList.length'() {
      this.focusIndex = 0
    },
    atKeyword(newVal) {
      if (newVal !== null) {
        this.showAtList = true
      }
    }
  },
  methods: {
    wordLimitHandler() {
      this.wordLimit = Math.floor(140 - this.$refs.commentIpt.value.replace(/(?!\s)[^x00-xff]/g, '**').length / 2)
    },
    selectionHandler() {
      this.selectionStart = this.$refs.commentIpt.selectionStart
      this.selectionEnd = this.$refs.commentIpt.selectionEnd
      this.$nextTick(function () {
        const clone = this.$refs.commentIpt.nextElementSibling.getElementsByClassName('clone')[0]
        this.atListTop = clone.offsetTop > 40 ? '64px' : clone.offsetTop + 24 + 'px'
        this.atListLeft = clone.offsetLeft - 12 + 'px'
      })
    },
    insertHandler(val) {
      const text = this.text
      const length = text ? text.length : 0
      const { commentIpt } = this.$refs
      let insertStart = this.selectionStart
      const insertEnd = this.selectionEnd

      if (this.selectionStart !== null) {
        this.text = text.slice(0, insertStart) + val + text.slice(insertEnd, length)
        commentIpt.focus()
        this.$nextTick(function () {
          insertStart += val.length
          commentIpt.setSelectionRange(insertStart, insertStart)
          this.atHandler()
        })
      } else {
        this.text += val
        commentIpt.focus()
        this.$nextTick(function () {
          this.atHandler()
        })
      }
      this.wordLimitHandler()
    },
    atHandler() {
      this.selectionHandler()
      const text = this.text.slice(0, this.selectionStart).split('')
      let atIndex = -1
      for (let i = text.length - 1; i >= 0; i--) {
        if (text[i].match(' ')) {
          this.atKeyword = null
          break
        }
        if (text[i].match('@')) {
          atIndex = i
          break
        }
      }
      if (atIndex < 0) {
        this.atKeyword = null
        return
      }
      text.splice(0, atIndex + 1)
      if (text.length > 15) this.atKeyword = null
      else this.atKeyword = new RegExp(text.join(''), 'i')
    },
    keydownHandler(e) {
      e = e || window.e
      if (this.atKeyword) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (this.focusIndex > 0) this.focusIndex--
          else this.focusIndex = this.atList.length - 1
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (this.focusIndex < this.atList.length - 1) {
            this.focusIndex++
          } else this.focusIndex = 0
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (this.atList[this.focusIndex]) this.insertHandler(this.atList[this.focusIndex] + ' ')
        }
      } else {
        if (e.key === 'Enter') {
          e.preventDefault()
          this.sendCommentHandler()
        }
      }
    },
    async sendCommentHandler() {
      if (this.wordLimit < 0) {
        this.$toast('输入不能超过140个字符')
        return false
      }

      let text = this.text
      if (this.replyText) text = text.replace(this.replyText, '')
      const { data: res } = await api.comment(this.resourceId, this.cid, this.t, this.resourceType, text)
      if (res.code === 200) {
        setTimeout(() => {
          this.text = ''
          this.wordLimit = 140
          this.$emit('refresh')
          this.$toast('评论成功')
        }, 500)
      } else this.$toast(res.message)
    }
  },
  emits: ['refresh'],
  mounted() {
    this.wordLimitHandler()
    this.replyText && this.$refs.commentIpt.focus()
  },
  components: { EmojiIcon, AtIcon }
}
</script>

<style></style>
`
