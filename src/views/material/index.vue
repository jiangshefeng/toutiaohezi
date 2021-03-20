<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <div slot="header">
        <el-page-header @back="goBack" content="素材管理"> </el-page-header>
      </div>
      <div class="switch_radio">
        <el-radio-group v-model="radio" @change="collectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>

        <el-button type="success" @click="dialogVisible = true"
          >添加素材</el-button
        >
      </div>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col
          v-for="image in images"
          :key="image.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <div class="img_wrap">
            <el-image style=" height: 180px" :src="image.url" fit="cover ">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size:20px"></i>
              </div>
            </el-image>
            <div class="img_tool">
              <!-- 收藏 -->
              <i
                @click="collectImg(image.id, image.is_collected)"
                :class="[
                  !image.is_collected
                    ? 'icon el-icon-star-off '
                    : 'icon-red el-icon-star-on'
                ]"
              ></i>
              <!-- 删除 -->
              <i class="icon el-icon-delete" @click="deletImg(image.id)"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        @current-change="onPageChange"
        background
        layout="prev, pager, next"
        :total="total_count"
        :current-page.sync="pNum"
        :page-size="20"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="上传素材"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="50%"
      :center="true"
    >
      <el-upload
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        name="image"
        :headers="uploadHeaders"
        :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { getImg, deleteImg, collectImage } from '@/api/image'
export default {
  name: 'material',
  props: [],
  data() {
    const { token } = JSON.parse(sessionStorage.getItem('user')) || ''
    return {
      radio: false,
      images: [],
      dialogVisible: false,
      uploadHeaders: {
        Authorization: 'Bearer ' + token
      },
      total_count: 0,
      pNum: 1,
      loading: false,
      isActive: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 加载图片
    async loadImage(collect = false) {
      this.loading = true
      const res = await getImg({
        page: this.pNum,
        collect
      })
      this.total_count = res.data.data.total_count
      this.images = res.data.data.results
      this.loading = false
    },
    // 上传成功
    uploadSuccess() {
      this.dialogVisible = false
      this.loadImage()
    },
    // 页数改变
    onPageChange() {
      this.loadImage()
    },
    // 切换收藏
    collectChange(swich) {
      this.loadImage(swich)
    },
    // 删除图片
    async deletImg(id) {
      const result = await this.$confirm(
        '此操作将永久删除该图片, 是否继续?',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result === 'confirm') {
        const res = await deleteImg(id)
        if (res.status === 204) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            message: '删除失败',
            type: 'error'
          })
        }
        this.loadImage()
      }
    },
    // 收藏图片
    async collectImg(id, isCollect) {
      const collect = !isCollect
      await collectImage(id, collect)
      this.loadImage()
    }
  },
  created() {
    this.loadImage()
  }
}
</script>
<style scoped lang="less">
.switch_radio {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.el-col {
  margin-top: 10px;
}
/deep/ .el-dialog__body {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-upload__tip {
  text-align: center;
}
.el-row {
  padding: 30px;
}
.img_wrap {
  position: relative;
  .img_tool {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20%;
    background-color: rgba(0, 0, 0, 0.4);
    .icon {
      font-size: 18px;
      color: #f5f5f5;
      cursor: pointer;
    }
    .icon-red {
      font-size: 22px;
      color: red;
      cursor: pointer;
    }
  }
}
</style>
