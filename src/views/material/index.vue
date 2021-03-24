<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-page-header @back="goBack" content="素材管理"> </el-page-header>
      </div>
      <material-list></material-list>
    </el-card>
  </div>
</template>
<script>
import MaterialList from '@/components/materialList.vue'

export default {
  name: 'material',
  components: {
    MaterialList
  },
  props: [],
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  },
  created() {}
}
</script>
<style scoped lang="less"></style>
