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
        <el-tab-pane label="动态参数" name="many">
          <!--动态参数面板-->
          <el-button type="primary" size="small" :disabled="isbutDisabled" @click="addDialogVisible = true">添加参数
          </el-button>
          <!--动态参数的表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable v-for="(item ,index) in scope.row.attr_vals" :key="index" @close="handlClose(index,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParmas(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!--静态属性面板-->
          <el-button type="primary" size="small" :disabled="isbutDisabled" @click="addDialogVisible = true">添加属性
          </el-button>
          <!--静态属性的表格-->
          <el-table :data="onlyTabelData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable v-for="(item ,index) in scope.row.attr_vals" :key="index" @close="handlClose(index,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary" @click="addParams" size="small">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改对话框-->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="eidtDialogVisible"
      width="40%"
      @close="eidtDialogClosed"
    >
      <el-form :model="eidtForm" :rules="eidtrules" ref="eidtForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="eidtForm.attr_name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eidtDialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary" @click="eidtParams" size="small">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      catList: [],//商品分类数据
      selectCatKeys: '',//级联选择框的绑定数据
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',//默认被激活页签的name
      manyTableData: [],//动态参数的数据
      onlyTabelData: [],//静态属性的数据,
      addDialogVisible: false,
      addForm: {//表单数据
        attr_name: ''
      },
      //添加表单验证规则
      rules: {
        attr_name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
        ]
      },
      //修改对话框
      eidtDialogVisible: false,
      eidtForm: {
        attr_name: ''
      },
      eidtrules: {
        attr_name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
        ]
      },
      //输入按钮切换
      inputVisible:false,
      inputValue:'',
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    //获取所有商品的数据
    async getCatList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.catList = res.data
    },
    //级联选择框选择会触发该函数
    async handleChange() {
      this.getParmsData()
    },
    //tab页签点击事件
    handleClick() {
      this.getParmsData()
    },
    //根据所选的id和面板获取对应的数据
    async getParmsData() {
      if (this.selectCatKeys.length !== 3){
        this.selectCatKeys = []
        this.manyTableData = []
        this.onlyTabelData = []
        return
      }
      const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes', {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals==""?[]:item.attr_vals.split(',')
        item.inputVisible = false
        item.inputValue=''
      })
      if (this.activeName == 'many') {
        this.manyTableData = res.data
      } else if (this.activeName == 'only') {
        this.onlyTabelData = res.data
      }
    },
    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    //点击按钮,添加参数
    addParams() {
      //表单预验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        //验证成功获取数据
        const {data: res} = await this.$http.post('categories/' + this.cateId + '/attributes', {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParmsData()
      })
    },
    //修改
    async showEditDialog(attrId) {
      //获取修改的数据
      const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes/' + attrId + '', {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取相关信息失败')
      }
      this.eidtForm = res.data
      this.eidtDialogVisible = true
    },
    //关闭对话框
    eidtDialogClosed() {
      this.$refs.eidtForm.resetFields()
    },
    //修改完成按钮
    eidtParams() {
      this.$refs.eidtForm.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('categories/' + this.cateId + '/attributes/' + this.eidtForm.attr_id + '', {
          attr_name: this.eidtForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getParmsData()
        this.eidtDialogVisible = false
      })
    },
    //删除
    async removeParmas(attrId) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      });
      if (confirm !== 'confirm') {
        return this.$message.info('你取消了删除')
      }
      const {data: res} = await this.$http.delete('categories/' + this.cateId + '/attributes/' + attrId + '')
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParmsData()
    },
    //输入文本后触发的事件
    async handleInputConfirm(scope){
      if (scope.inputValue.trim().length === 0){
        scope.inputValue = ''
        scope.inputVisible = false
        return
      }
      scope.attr_vals.push(scope.inputValue)
      //发起添加参数的请求
      console.log(scope.attr_vals);
      const {data:res} = await this.$http.put('categories/'+this.cateId+'/attributes/'+scope.attr_id+'',{
        attr_name:scope.attr_name,
        attr_sel:this.activeName,
        attr_vals:scope.attr_vals.join(',')
      })
      if (res.meta.status !== 200){
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      scope.inputValue = ''
      scope.inputVisible = false
    },
    //按钮事件
    showInput(scope){
      scope.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除参数
    async handlClose(index,scope){
      scope.attr_vals.splice(index,1)
      //发起添加参数的请求
      const {data:res} = await this.$http.put('categories/'+this.cateId+'/attributes/'+scope.attr_id+'',{
        attr_name:scope.attr_name,
        attr_sel:this.activeName,
        attr_vals:scope.attr_vals.join(' ')
      })
      if (res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
    }
  },
  //计算属性
  computed: {
    isbutDisabled() {
      if (this.selectCatKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectCatKeys.length === 3) {
        return this.selectCatKeys[2]
      } else if (this.selectCatKeys.length === 2) {
        return this.selectCatKeys[1]
      }
      return null
    },
    //计算标题
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped lang="less">
  .cat_opt {
    margin: 15px 0;
  }
  .el-tag{
    margin-right: 10px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
