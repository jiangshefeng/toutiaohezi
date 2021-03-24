<template>
  <div class="fans_container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="粉丝管理"> </el-page-header>
      </div>
      <!-- 粉丝列表 -->
      <div class="fans_wrap" v-for="(item, index) in fans" :key="index">
        <el-avatar :size="70" :src="item.photo"></el-avatar>
        <div class="name">{{ item.name }}</div>
        <el-tag class="fans_guanzhu">+关注</el-tag>
      </div>
      <!-- 分页功能 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total_count"
        :current-page.sync="query.page"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getFansList } from '@/api/fans'
export default {
  name: 'fans',
  props: [],
  data() {
    return {
      query: {
        page: 1,
        per_page: 20
      },
      total_count: 0,
      fans: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async getFans() {
      const res = await getFansList(this.query)
      const { results: fans, total_count } = res.data.data
      this.fans = fans
      this.total_count = total_count
    },
    pageChange() {
      this.getFans()
    }
  },
  created() {
    this.getFans()
  }
}
</script>
<style scoped lang="less">
.fans_wrap {
  display: flex;
  flex-direction: column;
  height: 230px;
  width: 130px;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0;
  border: 1px dashed #ccc;
  margin: 20px;
  .fans_guanzhu {
    cursor: pointer;
  }
}
.fans_wrap:hover {
  border-color: #409eff;
}
</style>
