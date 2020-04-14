<template>
  <div>
    <!--面包导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--消息提示框-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--标签页-->
      <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="100px" label-position="top">
        <el-tabs tab-position="left" @tab-click="tabclicked" v-model="activeIndex" :before-leave="beforTableave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateprops"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox size="small" border :label="item2" v-for="(item2,index) in item.attr_vals"
                             :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabelData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--图片上传-->
            <el-upload
              class="upload-demo"
              :action="uplodeUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handlSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览框-->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="45%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "add",
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],//上传的图片临时路径
        goods_introduce: '',//富文本编辑器的内容
        attrs:[]//商品的参数（数组），包含 `动态参数` 和 `静态属性`

      },//表单参数
      cateList: [],
      manyTableData: [],//商品参数数据
      onlyTabelData: [],//属性数据
      cateprops: {//级联选择的配置项
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addrules: {//表单验证规则
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
        ],
        goods_cat: [
          {required: true, message: '请输入商品分类', trigger: 'change'},
        ]
      },
      uplodeUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: {//图片上传设置请求头，获取token
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      dialogVisible: false,
    }
  },
  created() {
    this.getshopList()
  },
  methods: {
    async getshopList() {
      const {data: res} = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.cateList = res.data
    },
    //级联选择选择数据会触发该函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return this.addForm.goods_cat = []
      }
    },
    //标签页点击切换监听
    beforTableave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请完善基本信息')
        return false
      }
    },
    //获取动态参数列表数据
    async tabclicked() {
      if (this.activeIndex === '1') {
        //商品参数
        const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes', {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取数据参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals == '' ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        //商品参数
        const {data: res} = await this.$http.get('categories/' + this.cateId + '/attributes', {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取数据参数列表失败')
        this.onlyTabelData = res.data
        console.log(this.onlyTabelData)
      }
    },
    //处理图片的预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    //移除图片的操作
    handleRemove(file) {
      //获取要删除的路径
      const filepath = file.response.data.tmp_path;
      //查找addForm中存在的图片路径
      const i = this.addForm.pics.findIndex(x => {
        return x.pic === filepath
      })
      //删除
      this.addForm.pics.splice(i, 1)

    },
    //上传成功的钩子
    handlSuccess(response) {
      const picsInfo = {"pic": response.data.tmp_path}
      this.addForm.pics.push(picsInfo)
    },
    //添加商品按钮
    add() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return this.$message.error('请完善必填项！')
        //处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo = {
            "attr_id":item.attr_id,
            "attr_value":item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTabelData.forEach(item=>{
          const newInfo = {
            "attr_id":item.attr_id,
            "attr_value":item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        //深拷贝
        const form = JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        //发起添加商品的请求
        const {data:res} = await this.$http.post('goods',form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    //计算分类 ID
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
}
</script>

<style scoped lang="less">
  .el-steps {
    margin-top: 15px;
  }

  .el-tabs {
    margin-top: 15px;
  }

  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .el-form-item {
    margin: 10px 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>
