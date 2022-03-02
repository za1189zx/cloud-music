<template>
  <!-- 标题 -->
  <Header left="评论" leftClass="text-xl">
    <template v-slot:left>
      <span class="pl-4 text-gray-600">{{ `共${commentCount}条评论` }}</span>
    </template>
  </Header>
  <!-- 主动评论 -->
  <div class="w-full my-5">
    <!-- 你的头像 -->
    <div class="float-left">
      <img :src="$store.getters.avatarUrl + '?param=48y48'" />
    </div>
    <!-- 评论 -->
    <div class="ml-16">
      <CommentTools :resourceId="resourceId" :type="type" :t="1" @refresh="pageChangeHandler(current)">
        <!-- 箭头 -->
        <i class="w-2 h-2 block border-t border-l border-gray-300 absolute top-4 -left-1 bg-white transform -rotate-45"></i>
      </CommentTools>
    </div>
  </div>
  <!-- 精彩评论 -->
  <MiniHeader v-if="current === 1 && hotList && hotList.length" left="精彩评论" />
  <CommentBill
    v-if="current === 1 && hotList && hotList.length"
    :list="hotList"
    :resourceId="resourceId"
    :type="type"
    @refresh="pageChangeHandler(current)"
  />
  <!-- 最新评论 -->
  <MiniHeader v-if="current === 1 && currentList && currentList.length" :left="`最新评论(${commentCount})`" />
  <CommentBill
    v-if="currentList && currentList.length"
    :list="currentList"
    :resourceId="resourceId"
    :type="type"
    @refresh="pageChangeHandler(current)"
  />
  <!-- 分页器 -->
  <div class="flex-center">
    <a-pagination v-model:current="current" :defaultPageSize="20" :total="commentCount" @change="pageChangeHandler">
      <template #itemRender="{ type, originalElement }">
        <a v-if="type === 'prev'" class="ant-pagination-item-link px-3">上一页</a>
        <a v-else-if="type === 'next'" class="ant-pagination-item-link px-3">下一页</a>
        <component :is="originalElement" v-else></component>
      </template>
    </a-pagination>
  </div>
</template>

<script>
import Header from '../Header/Header.vue'
import CommentTools from './CommentTools.vue'
import MiniHeader from '../Header/MiniHeader.vue'
import CommentBill from './CommentBill.vue'

export default {
  data() {
    return {
      current: 1,
      hotList: null,
      currentList: null
    }
  },
  props: {
    commentCount: Number,
    list: Object,
    callback: Function,
    // 资源的 id
    resourceId: [String, Number],
    // 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频; 6: 动态
    type: Number
  },
  methods: {
    listInit() {
      this.hotList = this.list.hotComments
      this.currentList = this.list.comments
      console.log('评论更新')
    },
    async pageChangeHandler(page) {
      const { data: res } = await this.callback(this.resourceId, page)
      if (res.code === 200) {
        if (page === 1) this.hotList = res.hotComments
        this.currentList = res.comments
      }
    }
  },
  watch: {
    'list.comments': {
      handler() {
        this.listInit()
      },
      immediate: true,
      deep: true
    }
  },
  components: { Header, CommentTools, MiniHeader, CommentBill }
}
</script>

<style></style>
