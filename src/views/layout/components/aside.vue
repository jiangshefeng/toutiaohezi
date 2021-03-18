<template>
  <div class="aside_wrap">
    <div class="aside_collapse" @click="handleCollapse" :style="toggleWidth">
      <i
        :class="{
          'el-icon-s-fold': !isCollapse,
          'el-icon-s-unfold': isCollapse
        }"
      ></i>
    </div>
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-document"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="el-icon-folder"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-chat-line-square"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-present"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'AppAside',
  props: [],
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {},
  computed: {
    toggleWidth() {
      return this.isCollapse ? { width: '63px' } : { width: '200px' }
    },
    activePath() {
      const path = this.$route.path
      console.log(path)
      return path
    }
  }
}
</script>
<style scoped lang="less">
.aside_wrap {
  display: flex;
  flex-direction: column;

  .el-menu {
    flex: 1;
  }
  .aside_collapse {
    color: white;
    background-color: #545c64;
    cursor: pointer;
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1px;
    height: 20px;
  }
}
</style>
