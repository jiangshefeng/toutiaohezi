<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-page-header @back="goBack" content="素材管理"> </el-page-header>
      </div>
      <div class="switch_radio">
        <el-radio-group v-model="radio" @change="loadImage">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>

        <el-button type="success" @click="dialogVisible = true"
          >添加素材</el-button
        >
      </div>
      <el-row :gutter="10">
        <el-col
          v-for="image in images"
          :key="image.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <el-image style=" height: 100px" :src="image.url" fit="cover ">
            <div slot="error" class="image-slot">
              <img src="./1.png" height="100" /></div
          ></el-image>
        </el-col>
      </el-row>
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
import { getImg } from '@/api/image'
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
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadImage(collect = false) {
      const res = await getImg({
        collect
      })
      this.images = res.data.data.results
    },
    uploadSuccess() {
      this.dialogVisible = false
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
</style>
