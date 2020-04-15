<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜素-->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" size="small"></el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" icon="el-icon-search" @click="getorderList" size="small">搜索</el-button>
        </el-col>
      </el-row>
      <!--数据表格-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="600px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay==='1'">付款成功</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="showbox" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="showphysical" type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 10, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--修改地址的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="40%"
      @close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市县/区" prop="address">
          <el-cascader
            v-model="ruleForm.address"
            :options="cityData"
            :props="props"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="particularAddress">
          <el-input v-model="ruleForm.particularAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--展示物流对话框-->
    <el-dialog
      title="物流信息"
      :visible.sync="physicalDialogVisible"
      width="40%">
      <!--时间线-->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in physical"
          :key="index"
          :timestamp="activity.time"
          :color="color"
        >
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  name: "order",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,//当前页码
        pagesize: 10//每页显示的条数
      },
      orderList: [],//列表数据
      total: 0,//显示的总条数
      dialogVisible:false,
      ruleForm:{//对话框表单数据
        address:'',
        particularAddress:''
      },
      //表单验证
      rules:{
        address:[
          { required: true, message: '请选择地址', trigger: 'change' },
        ],
        particularAddress:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      props:{
        expandTrigger: 'hover'
      },
      physicalDialogVisible:false,//物流信息对话框
      physical:[],//物流数据信息
      reverse: true,
      color:'#0bbd0e'//物流圆点信息
    }
  },
  created() {
    this.getorderList()
  },
  methods: {
    async getorderList() {
      const {data: res} = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表数据失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newsize) {//分页每页显示的条数
      this.queryInfo.pagesize = newsize
      this.getorderList()
    },
    handleCurrentChange(newpagenum) {//分页页码
      this.queryInfo.pagenum = newpagenum
      this.getorderList()
    },
    showbox(){
      this.dialogVisible = true
    },
    handleClose(){//对话框关闭监听事件
      this.$refs.ruleForm.resetFields()
    },
    async showphysical(){//打开物流信息对话框
      //获取物流信息
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200){
        this.physicalDialogVisible = false
        return this.$message.error('查询物流信息失败')
      }
      this.physicalDialogVisible = true
      this.physical = res.data
    },
  }
}
</script>

<style scoped lang="less">
.el-cascader{
  width: 100%;
}
</style>
