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
                <el-option label="CPU(核数)" value="cpuCoreNum"></el-option>
                <el-option label="内存(MB)" value="memoryCapacity"></el-option>
                <el-option label="状态" value="vmState"></el-option>
                <el-option label="操作系统" value="osName"></el-option>
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
                     style="border:0"
                     @click="dialogTableVisible = true">统计实例数据</el-button>
        </el-form-item>
        <el-form-item style="float: left">
          <el-dropdown trigger="click"
                       size="small"
                       placement="bottom"
                       @command="handleCommand"  >
            <el-button plain
                       size="small"
                       :disabled="noChoose">操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="reshipment" :disabled="reshipmentDisabled">重新安装</el-dropdown-item>
              <el-dropdown-item command="reset" :disabled="resetDisabled">重置密码</el-dropdown-item>
              <el-popover placement="right" trigger="hover">
                <div class="instance-operate">
                  <el-dropdown-item command="start" :disabled="hasRunning">启动</el-dropdown-item>
                  <el-dropdown-item command="stop" :disabled="hasStopped">停止</el-dropdown-item>
                  <el-dropdown-item command="restart" :disabled="restartDisabled">重启</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </div>
                <el-dropdown-item command="operate" slot="reference">实例操作</el-dropdown-item>
              </el-popover>
              <el-popover placement="right" trigger="hover">
                <div class="instance-operate">
                  <el-dropdown-item command="console">查看控制台</el-dropdown-item>
                  <el-dropdown-item command="remote">远程链接</el-dropdown-item>
                </div>
                <el-dropdown-item command="link" slot="reference" :disabled="linkDisabled">链接</el-dropdown-item>
              </el-popover>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 统计实例数据表格 -->
    <el-dialog title="统计实例数据"
               :visible.sync="dialogTableVisible"
               class="dialogTableVisible"
               @open="openTableDialog"
               width="80%">
      <el-table v-if="items"
                :data="items.slice((dialogCurrentPage-1)*dialogPageSize,dialogCurrentPage*dialogPageSize)"
                style="100%">
        <el-table-column label="实例名称"
                         min-width="100"
                         prop="instanceName"
                         align="center"></el-table-column>
        <el-table-column label="总CPU"
                         min-width="100"
                         prop="cpuNumber"
                         align="center"></el-table-column>
        <el-table-column label="CPU利用率"
                         min-width="100"
                         prop="cpuUtilization"
                         align="center"></el-table-column>
        <el-table-column label="网络读取量"
                         min-width="100"
                         prop="networdRead"
                         align="center"></el-table-column>
        <el-table-column label="网络写入量"
                         min-width="100"
                         prop="networkWrite"
                         align="center"></el-table-column>
        <el-table-column label="磁盘读取(字节)"
                         min-width="100"
                         prop="diskReadByte"
                         align="center"></el-table-column>
        <el-table-column label="磁盘写入(字节)"
                         min-width="100"
                         prop="diskWriteByte"
                         align="center"></el-table-column>
        <el-table-column label="磁盘读取(IO)"
                         min-width="100"
                         prop="diskReadIO"
                         align="center"></el-table-column>
        <el-table-column label="磁盘写入(IO)"
                         min-width="100"
                         prop="diskWriteIO"
                         align="center"></el-table-column>
      </el-table>
      <div class="block" style="text-align: right; margin-top: 8px">
        <el-pagination background
                      @current-change="dialogCurrentChange"
                      :page-size="dialogPageSize"
                      :current-page="dialogCurrentPage"
                      layout="prev, pager, next"
                      :total="items.length"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false"
                   size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <el-table v-if="items"
              :data="itemPage"
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <!-- 折叠面板开始 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-tabs type="border-card">
            <!-- 详细信息 -->
            <el-tab-pane label="详细信息">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="名称">{{ props.row.instanceName }}</el-form-item>
                <el-form-item label="虚拟机密码">{{ props.row.vmPass }}</el-form-item>
                <el-form-item label="资源域">{{ props.row.zoneName }}</el-form-item>
                <el-form-item label="CPU内核数">{{ props.row.cpuNumber }}</el-form-item>
                <el-form-item label="模板名称">{{ props.row.templateName }}</el-form-item>
                <el-form-item label="CPU(MHz)">{{ props.row.cpuSpeed }}</el-form-item>
                <el-form-item label="操作系统类型">{{ props.row.osName }}</el-form-item>
                <el-form-item label="内存(MB)">{{ props.row.memory }}</el-form-item>
                <el-form-item label="申请状态">
                  <el-tag :type="tagType(props.row.applyState)"
                      size="mini">{{ stateConvert(props.row.applyState) }}</el-tag>
                </el-form-item>
                <el-form-item label="数据卷大小">{{ props.row.diskSize }}</el-form-item>
                <el-form-item label="用户名">{{ userName }}</el-form-item>
                <el-form-item label="到期时间">
                  <el-tag type="info"
                          size="mini">{{ props.row.dueTime }}</el-tag>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!-- 网卡 -->
            <el-tab-pane label="网卡">
              <el-table :data="props.row.networkCards"
                        style="width: 100%">
                <el-table-column prop="cardId"
                                 label="网卡ID"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="networkName"
                                 label="网络名称"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="traffictype"
                                 label="类型"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="ipAddress"
                                 label="IP地址"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="gateway"
                                 label="网关"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="netmask"
                                 label="网络掩码"
                                 min-width="80"
                                 align="center"></el-table-column>
                <el-table-column prop="isDefault"
                                 label="默认网卡"
                                 min-width="80"
                                 :formatter="isDefaultCard"
                                 align="center"></el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 统计数据 -->
            <el-tab-pane label="统计数据">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="总CPU">{{ props.row.cpuNumber }}*{{ props.row.cpuSpeed }} MHz</el-form-item>
                <el-form-item label="CPU利用率">{{ props.row.cpuUtilization }}</el-form-item>
                <el-form-item label="网络读取量">{{ props.row.networdRead }}</el-form-item>
                <el-form-item label="网络写入量">{{ props.row.networkWrite }}</el-form-item>
                <el-form-item label="磁盘读取(字节)">{{ props.row.diskReadByte }}</el-form-item>
                <el-form-item label="磁盘写入(字节)">{{ props.row.diskWriteByte }}</el-form-item>
                <el-form-item label="磁盘读取(IO)">{{ props.row.diskReadIO }}</el-form-item>
                <el-form-item label="磁盘写入(IO)">{{ props.row.diskWriteIO }}</el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!-- 折叠面板结束 -->
      <el-table-column label="序号"
                       min-width="50"
                       align="center">
        <template slot-scope="scope">
          {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="实例名"
                       min-width="100"
                       prop="instanceName"
                       align="center"></el-table-column>
      <el-table-column label="实例类型"
                       min-width="100"
                       prop="serviceOfferingName"
                       align="center"></el-table-column>
      <el-table-column label="资源域"
                       min-width="100"
                       prop="zoneName"
                       align="center"></el-table-column>
      <el-table-column label="操作系统"
                       min-width="100"
                       prop="osName"
                       align="center"></el-table-column>
      <el-table-column label="启动时间"
                       min-width="120"
                       prop="createTime"
                       align="center"></el-table-column>
      <el-table-column label="到期时间"
                       min-width="120"
                       prop="dueTime"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       min-width="80"
                       align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.vmState === 0"
                :class="$style.loadingColor">
            <i class="el-icon-loading"></i>
            运行中
          </span>
          <span v-else
                :class="$style.stopedColor">
            <i class="el-icon-remove-outline"></i>
            已停止
          </span>
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
    <!-- 重新安装 -->
    <el-dialog title="重新安装"
               custom-class="min-width-dialog"
               :visible.sync="restartDialogVisible">
        <el-row v-if="multipleSelection[0]">
          <el-col :span="6">
            <i-icon name="warning"
                    class="warningIcon"></i-icon>
          </el-col>
          <el-col :span="18">
            <div style="height: 220px;max-height: 220px;overflow: scroll;">
              <h4>注意，请谨慎操作。</h4>
              <p>这将导致从模板重新安装实例，并且引导磁盘上存储的数据将丢失。</p>
              <p>额外的数据卷(如果存在)将无法访问。</p>
              <p>该操作将同时删除该实例的所有实例快照。</p>
              请选择一个模板：
              <el-select placeholder="请选择" v-model="multipleSelection[0].templateId">
                <el-option v-for="template in templates"
                           :key="template.id"
                           :label="template.templateText"
                           :value="template.id"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     @click="confirm"
                     :loading="btnLoading">确 定</el-button>
          <el-button @click="restartDialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 重置密码、启动、停止、重启、删除 -->
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="currencyDialogVisible"
               :title="allTitle[currencyCommand]">
        <el-row>
          <el-col :span="6">
            <i-icon name="warning"
                    class="warningIcon"></i-icon>
          </el-col>
          <el-col :span="18">
            <div style="height: 220px;max-height: 220px;overflow: scroll;">
              <!-- 重置密码 -->
              <div v-if="currencyCommand === 'reset'">
                <h4>您确定要重置此实例的Administrator/Root密码吗？重置后的密码为：000000</h4>
                <p v-if="multipleSelection[0]">实例名：{{ multipleSelection[0].instanceName }}</p>
              </div>
              <!--  启动、停止、重启、删除 -->
              <div v-else-if="['start', 'stop', 'restart', 'delete'].some(val => val===currencyCommand)">
                <h4>您确定要执行{{allTitle[currencyCommand].slice(0, 2)}}此虚拟机实例的操作吗？</h4>
                <p v-for="select in multipleSelection"
                   :key="select.id">{{ select.instanceName }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     @click="currencyConfirm"
                     :loading="btnLoading">确 定</el-button>
          <el-button @click="currencyDialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 远程连接 -->
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="remoteDialogVisible"
               title="连接到您的实例">
        <el-row v-if="multipleSelection[0]">
          <el-col :span="6">
            <i-icon name="warning"
                    class="warningIcon"></i-icon>
          </el-col>
          <el-col :span="18">
            <div style="overflow: scroll;">
              <h4>要访问您的实例</h4>
              <p>1、打开SSH客户端</p>
              <p>2、通过其IP
                <i-icon name="hand"
                        class="hand"></i-icon>
                <span v-for="item in accessIp"
                             :key="item.id"
                      style="color: #409eff">{{ item.ipAddress }}</span>连接到您的实例</p>
              <p>
                <el-tag size="small">示例:</el-tag>
                ssh root@10.0.1.124
              </p>
              <div class="warn-text">
                <p>请注意：上述示例仅针对于Linux发行版操作系统。在大多数情况下，镜像的默认用户为root，若无法登录请与管理员联系。</p>
                <p>windows系统请直接使用远程桌面连接。</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="remoteDialogVisible = false">关 闭</el-button>
        </span>
    </el-dialog>
  </section>
</template>
<script>
import { fetchAll, modifyOne, modifySome, deleteSome } from '../../api/system'
import { fetchAll as fetchTemplates } from '../../api/template'
import { ApplyStateMapping, typeMapping } from '../../utils/constant'
import { serverMixin } from '../mixins/serverMixins'
import { mapState } from 'vuex'
import IIcon from '../IIcon'
export default {
  name: 'SystemManage',
  mixins: [serverMixin],
  data () {
    return {
      dialogTableVisible: false,
      dialogCurrentPage: 1,
      dialogPageSize: 10,
      multipleSelection: [],
      templates: [],
      restartDialogVisible: false,
      currencyDialogVisible: false,
      remoteDialogVisible: false,
      btnLoading: false,
      allTitle: {
        reset: '重置密码',
        restart: '重启实例',
        stop: '停止实例',
        delete: '删除实例',
        start: '启动实例'
      },
      currencyCommand: ''
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
      fetchTemplates()
        .then(res => {
          const { data } = res.data
          this.templates = data
        })
    },
    stateConvert (state) {
      return ApplyStateMapping[state]
    },
    tagType (type) {
      return typeMapping[type]
    },
    dialogCurrentChange (currentPage) {
      this.dialogCurrentPage = currentPage
    },
    openTableDialog () {
      this.dialogCurrentPage = 1
    },
    isDefaultCard (data) {
      return data.isDefault === 0 ? '否' : '是'
    },
    handleCommand (command) {
      if (command === 'reshipment') {
        this.restartDialogVisible = true
      } else if (this.allTitle.hasOwnProperty(command)) {
        this.currencyDialogVisible = true
        this.currencyCommand = command
      } else if (command === 'console') {
        window.open(this.multipleSelection[0].consoleLink, '_blank')
      } else if (command === 'remote') {
        this.remoteDialogVisible = true
      }
    },
    confirm () {
      this.btnLoading = true
      modifyOne(this.multipleSelection[0]) // 重新安装
        .then(res => {
          const { data, message } = res.data
          this.items.splice(
            this.items.findIndex(item => item.id === data.id),
            1,
            data
          )
          this.$message.success(message)
          this.restartDialogVisible = false
        })
        .catch(error => {
          this.$message.error(error)
        })
        .then(() => {
          this.btnLoading = false
        })
    },
    currencyConfirm () {
      this.btnLoading = true
      if (this.currencyCommand === 'reset') { // 重置密码 000000
        this.multipleSelection[0].instancePass = '000000'
        modifyOne(this.multipleSelection[0])
          .then(res => {
            const { data, message } = res.data
            this.items.splice(
              this.items.findIndex(item => item.id === data.id),
              1,
              data
            )
            this.$message.success(message)
            this.currencyDialogVisible = false
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false
          })
      } else if (this.currencyCommand === 'start') { // 启动
        this.multipleSelection.forEach(item => {
          item.vmState = 0
        })
        modifySome(this.multipleSelection)
          .then(res => {
            const { data, message } = res.data
            this.items.forEach((item, index) => {
              data.forEach((i, v) => {
                if (i.id === item.id) {
                  this.items[index] = data[v]
                }
              })
            })
            this.$message.success(message)
            this.currencyDialogVisible = false
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false
          })
      } else if (this.currencyCommand === 'stop') { // 停止
        this.multipleSelection.forEach(item => {
          item.vmState = 1
        })
        modifySome(this.multipleSelection)
          .then(res => {
            const { data, message } = res.data
            this.items.forEach((item, index) => {
              data.forEach((i, v) => {
                if (i.id === item.id) {
                  this.items[index] = data[v]
                }
              })
            })
            this.$message.success(message)
            this.currencyDialogVisible = false
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false
          })
      } else if (this.currencyCommand === 'delete') { // 批量删除
        const ids = this.multipleSelection.map(item => item.id)
        deleteSome(ids)
          .then(res => {
            const { message } = res.data
            this.$message.success(message)
            this.currencyDialogVisible = false
            this.fetchData()
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false
          })
      } else if (this.currencyCommand === 'restart') { // 重启
        this.multipleSelection.forEach(item => {
          item.vmState = 1
        })
        modifySome(this.multipleSelection)
          .then(() => {
            this.multipleSelection.forEach(item => {
              item.vmState = 0
            })
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            modifySome(this.multipleSelection)
              .then(res => {
                const { data, message } = res.data
                this.items.forEach((item, index) => {
                  data.forEach((i, v) => {
                    if (i.id === item.id) {
                      this.items[index] = data[v]
                    }
                  })
                })
                this.$message.success(message)
                this.currencyDialogVisible = false
              })
              .catch(error => {
                this.$message.error(error)
              })
              .then(() => {
                this.btnLoading = false
              })
          })
      }
    },
    handleSelectionChange (val) {
      const selection = val.concat()
      this.multipleSelection = selection
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
    itemPage () {
      return this.items.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
    },
    noChoose () {
      return this.multipleSelection.length === 0
    },
    // 遍历已选列表中是否有运行中的实例
    hasRunning () {
      return this.multipleSelection.some((v, i) => v.vmState === 0)
    },
    // 遍历已选列表中是否有已停止的实例
    hasStopped () {
      return this.multipleSelection.some((v, i) => v.vmState === 1)
    },
    // 表格多选仅选择一项，重新安装可用
    reshipmentDisabled () {
      return this.multipleSelection.length !== 1
    },
    // 状态全为已停止或状态全为运行中的实例可重启
    restartDisabled () {
      if (this.noChoose) {
        return false
      } else {
        return (this.multipleSelection[0].vmState === 0 && this.hasStopped) ||
              (this.multipleSelection[0].vmState === 1 && this.hasRunning)
      }
    },
    // 仅有一个已选项且已选项的状态为已停止可重置密码
    resetDisabled () {
      if (this.noChoose) {
        return false
      } else {
        return this.multipleSelection.length !== 1 || this.hasRunning
      }
    },
    // 仅有一个已选项且已选项的状态为运行中
    linkDisabled () {
      if (this.noChoose) {
        return false
      } else {
        return this.multipleSelection.length !== 1 || this.hasStopped
      }
    },
    accessIp () {
      if (!this.noChoose) {
        return this.multipleSelection[0].networkCards.filter(i => i.isDefault === 1)
      } else {
        return []
      }
    }
  },
  components: {
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
@import '../../style/common.scss';
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
.dialogTableVisible .el-dialog__body{
  padding-top: 0
}
.el-popover {
  min-width: 0!important;
  padding: 6px 15px;
}
.instance-operate .el-dropdown-menu__item{
  line-height: 27px;
  padding: 0;
  text-align: center;
}
.warningIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.warn-text {
  color: #409EFF;
  background-color: rgba(64,158,255,.1);
  border: 1px solid rgba(64,158,255,.2);
  padding: 0 8px;
}
.hand {
  margin-bottom: -0.3em;
  font-size: 1.5em;
}
</style>
