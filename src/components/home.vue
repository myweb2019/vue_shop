<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/images/0.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" size="small">退出</el-button>
    </el-header>
    <!--底部区域-->
    <el-container style="height: 90%">
      <!--左边区域-->
      <el-aside :width="isCollapes?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边导航栏-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapes"
          :collapse-transition="isCollapes"
          router
          :default-active="Navstatus"
        >
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--一级菜单区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavstatus('/'+subItem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边区域-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  created() {
    this.getMenuList();
    this.Navstatus = window.sessionStorage.getItem('path');
  },
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapes: false,//是否折叠
      Navstatus: '',
    }
  },
  methods: {
    logout() {
      window.localStorage.clear();
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus');
      if (res.meta.status != "200") return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    //点击按钮折叠与展开
    toggleCollapse() {
      this.isCollapes = !this.isCollapes
    },
    //保存点击高亮显示
    saveNavstatus(path) {
      window.sessionStorage.setItem('path', path),
        this.Navstatus = path

    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }

    img {
      height: 50px;
      width: 50px;
      border-radius: 50%;
    }
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border-right: none;
  }

  .toggle-button {
    background-color: #4A5064;
    color: #ffffff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
