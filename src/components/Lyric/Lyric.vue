<template>
  <div ref="lyric">
    <p
      v-for="(item, index) in lrc"
      v-show="index < 12 || opened"
      :key="item"
      :class="`mb-2 transition-all duration-500 ${beCenter ? 'text-center' : ''} ${
        item.current && currentClass ? currentClass : ''
      }`"
    >
      {{ item.text }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    lyric: String,
    tlyric: String,
    opened: { type: Boolean, default: false },
    beCenter: { type: Boolean, default: false },
    lyricProgress: Number,
    currentClass: String,
    manualChangeProgress: Boolean
  },
  data() {
    return {
      nextIdx: 0
    }
  },
  computed: {
    lrc() {
      let lyric = this.formatLyric(this.lyric)
      if (!this.tlyric) return lyric
      lyric = lyric.concat(this.formatLyric(this.tlyric)).sort((a, b) => a.time - b.time)
      return lyric
    }
  },
  watch: {
    lrc: {
      handler(arr) {
        if (arr.length > 12) this.$emit('tooLong')
      },
      immediate: true
    },
    lyricProgress(newVal) {
      if (this.manualChangeProgress || this.nextIdx >= this.lrc.length) {
        let flag = true
        for (let i = 0; i < this.lrc.length; i++) {
          this.lrc[i].current = false
          if (flag && newVal < this.lrc[i].time) {
            this.nextIdx = i
            let currentIdx = i - 1
            this.lrc[currentIdx].current = true
            while (this.lrc[currentIdx].time === this.lrc[currentIdx - 1].time) {
              this.lrc[--currentIdx].current = true
            }
            this.$refs.lyric.children[currentIdx].scrollIntoView({ block: 'center', behavior: 'smooth' })
            flag = false
          }
        }
        this.$emit('update:manualChangeProgress', false)
      } else {
        if (newVal >= this.lrc[this.nextIdx].time) {
          this.lrc.some((item, index) => {
            if (index < this.nextIdx) {
              item.current = false
            } else return true
          })
          this.lrc[this.nextIdx].current = true
          this.$refs.lyric.children[this.nextIdx++].scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
        while (!this.manualChangeProgress && this.nextIdx < this.lrc.length && newVal >= this.lrc[this.nextIdx].time) {
          this.lrc[this.nextIdx++].current = true
        }
      }
    }
  },
  emits: ['tooLong', 'update:manualChangeProgress'],
  methods: {
    // 格式化时间字符串为时间
    formatTimeToNumber(timeString) {
      const splitArr = timeString.split(':').map(item => Number(item))
      return splitArr[0] * 60 + splitArr[1]
    },
    // 格式化歌词字符串为"时间-歌词"格式的数组
    formatLyric(lyric) {
      if (!lyric) return []
      const lyricParts = lyric.split('\n').filter(item => item)
      return lyricParts
        .map(item => {
          const splitItems = item.split(']')
          const lyricItem = {
            time: this.formatTimeToNumber(splitItems[0].slice(1)),
            text: splitItems[1]
          }
          return lyricItem
        })
        .filter(item => !Number.isNaN(item.time))
    }
  }
}
</script>

<style></style>
