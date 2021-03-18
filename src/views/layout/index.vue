<template>
  <el-container class="layout_container">
    <el-header class="layout_header" height="50px">
      <div class="title">头条管理系统</div>

      <el-dropdown>
        <div class="user_wrap">
          <el-avatar :size="40" :src="user.photo"></el-avatar>
          <span class="el-dropdown-link">
            {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-setting">个人设置</el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-d-arrow-right"
            @click.native="onLogout"
            >退出</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="auto"
        ><app-aside class="aside_menu"></app-aside
      ></el-aside>
      <el-main class="layout_main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
import AppAside from './components/aside'
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'layout',
  components: {
    AppAside
  },
  props: [],
  data () {
    return {
      user: {}
    }
  },
  methods: {
    async getUserProfile () {
      await getUserInfo()
      this.user = JSON.parse(sessionStorage.getItem('userInfo'))
    },
    async onLogout () {
      const res = await this.$confirm('即将退出, 是否继续?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(res)
      if (res === 'confirm') {
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      } else {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      }
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>
<style scoped lang="less">
.layout_container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .aside_menu {
    height: 100%;
  }
  .el-aside {
    height: 100vh;
  }
  .layout_header {
    background-color: #d3d3d3;
    border: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
    }

    .user_wrap {
      .el-avatar {
        margin-right: 10px;
      }
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.layout_main {
  height: 100vh;
  padding-bottom: 40px;
}
</style>
