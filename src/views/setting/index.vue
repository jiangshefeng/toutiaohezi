<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-page-header @back="goBack" content="个人设置"> </el-page-header>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 个人信息 -->
          <el-form
            ref="userForm"
            :model="user"
            label-width="80px"
            :rules="rule"
          >
            <el-form-item label="编号">{{ user.id }} </el-form-item>
            <el-form-item label="手机"> {{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="userloading"
                type="primary"
                @click="onUpdateUser"
                >修改</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 头像 -->
        <el-col :span="8" class="avatar_wrap">
          <label for="fileInput">
            <el-avatar shape="square" :size="200" :src="user.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>

          <input
            ref="file"
            type="file"
            hidden
            id="fileInput"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 修改头像对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onPreviewImg"
      @open="beforePreviewImg"
    >
      <div>
        <img :src="previewImg" class="previewImg" ref="preview-img" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="closeDialogEvent"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateUserPhoto, getUserInfo, updateUserInfo } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/util/global-bus.js'
export default {
  name: 'setting',
  props: [],
  data() {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      previewImg: '',
      dialogVisible: false,
      cropper: null,
      loading: false,
      userloading: false,
      rule: {
        name: [
          {
            required: true,
            max: 7,
            min: 1,
            trigger: 'blur',
            message: '名称必须在1-7个字符'
          }
        ]
      }
    }
  },
  methods: {
    // 回退
    goBack() {
      this.$router.go(-1)
    },
    onUpdateUser() {
      this.$refs['userForm'].validate(async valid => {
        if (!valid) {
          return
        }
        this.userloading = true
        await updateUserInfo(this.user)
        this.$message({
          type: 'success',
          message: '修改信息成功'
        })
        this.userloading = false
        globalBus.$emit('update-user', this.user)
      })
    },
    onFileChange() {
      const file = this.$refs.file
      const blobData = URL.createObjectURL(file.files[0])
      this.previewImg = blobData
      this.dialogVisible = true
      this.$refs.file.value = ''
    },
    onPreviewImg() {
      if (this.cropper) {
        return
      }
      const image = this.$refs['preview-img']
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
      })
    },
    closeDialogEvent() {
      this.loading = true
      this.cropper.getCroppedCanvas().toBlob(async file => {
        const formData = new FormData()
        formData.append('photo', file)
        await updateUserPhoto(formData)

        this.dialogVisible = false
        this.user.photo = window.URL.createObjectURL(file)
        globalBus.$emit('update-user', this.user)
        this.loading = false
        this.$message({
          type: 'success',
          message: '修改头像成功'
        })
      })
    },
    beforePreviewImg() {
      if (this.cropper) {
        this.cropper.replace(this.previewImg)
      }
    }
  },
  async created() {
    await getUserInfo()
    this.user = JSON.parse(sessionStorage.getItem('userInfo'))
  }
}
</script>
<style scoped lang="less">
.avatar_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
}
.previewImg {
  display: block;

  max-width: 100%;
}
</style>
