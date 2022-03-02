<template>
  <h4 class="w-full h-6 mb-6 border-b border-gray-400 flex items-baseline justify-between">
    <span class="text-xs font-bold">{{ left }}</span>
    <router-link v-if="right" class="text-xs" :to="right">查看全部&gt;</router-link>
  </h4>
</template>

<script>
export default {
  props: {
    left: String,
    right: String
  }
}
</script>
