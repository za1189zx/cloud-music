<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="`${center ? ' ' : 'absolute bottom-1 right-1 '}${
      hover ? 'opacity-0 group-hover:opacity-60 transition-opacity duration-500 delay-150 ' : 'opacity-60 '
    }fill-black stroke-white`"
    viewBox="0 0 20 20"
    :style="style"
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 8
    },
    center: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    style() {
      let size
      if (this.size > 0 && this.size <= 1) {
        size = this.size * 100 + '%'
      } else {
        size = this.size * 4 + 'px'
      }
      return `width: ${size}; height: ${size};`
    }
  }
}
</script>

<style></style>
