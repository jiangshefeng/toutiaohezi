<template>
  <el-card class="publish_content">
    <div slot="header" class="clearfix">
      <el-page-header @back="goBack" :content="switcher + '文章'">
      </el-page-header>
    </div>
    <el-form
      v-loading="loading"
      ref="articleForm"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-tiptap
          height="500"
          v-model="form.content"
          :extensions="extensions"
          placeholder="请输入文章内容"
        ></el-tiptap>
      </el-form-item>
      <el-form-item label="封面" prop="cover.type">
        <el-radio-group v-model="form.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道" prop="channel_id">
        <el-select v-model="form.channel_id" placeholder="请选择">
          <el-option
            v-for="(channel, index) in channels"
            :key="index"
            :label="channel.name"
            :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(false)" :loading="loading">{{
          switcher
        }}</el-button>
        <el-button @click="onSubmit(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import 'element-tiptap/lib/index.css'
import {
  getArticleChannel,
  publishArticle,
  getArticleById,
  editArticle
} from '@/api/article'
import { uploadImg } from '@/api/image'
import {
  // necessary extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image
} from 'element-tiptap'
export default {
  name: 'publish',
  props: [],
  components: {
    'el-tiptap': ElementTiptap
  },

  data() {
    return {
      form: {
        title: '',
        content: '',
        cover: {
          images: [],
          type: ''
        },
        channel_id: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题名称',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '至少大于5个字符',
            trigger: 'blur'
          }
        ],
        'cover.type': [
          {
            required: true,
            message: '请选择封面类型',
            trigger: 'change'
          }
        ],
        channel_id: [
          {
            required: true,
            message: '请选择频道类型',
            trigger: 'change'
          }
        ],
        content: [
          {
            validator: (rule, value, callback) => {
              if (value === '<p></p>') {
                callback(new Error('内容不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          }
        ]
      },
      channels: [],
      loading: false,
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          async uploadRequest(file) {
            const fd = new FormData()
            fd.append('image', file)
            const res = await uploadImg(fd)

            return res.data.data.url
          }
        })
      ]
    }
  },
  methods: {
    // 回退
    goBack() {
      this.$router.go(-1)
    },
    // 提交
    onSubmit(draft) {
      this.loading = true
      this.$refs['articleForm'].validate(async valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        const id = this.$route.query.id
        let res = null
        if (id) {
          res = await editArticle(id, this.form, draft)
        } else {
          res = await publishArticle(this.form, draft)
        }

        if (res.status === 201) {
          this.$message({
            message: `${draft ? '存入草稿草稿' : '发布或修改成功'} `,
            type: `${draft ? 'info' : 'success'} `
          })
          this.$refs['articleForm'].resetFields()
          this.$router.push('/article')
        } else {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    // 加载频道
    async loadChannel() {
      const res = await getArticleChannel()
      this.channels = res.data.data.channels
    },
    // 加载文章
    async loadArticle() {
      const id = this.$route.query.id
      const res = await getArticleById(id)
      this.form = res.data.data
    }
  },
  created() {
    this.loadChannel()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  computed: {
    switcher() {
      return this.$route.query.id ? '修改' : '发布'
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (from.query.id) {
      this.$refs['articleForm'].resetFields()
      next()
    } else {
      next()
    }
  }
}
</script>
<style scoped lang="less"></style>
