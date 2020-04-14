<template>
  <div>
    <!--面包导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <!--搜索框-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" size="small" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--添加商品-->
        <el-col :span="4">
          <el-button type="primary" size="small" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--数据列表-->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="93"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template v-slot="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removByID(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "list",
  data() {
    return {
      goodsList: [],//数据列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 9
      },
      total: 0,//获取的总数据
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //pageSize 改变时会触发
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getGoodsList()
    },
    //pagenum 改变时会触发
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodsList()
    },
    //删除商品
    async removByID(id) {
      const confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err)=>{
        return err
      })
      if (confirm !== 'confirm'){
        return this.$message.info('你取消了删除')
      }
      const {data: res} = await this.$http.delete('goods/' + id + '')
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    //添加商品
    goAddpage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped lang="less">
  .el-table {

  }
</style>
