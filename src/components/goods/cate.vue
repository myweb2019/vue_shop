<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="small" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treetable"
      >
        <!--是否有效-->
        <template #isok="scope">
          <i style="color: lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!--排序-->
        <template #order="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="small" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="small" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template #opt="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="catedit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deletecat(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="40%"
      @close="addCteDialogclose"
    >
      <el-form :model="addCateForm" :rules="addCaterules" ref="addCateruleForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options是用来指定数据源-->
          <el-cascader
            v-model="selectedKeys"
            :options="options"
            :props="catecaderProps"
            @change="parentCateChanged"
            clearable
            multiple
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subCat">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editdialogVisible"
      width="40%">
      <el-form :model="editCateForm" :rules="editCaterules" ref="editCateruleForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subedit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      catelist: [],//商品分类数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        }
      ],
      //添加分类对话框
      dialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },//对话框数据绑定
      //对话框验证规则
      addCaterules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ],
      },
      options: [],
      catecaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      selectedKeys: [],//选中的父级的id数组
      //编辑
      editdialogVisible: false,
      editCateForm: {
        cat_name: '',
        cat_id: ''
      },
      editCaterules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
    this.goodsList()
  },
  methods: {
    //获取数据列表数据
    async goodsList() {
      const {data: res} = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据列表失败！')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //监听pagesize的改变
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.goodsList()
    },
    //监听pagenum的改变
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.goodsList()
    },
    //添加分类对话框按钮
    addCate() {
      //先获取父级分类数据
      this.getCatedata()
      //再打开
      this.dialogVisible = true
    },
    //获取父级分类数据
    async getCatedata() {
      const {data: res} = await this.$http.get('categories', {
        params: {type: '2'}
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.options = res.data
    },
    //选择项发生变化触发该函数
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_level = this.selectedKeys.length
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    //提交添加的数据
    subCat() {
      this.$refs.addCateruleForm.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.goodsList()
        this.dialogVisible = false
      })
    },
    //清空表单数据
    addCteDialogclose() {
      this.$refs.addCateruleForm.resetFields()
      //清空数组
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //编辑
    async catedit(data) {
      const {data: res} = await this.$http.get('categories/' + data.cat_id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateForm.cat_id = res.data.cat_id
      this.editdialogVisible = true
    },
    //提交修改
    subedit() {
      //预验证
      this.$refs.editCateruleForm.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('更新失败！')
        this.$message.success('更新成功')
        this.goodsList()
        this.editdialogVisible = false
      })
    },
    //删除分类
    async deletecat(data) {
      const confirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      if (confirm !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete('categories/'+data.cat_id)
      if (res.meta.status !== 200) return this.$message.info('已取消删除')
      this.$message.success('删除成功')
      this.goodsList()
    }
  }
}
</script>

<style scoped lang="less">
  .treetable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
