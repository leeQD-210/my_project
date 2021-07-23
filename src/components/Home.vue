<template>
  <!-- 主页container容器 -->
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="btn_logout">退出</el-button>
    </el-header>
    <!-- 主体内容容器 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_collapse" @click="toggleCollapse()">
          <span>|||</span>
        </div>
        <el-menu :default-active="activeIndex" background-color="#353c3f" text-color="#fff" active-text-color="#00BFFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        /* 以一级菜单的id作为属性名定义对应的icon图标 */
        125: 'iconfont icon-users',
        103: 'iconfont icon-icon_-',
        101: 'iconfont icon-goods',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeIndex: ''
    }
  },
  created() {
    /* 当被创建完成是查询数据 */
    this.getMenuList()
    /* 当页面刷新，组件重新被创建渲染时，获取session中储存的index值 */
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  },
  methods: {
    logout: function() {
      /* 清空浏览器存储的临时token */
      window.sessionStorage.clear()
      /* 跳转登录界面 */
      this.$router.push('/login')
    },
    /* 发送axios请求，获取左侧菜单数据 */
    getMenuList: async function() {
      const { data: res } = await this.$http.get('/menus')
      this.menuList = res.data
    },
    /* 控制左侧菜单栏折叠 */
    toggleCollapse: function() {
      this.isCollapse = !this.isCollapse
    }
  },
  watch: {
    // 监听路由地址变化
    $route(to, from) {
      /* 获取跳转路由的哈希路径，储存到sessionStorage中，当页面刷新组件重新构建时取出该值，显示高亮效果 */
      window.sessionStorage.setItem('activeIndex', to.fullPath)
      this.activeIndex = to.fullPath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    padding: 0;
    color: #fff;
    background-color: #353c3f;
    div {
      display: flex;
      align-items: center;
      img {
        margin-right: 10px;
      }
      span {
        letter-spacing: 0.1em;
      }
    }
    .btn_logout {
      height: 65%;
      margin: auto 20px;
    }
  }
  .el-aside {
    background-color: #313642;
    .toggle_collapse {
      background-color: #4a5064;
      text-align: center;
      line-height: 21.33px;
      &:hover {
        cursor: pointer;
      }
      span {
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.2em;
      }
    }
    .el-menu {
      border-right: none;
      .iconfont {
        margin-right: 10px;
        font-size: 12px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
