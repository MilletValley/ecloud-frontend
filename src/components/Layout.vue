<template>
  <el-container style="height: 100%">
    <el-aside style="width:auto; background-color: #00264a">
      <div class="logo">
        <img src="../assets/elogo.png"
             alt="信服易备"
             width="45px"
             height="35px">
        <h1 v-show="!isMenuCollapsed">新项目</h1>
      </div>
      <!-- 左侧导航菜单 -->
      <el-menu background-color="#00264a"
               text-color="#fff"
               active-text-color="#fff"
               :collapse="isMenuCollapsed">
        <el-menu-item index='/dashboard'>
          <IIcon name="dashboard"
                 class="menu-icon"></IIcon>
          <router-link to='/dashboard'
                       tag="span" style="display: inline-block; width: 165px;">资源概览</router-link>
        </el-menu-item>
        <el-submenu v-for="menu in menus"
                    :key="menu.path"
                    :index="menu.path">
          <template slot="title">
            <IIcon :name="menu.meta.icon"
                    class="menu-icon"></IIcon>
            <span>{{ menu.meta.title }}</span>
          </template>
          <el-menu-item v-for="submenu in menu.children.filter(child => child.meta && child.meta.title)"
                        :key="submenu.path"
                        :index="`${menu.path}/${submenu.path}`">
            <router-link :to="`${menu.path}/${submenu.path}`"
                         tag="li">{{ submenu.meta.title }}</router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container style="overflow: auto">
      <el-header style="font-size: 12px">
        <!-- 面包屑导航 -->
        <!-- <el-breadcrumb separator="/"
                       class="bread-crumb">
          <el-breadcrumb-item v-for="nav in breadcrumb"
                              :key="nav.path"
                              :to="{ path: nav.path }">{{ nav.name }}</el-breadcrumb-item>
        </el-breadcrumb> -->
        <!-- 个人中心 -->
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="about">关于</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <div class="el-main">
        <router-view/>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import IIcon from './IIcon.vue'
import { routes } from '../router'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Layout',
  data () {
    return {
      clientWidth: 1920
    }
  },
  components: {
    IIcon
  },
  mounted () {
    this.clientWidth = document.documentElement.clientWidth
    const that = this
    window.onresize = function windowResize () {
      that.clientWidth = document.documentElement.clientWidth
    }
  },
  computed: {
    isMenuCollapsed () {
      return this.clientWidth < 1300
    },
    menus () {
      return routes.filter(route => route.meta)
    },
    ...mapState({
      userName: state => {
        if (state.base.userInfo.userName) {
          return state.base.userInfo.userName
        }
        return state.base.userInfo.loginName
      }
      // breadcrumb: state => state.nav.breadcrumb
    })
  },
  methods: {
    ...mapActions(['logout']),
    handleCommand (command) {
      if (command === 'logout') {
        this._logout()
      } else if (command === 'profile') {
        this.$message('个人中心')
      }
    },
    _logout () {
      this.logout(this.$store.state.base.token).then(message => {
        this.$message.success({ message })
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style>
.logo {
  padding: 11px 10px;
  padding-top: 20px;
  text-align: center;
}
.logo h1 {
  display: inline;
  color: #fff;
  font-family: 'LiSu';
  font-size: 32px;
}
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  box-shadow: 1px 1px #eeeeee;
  position: relative;
}
.el-main {
  background-color: #f0f2f5;
  box-sizing: border-box;
  padding: 20px;
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.bread-crumb {
  display: inline-block;
  line-height: 0.6;
}
.user-info {
  float: right;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.router-link-active {
  color: #ffd04b;
  font-weight: 600;
}
.menu-icon {
  margin-right: 5px;
}
</style>
