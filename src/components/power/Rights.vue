<template>
  <div>
    <!--导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
     <!--列表-->
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'" size="small">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'" size="small">等级二</el-tag>
            <el-tag type="warning" v-else size="small">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList:[],
    }
  },
  created() {
    this.getrightsList()
  },
  methods:{
    //获取列表数据
    async getrightsList(){
      const {data:res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rightsList = res.data
    }

  }
}

</script>

<style lang="less">

</style>
