<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" size="small" @click="addrole">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="userList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!--循环一级权限-->
            <el-row :class="['bottomboder',index1==0?'topboder':'','vcenter']"
                    v-for="(item,index1) in scope.row.children" :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--循环二级权限-->
                <el-row :class="[index2 == 0?'':'topboder','vcenter']" v-for="(item2,index2) in item.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--循环三级权限-->
                    <el-tag type="warning"
                            v-for="(item3,index3) in item2.children"
                            :key="item3.id"
                            closable @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editroles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeRoles(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showsetRightDIalog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="40%" @close="clearData">
      <el-form :model="rolesRuleForm" :rules="rolesRules" ref="rolesRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesCheck">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog title="修改角色" width="40%" :visible.sync="editDialogVisible" @close="editclearData">
      <el-form :model="editRolesForm" :rules="editrolesRules" ref="editRolesForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="editRolesForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog title="选择权限" :visible.sync="rightdialogVisible" width="40%" @close="setrightdialogClosed">
      <!--树形控件-->
      <el-tree :data="rightList"
               :props="defaultProps"
               show-checkbox
               default-expand-all
               node-key="id"
               :default-checked-keys="defaultKey"
               ref="rolesRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="subRoles">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      userList: [],
      dialogVisible: false,//是否打开对话框,
      //添加角色的数据绑定
      rolesRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      //修改对话框
      editDialogVisible: false,
      editRolesForm: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },
      //表单验证
      rolesRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
      },
      //修改验证
      editrolesRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '请输入角色ID', trigger: 'blur'},
          {type: 'number', message: 'id必须为数字值'}
        ],
      },
      //权限对话框
      rightdialogVisible: false,
      rightList:[],//树形的数据
      defaultProps: {//生成模板的定义
        children: 'children',
        label: 'authName'
      },
      defaultKey:[],//默认选中的数据
      roleID:'',//提交分配权限的角色id
    }
  },
  created() {
    this.getUserlist()
  },
  methods: {
    async getUserlist() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表数据失败！')
      this.userList = res.data
    },
    //点击添加角色
    addrole() {
      this.dialogVisible = true
    },
    //重置表单验证
    clearData() {
      this.$refs.rolesRuleForm.resetFields()
    },
    //点击确定添加角色对话框
    addRolesCheck() {
      //预验证
      this.$refs.rolesRuleForm.validate(async msg => {
        if (!msg) return
        //发起请求
        const {data: res} = await this.$http.post('/roles', this.rolesRuleForm)
        if (res.meta.status !== 201) this.$message.error('添加失败！')
        this.$message.success('添加成功！')
        this.getUserlist()
        this.dialogVisible = false
      })
    },
    //编辑角色
    async editroles(id) {
      //打开对话框
      this.editDialogVisible = true
      const {data: res} = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      this.editRolesForm = res.data
    },
    editclearData() {
      this.$refs.editRolesForm.resetFields()
    },
    //提交修改
    async subEdit() {
      this.$refs.editRolesForm.validate(async msg => {
        if (!msg) return
        const {data: res} = await this.$http.put('roles/' + this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error('修改失败');
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getUserlist()
      })
    },
    //删除角色
    async removeRoles(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      if (confirmResult !== 'confirm') return this.$message.info('你已经取消删除');
      const {data: res} = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      } else {
        this.$message.success('删除用户成功')
        this.getUserlist()
      }
    },
    //删除3级权限
    async removeRightById(role, rightId) {
      //打开消息提示框
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      if (confirmResult !== 'confirm') return this.$message.info('你已经取消删除');
      const {data: res} = await this.$http.delete('roles/' + role.id + '/rights/' + rightId + '')
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！');
      this.$message.success('删除权限成功！')
      role.children = res.data;
    },
    //权限管理
    async showsetRightDIalog(role) {
      this.roleID = role.id
      //获取要展开的数据
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.rightList = res.data
      this.getKey(role,this.defaultKey)
      this.rightdialogVisible = true;
    },
    /**
     * 三级权限递归函数
     * @param node 树形的节点数据
     * @param arr 接收的数组
     */
    getKey(node,arr){
      if(!node.children){//如果没有children属性说明是一级节点
        return arr.push(node.id)
      }
      node.children.forEach((item)=>{
        this.getKey(item,arr)
      })

    },
    //监听关闭分配权限的对话框
    setrightdialogClosed(){
      this.defaultKey = []
    },
    //提交分配权限的事件
    async subRoles(){
      const arrID = [
        ...this.$refs.rolesRef.getHalfCheckedKeys(),
        ...this.$refs.rolesRef.getCheckedKeys()
      ]
      const idStr = arrID.join(',')
      const {data:res} = await this.$http.post('roles/'+this.roleID+'/rights', {rids:idStr})
      if (res.meta.status !== 200) return this.$message.error('权限分配失败')
      this.$message.success('权限分配成功')
      this.getUserlist()
      this.rightdialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }

  .topboder {
    border-top: 0.5px solid #eee;
  }

  .bottomboder {
    border-bottom: 0.5px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
