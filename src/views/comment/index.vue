<template>
  <div class="comment_container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="评论管理"> </el-page-header>
      </div>
      <!-- 表格 -->
      <el-table :data="commentData" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" width="600px">
        </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="评论状态">
          <template v-slot="props">
            <el-tag
              v-if="props.row.comment_status"
              effect="dark"
              type="success"
            >
              正常</el-tag
            >
            <el-tag v-else effect="dark" type="danger">关闭 </el-tag>
          </template></el-table-column
        >
        <el-table-column label="操作">
          <template v-slot="props">
            <div>
              <el-switch
                v-model="props.row.comment_status"
                @change="controlComments(props.row)"
                :disabled="props.row.statusDisabled"
              >
              </el-switch>
            </div> </template
        ></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="bottom_pageination">
        <el-pagination
          @current-change="pageChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="totalCount"
          background
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getArticleInfo, updateCommentStatus } from '@/api/article'
export default {
  name: 'comment',
  props: [],
  data() {
    return {
      currentPage: 1,
      commentData: [],
      totalCount: 0
    }
  },
  methods: {
    // 回退
    goBack() {
      this.$router.go(-1)
    },
    // 载入评论
    async loadComment() {
      const res = await getArticleInfo({
        response_type: 'comment',
        page: this.currentPage,
        per_page: 15
      })
      console.log(res)
      const { results, total_count: total } = res.data.data
      results.forEach(v => (v.statusDisabled = false))
      this.commentData = results
      this.totalCount = total
    },
    // 控制评论开关
    async controlComments(comment) {
      comment.statusDisabled = true
      await updateCommentStatus(comment.id.toString(), comment.comment_status)
      comment.statusDisabled = false
    },
    // 换页操作
    pageChange() {
      this.loadComment()
    }
  },
  created() {
    this.loadComment()
  }
}
</script>
<style scoped lang="less">
.bottom_pageination {
  padding-top: 20px;
}
</style>
