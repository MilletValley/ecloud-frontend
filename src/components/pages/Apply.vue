<template>
  <section>
    <el-row>
      <el-form inline>
        <el-form-item style="float: right">
          <div class="searchBox">
            <el-input placeholder="请输入查询条件"
                      v-model="searchValue"
                      class="input-with-select"
                      @keyup.enter.native="searchByName">
              <el-select v-model="searchItem" slot="prepend" placeholder="请选择">
                <el-option label="实例名称" value="instanceName"></el-option>
                <el-option label="资源域" value="zoneName"></el-option>
                <el-option label="创建时间" value="createTime"></el-option>
                <el-option label="到期时间" value="dueTime"></el-option>
              </el-select>
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchByName"></el-button>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item style="float: left">
          <el-button type="primary"
                     size="small"
                     @click="createModalVisible=true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table v-if="items"
              :data="items.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%">
      <el-table-column type="expand">
        <!-- 折叠面板 -->
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="名称">{{ props.row.instanceName }}</el-form-item>
            <el-form-item label="CPU内核数">{{ props.row.cpuNumber }}</el-form-item>
            <el-form-item label="资源域">{{ props.row.zoneName }}</el-form-item>
            <el-form-item label="CPU(MHz)">{{ props.row.cpuSpeed }}</el-form-item>
            <el-form-item label="模板名称">{{ props.row.templateName }}</el-form-item>
            <el-form-item label="内存(MB)">{{ props.row.memory }}</el-form-item>
            <el-form-item label="操作系统类型">{{ props.row.osName }}</el-form-item>
            <el-form-item label="数据卷大小">{{ props.row.diskSize }}</el-form-item>
            <el-form-item label="申请状态">
              <el-tag :type="tagType(props.row.applyState)"
                      size="mini">{{ stateConvert(props.row.applyState) }}</el-tag>
            </el-form-item>
            <el-form-item label="到期时间">
              <el-tag type="info"
                      size="mini">{{ props.row.dueTime }}</el-tag>
            </el-form-item>
            <el-form-item label="用户名">{{ userName }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       min-width="50"
                       align="center">
        <template slot-scope="scope">
          {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="实例名称"
                       min-width="100"
                       prop="instanceName"
                       align="center"></el-table-column>
      <el-table-column label="资源域"
                       min-width="100"
                       prop="zoneName"
                       align="center"></el-table-column>
      <el-table-column label="创建时间"
                       min-width="100"
                       prop="createTime"
                       align="center"></el-table-column>
      <el-table-column label="到期时间"
                       min-width="100"
                       prop="dueTime"
                       align="center"></el-table-column>
      <el-table-column label="实例状态"
                       min-width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.applyState)"
                  size="mini">{{ stateConvert(scope.row.applyState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="150"
                       align="center">
        <template slot-scope="scope">
          <!-- 拒绝，已撤回：重新申请 -->
          <el-button type="primary"
                     v-if="[1, 3].includes(scope.row.applyState)"
                     icon="el-icon-refresh"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="selectOne(scope)"></el-button>
          <!-- 通过：灰色 -->
          <el-button type="info"
                     v-if="scope.row.applyState===0"
                     icon="el-icon-refresh"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="selectOne(scope)"></el-button>
          <!-- 审核中：撤回 -->
          <el-button type="primary"
                     v-if="scope.row.applyState===2"
                     icon="el-icon-back"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="selectOne(scope)"></el-button>
          <!-- 删除 -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteBtn(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right; margin-top: 8px">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 20, 40]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     background
                     :total="items.length"></el-pagination>
    </div>
    <!-- 添加 -->
    <create-apply-modal :visible.sync="createModalVisible"
                        :btn-loading="btnLoading"
                        :templates="templates"
                        :getSecurityGroup="getSecurityGroup"
                        :getStorage="getStorage"
                        @confirm="createConfirm"></create-apply-modal>
    <!-- 重新申请 -->
    <update-apply-modal :visible.sync="updateModalVisible"
                        :btn-loading="btnLoading"
                        :templates="templates"
                        :apply-info="applyInfo"
                        @confirm="updateConfirm"></update-apply-modal>
  </section>
</template>
<script>
import { ApplyStateMapping, typeMapping } from '../../utils/constant'
import { serverMixin } from '../mixins/serverMixins'
import { fetchAll, deleteOne, createOne, modifyOne } from '../../api/apply'
import { fetchAll as fetchTemplate } from '../../api/template'
import { fetchAll as fetchSecurityGroup } from '../../api/securityGroup'
import { fetchAll as fetchStorage } from '../../api/storage'
import { mapState } from 'vuex'
import CreateApplyModal from '../modal/CreateApplyModal'
import UpdateApplyModal from '../modal/UpdateApplyModal'
export default {
  name: 'Apply',
  mixins: [serverMixin],
  data () {
    return {
      createModalVisible: false,
      updateModalVisible: false,
      btnLoading: false,
      templates: [],
      getSecurityGroup: [],
      getStorage: [],
      selectedId: -1
    }
  },
  methods: {
    fetchData () {
      fetchAll()
        .then(res => {
          const { data } = res.data
          this.items = data
          this.originItems = data
        })
      fetchTemplate()
        .then(res => {
          const { data } = res.data
          this.templates = data
        })
      fetchSecurityGroup()
        .then(res => {
          const { data } = res.data
          this.getSecurityGroup = data
        })
      fetchStorage()
        .then(res => {
          const { data } = res.data
          this.getStorage = data
        })
    },
    stateConvert (state) {
      return ApplyStateMapping[state]
    },
    tagType (type) {
      return typeMapping[type]
    },
    // 删除
    deleteBtn ({ row: apply, $index }) {
      this.$confirm('确认删除此申请？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          deleteOne(apply.id)
            .then(() => {
              this.items.splice($index, 1)
              this.$message.success({ message: '删除成功!' })
            })
            .catch(error => {
              this.$message.error(error)
            })
        })
        .catch(() => {
          this.$message.info({ message: '已取消删除操作' })
        })
    },
    // 撤销
    revokeConfirm () {
      this.$confirm(`是否撤销
        ${this.items.find(list => list.id === this.selectedId).instanceName}
        的申请？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.applyInfo.applyState = 3
          modifyOne(this.applyInfo)
            .then(res => {
              const { data, message } = res.data
              this.$message.success(message)
              this.items.splice(
                this.items.findIndex(item => item.id === data.id),
                1,
                data
              )
            })
            .catch(error => {
              this.$message.error(error)
            })
        })
        .catch(() => {
          this.$message.info('已取消撤销操作')
        })
    },
    // 已选项id
    selectOne ({ row }) {
      this.selectedId = row.id
      if ([1, 3].includes(row.applyState)) {
        this.updateModalVisible = true
      } else if (row.applyState === 0) {
        this.$message.warning({ message: '申请已通过，无法重新申请！' })
      } else if (row.applyState === 2) {
        this.revokeConfirm()
      }
    },
    // 更新
    updateConfirm (data) {
      this.btnLoading = true
      modifyOne(data)
        .then(res => {
          this.updateModalVisible = false
          const { data, message } = res.data
          this.$message.success(message)
          this.items.splice(
            this.items.findIndex(item => item.id === data.id),
            1,
            data
          )
        })
        .catch(error => {
          this.$message.error(error)
        })
        .then(() => {
          this.btnLoading = false
        })
    },
    // 添加
    createConfirm (data) {
      this.btnLoading = true
      createOne(data)
        .then(res => {
          this.createModalVisible = false
          const { data, message } = res.data
          this.$message.success(message)
          this.items.push(data)
        })
        .catch(error => {
          this.$message.error(error)
        })
        .then(() => {
          this.btnLoading = false
        })
    },
    applyState (state) {
      return ApplyStateMapping[state]
    }
  },
  computed: {
    ...mapState({
      userName: state => {
        if (state.base.userInfo.userName) {
          return state.base.userInfo.userName
        }
        return state.base.userInfo.loginName
      }
    }),
    // 已选项信息
    applyInfo () {
      return this.items.find(list => list.id === this.selectedId) || {}
    }
  },
  components: {
    CreateApplyModal,
    UpdateApplyModal
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
</style>
<style>
.searchBox .el-select .el-input {
  width: 110px;
}
.searchBox .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.demo-table-expand {
  font-size: 0;
  margin-left: 40px;
}
.demo-table-expand label {
  width: 110px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.applyCollapse .el-collapse-item__header {
  color: #409EFF;
}
.collapse-style .el-collapse-item__content{
  padding-bottom: 0;
}
.applyCollapse .el-radio-group,
.applyCollapse .el-radio {
  display: block;
}
.outsideRow {
  position: relative;
}
.outsideRow .el-radio__input {
  position: absolute;
  top: 42%;
  left: 0;
}
.addStorage {
  height: 48px;
}
.addStorage .el-form-item__label,
.addStorage .el-form-item__content {
  line-height: 48px;
  font-size: 14px;
  padding-left: 10px;
}
.addStorage .el-form-item {
  height: 48px;
  padding: 0;
  margin-bottom: 0;
}
</style>
