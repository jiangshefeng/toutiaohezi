<template>
  <div>
    <!--条件筛选  -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="内容管理"> </el-page-header>
      </div>
      <el-form label-width="80px" size="medium">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失效</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="channel" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="queryArticle"
            >立即查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询结果显示 -->
    <el-card class="show_table">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ totalCount || 0 }}条结果</span>
      </div>
      <el-table
        :data="articleData"
        style="width: 100%"
        v-loading="loading"
        size="mini"
      >
        <el-table-column label="封面">
          <template v-slot="props" class="test">
            <el-image
              style="width: 70px; height: 70px"
              :src="props.row.cover.images[0]"
              lazy
              fit="cover"
            >
              <div slot="error" class="image_slot">
                <i class=" el-icon-picture-outline"></i></div
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="props">
            <el-tag effect="dark" :type="articleStatus[props.row.status].type"
              >{{ articleStatus[props.row.status].name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="props">
            <el-button
              icon="el-icon-edit"
              type="primary"
              circle
              size="small "
              @click="editEvent(props.row.id)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              circle
              size="small "
              @click="deleteArticle(props.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="table_pagination"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page.sync="page"
        @current-change="handlePageChange"
        :disabled="loading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticleInfo, getArticleChannel, removeArticle } from '@/api/article'
export default {
  name: 'ArtcleIndex',
  props: [],
  data() {
    return {
      articleData: [],
      articleStatus: [
        { status: 0, name: '草稿', type: '' },
        { status: 1, name: '待审核', type: 'warning' },
        { status: 2, name: '审核通过', type: 'success' },
        { status: 3, name: '审核失败', type: 'danger' },
        { status: 4, name: '已删除', type: 'info' }
      ],
      totalCount: 0,
      status: null,
      channels: [],
      channel: null,
      dateRange: null,
      loading: false,
      page: 1
    }
  },
  methods: {
    // 回退
    goBack() {
      this.$router.go(-1)
    },
    // 加载文章
    async loadArticle(page = 1) {
      this.loading = true
      const res = await getArticleInfo({
        page: page,
        per_page: 10,
        status: this.status,
        channel_id: this.channel,
        begin_pubdate: this.dateRange?.[0],
        end_pubdate: this.dateRange?.[1]
      })

      const { total_count: totalCount, results } = res.data.data
      this.articleData = results
      this.totalCount = totalCount
      this.loading = false
    },
    // 分页
    handlePageChange(page) {
      this.loadArticle(page)
    },
    // 查询文章
    queryArticle() {
      this.loadArticle()
    },
    // 获取频道
    async getChanle() {
      const res = await getArticleChannel()
      this.channels = res.data.data.channels
    },
    // 删除文章
    async deleteArticle(id) {
      const res = await this.$confirm(
        '此操作将永久删除该文章, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res === 'confirm') {
        await removeArticle(id.toString())
        await this.loadArticle(this.page)
      }
    },
    // 修改文章
    editEvent(id) {
      this.$router.push(`/publish?id=${id}`)
    }
  },
  created() {
    this.loadArticle()
    this.getChanle()
  },
  computed: {}
}
</script>
<style scoped lang="less">
/deep/ .el-form-item__label {
  padding-right: 25px;
}
.el-radio {
  margin-top: 10px;
}
.show_table {
  margin-top: 20px;
  .table_pagination {
    margin-top: 20px;
  }
  /deep/.image_slot {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
