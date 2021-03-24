<template>
  <div>
    <div class="switch_radio">
      <el-radio-group v-model="radio" @change="collectChange">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>

      <el-button
        v-if="isAddFun"
        type="success"
        @click.native="dialogVisible = true"
        >添加素材</el-button
      >
    </div>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col
        v-for="(image, index) in images"
        :key="image.id"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
      >
        <div class="img_wrap" @click="select = index">
          <el-image style=" height: 180px" :src="image.url" fit="cover ">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:20px"></i>
            </div>
          </el-image>
          <div class="img_tool" v-if="isShowTool">
            <!-- 收藏 -->
            <el-button
              :loading="image.isloading"
              type="warning"
              @click="collectImg(image)"
              :icon="
                image.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'
              "
              circle
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deletImg(image.id)"
              circle
              size="mini"
            ></el-button>
          </div>
          <div class="select_fun" v-if="isSelectTool && select === index"></div>
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
  name: 'MaterialList',
  props: {
    isAddFun: { Boolean, default: true },
    isShowTool: { Boolean, default: true },
    isSelectTool: { Boolean, default: false }
  },
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
      select: null,
      isActive: true
    }
  },
  methods: {
    // 加载图片
    async loadImage(page) {
      if (page) {
        this.pNum = page
      }
      const res = await getImg({
        page: this.pNum,
        collect: this.radio
      })
      this.total_count = res.data.data.total_count
      const result = res.data.data.results
      // 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
      // 由于 Vue会在初始化实例时对属性执行 getter/setter 转化过程，
      // 所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的
      result.forEach(v => {
        v.isloading = false
      })
      this.images = result
    },
    // 上传成功
    uploadSuccess() {
      this.dialogVisible = false
      this.loadImage(this.pNum)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    // 页数改变
    onPageChange() {
      this.loadImage()
    },
    // 切换收藏
    collectChange() {
      this.loadImage(1)
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
    async collectImg(image) {
      image.isloading = true
      const collect = !image.is_collected
      await collectImage(image.id, collect)
      this.loadImage()
      if (collect) {
        this.$notify({
          title: '成功',
          message: '收藏成功',
          type: 'success'
        })
      } else {
        this.$notify({
          title: '提示',
          message: '取消收藏',
          type: 'info'
        })
      }
      image.isloading = false
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
    bottom: 3px;
    width: 100%;
    height: 20%;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.select_fun {
  background-image: url('./1.png');
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.7;
}
</style>
