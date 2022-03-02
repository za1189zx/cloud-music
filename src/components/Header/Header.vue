<template>
  <h3
    v-if="windowWidth >= 640"
    :class="`w-full h-9 px-3 mt-4 mb-0 border-b-2 border-red-600 flex items-baseline justify-between`"
  >
    <div>
      <span :class="leftClass">{{ left }}</span>
      <slot name="left"></slot>
    </div>
    <router-link v-if="right" class="text-xs" :to="right">更多&gt;</router-link>
    <slot name="right"></slot>
  </h3>
  <h3 v-if="windowWidth < 640" class="py-2 flex">
    <span class="pl-3 border-l-2 border-red-600 text-base">{{ left }}</span>
  </h3>
</template>

<script>
export default {
  props: {
    left: String,
    leftClass: {
      type: String,
      default: 'text-lg'
    },
    right: String
  },
  inject: ['windowWidth']
}
</script>
