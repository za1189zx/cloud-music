<template>
  <!-- 标题 -->
  <Header left="评论" leftClass="text-xl">
    <template v-slot:left>
      <span class="pl-4 text-gray-600">{{ `共${count}条评论` }}</span>
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
      <CommentTools :t="1" @refresh="pageChangeHandler(current)">
        <!-- 箭头 -->
        <i class="w-2 h-2 block border-t border-l border-gray-300 absolute top-4 -left-1 bg-white transform -rotate-45"></i>
      </CommentTools>
    </div>
  </div>
  <!-- 精彩评论 -->
  <MiniHeader v-if="current === 1 && hotList && hotList.length" left="精彩评论" />
  <CommentBill v-if="current === 1 && hotList && hotList.length" :list="hotList" @refresh="pageChangeHandler(current)" />
  <!-- 最新评论 -->
  <MiniHeader v-if="current === 1 && currentList && currentList.length" :left="`最新评论(${count})`" />
  <CommentBill v-if="currentList && currentList.length" :list="currentList" @refresh="pageChangeHandler(current)" />
  <!-- 分页器 -->
  <div class="flex-center">
    <a-pagination v-model:current="current" :defaultPageSize="20" :total="count" @change="pageChangeHandler">
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
import api from '@/api'

export default {
  data() {
    return {
      current: 1,
      comments: null,
      hotComments: null,
      total: null
    }
  },
  inject: ['resourceType', 'resourceId', 'commentList'],
  computed: {
    hotList() {
      return this.hotComments || this.commentList.hotComments
    },
    currentList() {
      return this.comments || this.commentList.comments
    },
    count() {
      return this.total || this.commentList.total
    }
  },
  methods: {
    listInit() {
      this.hotList = this.commentList.hotComments
      this.currentList = this.commentList.comments
      this.commentCount = this.commentList.commentCount
    },
    async pageChangeHandler(page) {
      const { data: res } = await api.getComment(this.resourceType, this.resourceId, page)
      if (res.code === 200) {
        if (page === 1) this.hotComments = res.hotComments
        this.comments = res.comments
        this.total = res.total
      }
    }
  },
  components: { Header, CommentTools, MiniHeader, CommentBill }
}
</script>

<style></style>
