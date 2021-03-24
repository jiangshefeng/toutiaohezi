<template>
  <div>
    <div class="cover-container" @click="showDialog">
      <img class="cover-img" v-if="Url" :src="Url" alt="" />
      <i v-else class="el-icon-plus"></i>
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <material-list
            :isAddFun="false"
            :isShowTool="false"
            :isSelectTool="true"
            ref="materList"
          ></material-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-button type="primary" @click="uploadFile">点击上传</el-button>
          <input
            type="file"
            id="fileInput"
            hidden
            ref="file"
            @change="onFileChange"
          />
          <div class="image_wrap">
            <img src="" alt="" ref="preview-image" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confrimUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MaterialList from '@/components/materialList.vue'
import { uploadImg } from '@/api/image'

export default {
  name: 'UpdateCover',
  props: ['imageUrl'],
  components: {
    MaterialList
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'second',
      Url: this.imageUrl
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    uploadFile() {
      this.$refs.file.click()
    },
    onFileChange() {
      const file = this.$refs.file.files[0]

      const blob = URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    async confrimUpdate() {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message({
            type: 'warning',
            message: '请选择文件'
          })
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImg(fd)
        this.dialogVisible = false
        this.Url = res.data.data.url
        this.$emit('updateCover', res.data.data.url)
      } else if (this.activeName === 'first') {
        const res = this.$refs['materList']
        if (res.select === null) {
          this.$message({
            type: 'warning',
            message: '请选择文件'
          })
          return
        }
        this.Url = res.images[res.select].url
        this.$emit('updateCover', res.images[res.select].url)
        this.dialogVisible = false
      }
    }
  },
  created() {}
}
</script>
<style scoped lang="less">
.cover-container {
  border: 1px dashed #d9d9d9;
  width: 180px;
  height: 180px;
  cursor: pointer;
  border-radius: 6px;
  .cover-img {
    width: 180px;
    height: 180px;
  }
}
.cover-container:hover {
  border-color: #409eff;
}
.el-icon-plus {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image_wrap {
  margin: 20px;
}
</style>
