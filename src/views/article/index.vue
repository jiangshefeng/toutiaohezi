<template>
  <div>
    <!--条件筛选  -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="内容管理"> </el-page-header>
      </div>
      <el-form ref="form" :model="form" label-width="80px" size="medium">
        <el-form-item label="状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失效"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.value1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">立即查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询结果显示 -->
    <el-card class="show_table">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到46147条结果</span>
      </div>
      <el-table :data="articleData" style="width: 100%">
        <el-table-column label="封面">
          <template v-slot="props" class="test">
            <el-image
              style="width: 100px; height: 100px"
              :src="props.row.cover.images[0]"
            >
              <div slot="error" class="image_slot">
                <i class=" el-icon-picture-outline"></i></div
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="props">
            <el-tag v-if="props.row.status === 0" effect="dark" type=""
              >草稿
            </el-tag>
            <el-tag
              effect="dark"
              type="warning"
              v-else-if="props.row.status === 1"
              >待审核
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-else-if="props.row.status === 2"
              >审核通过
            </el-tag>
            <el-tag
              effect="dark"
              type="danger"
              v-else-if="props.row.status === 3"
              >审核失败
            </el-tag>
            <el-tag effect="dark" type="info" v-else-if="props.row.status === 4"
              >已删除
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              icon="el-icon-edit"
              type="primary"
              circle
              size="small "
            ></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              circle
              size="small "
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="table_pagination"
        background
        layout="prev, pager, next"
        :total="1000"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getArticleInfo } from '@/api/article'
export default {
  name: 'ArtcleIndex',
  props: [],
  data() {
    return {
      form: {
        region: '',
        value1: '',
        resource: ''
      },
      articleData: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadArticle() {
      const res = await getArticleInfo()
      console.log(res)
      this.articleData = res.data.data.results
    }
  },
  created() {
    this.loadArticle()
  }
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
