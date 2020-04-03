<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" size="small" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="权限">
          <template v-slot="props">
            <el-switch v-model="props.row.mg_state" @change="userStatusChange(props.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="管理">
          <template v-slot="props">
            <!--修改-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(props.row.id)"></el-button>
            <!--删除-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(props.row.id)"></el-button>
            <!--分配权限-->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addClearData">
      <!--内容主体区域-->
      <el-form :model="adduser" :rules="adduserRules" ref="adduserref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="adduser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserCheck">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
      <el-form :model="editData" :rules="editFormrules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" disabled>
          <el-input v-model="editData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    //验证邮箱规则
    var checkemail = (rule, value, callback) => {
      var testemail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (testemail.test(value)) {
        return callback()
      }
      callback(new Error('输入的邮箱格式不正确'))
    }
    //验证电话的规则
    var checkmobile = (rule, value, callback) => {
      var testemail = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (testemail.test(value)) {
        return callback()
      }
      callback(new Error('输入的手机号码不正确'))
    }
    return {
      queryInfo: {
        //查询参数
        query: '',
        //第几页
        pagenum: 1,
        //每页显示的多少数据
        pagesize: 3
      },
      userlist: [],
      total: 0,
      //控制添加对话框的显示隐藏
      dialogVisible: false,
      //添加用户的数据绑定
      adduser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //验证规则的属性
      adduserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5~10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6~15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkemail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkmobile, trigger: 'blur'}
        ]
      },
      //修改用户对话款
      editDialogVisible: false,
      //修改用户数据
      editData: {},
      //修改用户验证规则
      editFormrules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkemail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkmobile, trigger: 'blur'}
        ]
      }
    }
  },

  created() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    //监听每页多少条
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUserList()
    },
    //第几页
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getUserList()
    },
    //修改用户状态
    async userStatusChange(userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更改状态失败!')
      }
      this.$message.success('更改状态成功！')
    },
    //添加用户
    addUser() {
      this.dialogVisible = true
    },
    //监听关闭添加用户的对话框事件
    addClearData() {
      this.$refs.adduserref.resetFields()
    },
    //点击按钮，添加用户
    addUserCheck() {
      //验证表单
      this.$refs.adduserref.validate(async msg => {
        if (!msg) return
        var {data: res} = await this.$http.post('/users', this.adduser)
        if (!res.meta.status == 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功!');
        //关闭对话框
        this.dialogVisible = false
        //刷新列表
        this.getUserList()
      })
    },
    //修改用户按钮
    async editDialog(id) {
      //发起请求
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户不存在!')
      }
      //保存数据
      this.editData = res.data
      //打开修改用户对话框
      this.editDialogVisible = true
    },
    //监听修改用户对话框关闭事件
    editClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提价
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起修改请求
        const {data: res} = await this.$http.put('users/' + this.editData.id, {
          email: this.editData.email,
          mobile: this.editData.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户失败!')
        } else {
          //关闭对话框
          this.editDialogVisible = false,
            //更新数据
            this.getUserList()
          //提示修改成功
          this.$message.success('修改成功！')
        }
      })
    },
    //删除用户操作
    async removeUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err);
      //确认删除返回confirm，取消返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('你已经取消删除')
      }
      const {data: res} = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200){
        this.$message.error('删除用户失败')
      }else {
        this.$message.success('删除用户成功')
        this.getUserList()
      }
    }
  }
}
</script>

<style scoped>

</style>
