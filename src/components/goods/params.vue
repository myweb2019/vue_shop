<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--警告框-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning" :closable="false" show-icon>
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联-->
          <el-cascader
            v-model="selectCatKeys"
            :options="catList"
            :props="cateprops"
            @change="handleChange"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <!--动态参数面板-->
          <el-button type="primary" size="small" :disabled="isbutDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <!--静态属性面板-->
          <el-button type="primary" size="small" :disabled="isbutDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      catList:[],//商品分类数据
      selectCatKeys:'',//级联选择框的绑定数据
      cateprops:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      activeName:'first',//默认被激活页签的name
    }
  },
  created() {
    this.getCatList()
  },
  methods:{
    //获取所有商品的数据
    async getCatList(){
      const {data:res} = await this.$http.get('categories')
      if (res.meta.status !==200) return this.$message.error('获取数据失败')
      this.catList = res.data
      console.log(this.catList)
    },
    //级联选择框选择会触发该函数
    handleChange(){
      console.log(this.selectCatKeys)
    },
    //tab页签点击事件
    handleClick(){

    }
  },
  //计算属性
  computed:{
    isbutDisabled(){
      if(this.selectCatKeys.length !== 3){
        return true
      }
      return false
    }
  }
}
</script>

<style scoped lang="less">
  .cat_opt {
    margin: 15px 0;
  }
</style>
