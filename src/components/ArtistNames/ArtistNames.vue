<template>
  <span v-for="(artist, i) in artists" :key="artist.id">
    {{ i !== 0 ? '&nbsp;/&nbsp;' : ''
    }}<router-link
      to=""
      :class="`text-xs ${textColor} ${'hover:' + textColor} hover:underline`"
      :title="intactTitle ? allAr : artist.name"
    >
      {{ artist.name }}
    </router-link>
  </span>
</template>

<script>
export default {
  props: {
    artists: Array,
    textColor: String,
    intactTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allAr() {
      if (!this.intactTitle) return
      return this.artists.map(ar => ar.name).join(' / ')
    }
  }
}
</script>

<style></style>
