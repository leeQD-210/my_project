<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <el-table :data="rightsList" width="100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="权限路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template v-slot="{ row }">
              <el-tag v-if="row.level==='0'" type="primary">一级</el-tag>
              <el-tag v-else-if="row.level==='1'" type="success">二级</el-tag>
              <el-tag v-else-if="row.level==='2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  /* 组件被创建时初始化权限列表 */
  created() {
    this.getRightsList()
  },
  methods: {
    /* 初始化查询权力列表 */
    getRightsList: async function() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status === 200) {
        this.rightsList = res.data
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
