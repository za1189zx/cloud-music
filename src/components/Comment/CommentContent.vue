<template>
  <span class="leading-5 whitespace-pre-line break-words" v-html="text"></span>
</template>

<script>
export default {
  props: { content: String },
  computed: {
    text() {
      if (this.content === null) return '该评论已删除'
      const reg = /\[.+?\]/g
      return this.content.replace(reg, match => {
        return this.emojiMap[match] || match
      })
    }
  }
}
</script>

<style></style>
