<template >
    <div class="back" >


  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="../assets/imgs/shop.jpg" alt="" />
        <span>Shop Management</span>
      </div>
      <div class="right">
        <span>Welcome：{{ userInfo.username }}</span>
        <el-button type="danger" size="mini" @click="logout">Log Out</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="isCollapse=!isCollapse">
            <h2 v-if="!isCollapse" class="el-icon-d-arrow-left"/>
            <h2 v-else class="el-icon-d-arrow-right"/>
          </div>
        <!-- 侧边栏菜单 -->
        <el-menu :default-active="$route.path" unique-opened router :collapse="isCollapse" :collapse-transition="false">
          <el-submenu :index="item.id +'' " v-for="item in menuList" :key="item.id">
              <template slot="title">
                  <i :class="iconObj[item.id]"></i>
                  <span>{{ item.authName }}</span>
              </template>
            <el-menu-item :index="'/'+subItem.path"  v-for="subItem in item.children"  :key="subItem.id">
                  <i class="el-icon-menu"></i>{{ subItem.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view/>
        <!--the router view to the welcome page-->
      </el-main>
    </el-container>
  </el-container>
    </div>
</template>

<script>
export default
{
  data()
  {
    return {
      userInfo: null,
      menuList: [],
      // 图标样式对象
      iconObj:
      {
        201: "iconfont icon-shouye",
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
      },
      // 是否折叠左侧的菜单
      isCollapse:false
    };
  },
  created()
  {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.getMenuList();
  },
  methods: {
    // 退出
    logout() {
      this.$confirm("Do you confirm to log out? ？", "warning",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            type: "warning",
          })
        .then(() => { sessionStorage.clear()
            this.$router.push("/login")
        })
        .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出",
            });
        });
    },
    // 获取左侧的菜单列表
    async getMenuList()
    {
      const { data: res } = await this.$http.get("menus")
      if (res.meta.status !== 200)
      {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
  },
};
</script>

<style lang="less" scoped>
i{color:black; font-weight: bold;}
.el-container
{
  height: 100%;
}
.back{}
.el-header
{
  background: url("../assets/imgs/background.jpg") repeat-x center;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  .left
  {
    display: flex;
    align-items: center;
    img
    {
      width: 40px;
      margin-right: 20px;
    }
    span
    {
      font-size: 20px;
    }
  }
  .right
  {
    span
    {
      margin-right: 10px;
    }
  }
}
.el-aside {
  .el-menu {
    border-right: 0;
    .iconfont {
      margin-right: 10px;
    }
  }
  .toggle-button{
      background: red;
      font-size: 20px;
      line-height: 20px;
      text-align: center;
      color: white;
      cursor: pointer;
      /*height:30px;*/
  }
  #arrow{}
}
.el-main{
    background-image: url("../assets/imgs/shop.jpg");
}
    .el-container,.el-aside,.el-menu{background:antiquewhite;}
</style>
