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
                     @click="dialogVisible=true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table v-if="items"
              :data="items.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%">
      <el-table-column type="expand">
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
              <el-tag v-if="props.row.applyState===0"
                      type="success"
                      size="mini">通过</el-tag>
              <el-tag v-else-if="props.row.applyState===1"
                      type="danger"
                      size="mini">拒绝</el-tag>
              <el-tag v-else-if="props.row.applyState===2"
                      type="warning"
                      size="mini">审核中...</el-tag>
              <el-tag v-else-if="props.row.applyState===3"
                      type="info"
                      size="mini">已撤回</el-tag>
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
          <el-tag v-if="scope.row.applyState===0"
                  type="success"
                  size="mini">通过</el-tag>
          <el-tag v-else-if="scope.row.applyState===1"
                  type="danger"
                  size="mini">拒绝</el-tag>
          <el-tag v-else-if="scope.row.applyState===2"
                  type="warning"
                  size="mini">审核中...</el-tag>
          <el-tag v-else-if="scope.row.applyState===3"
                  type="info"
                  size="mini">已撤回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="150"
                       align="center">
        <template slot-scope="scope">
          <!-- 拒绝，已撤回：重新申请 -->
          <el-button type="primary"
                     v-if="applyAgain.indexOf(scope.row.applyState)!==-1"
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
    <!-- 添加申请 -->
    <el-dialog title="添加申请"
               :visible.sync="dialogVisible"
               width="50%"
               @close="dialogClosed"
               :before-close="beforeClose">
      <el-collapse v-model="activeNames"
                   class="applyCollapse">
        <el-collapse-item title="步骤一：选择模板" name="1">
          <el-tabs type="border-card">
            <el-tab-pane v-for="tab in tabTitel"
                         :key="tab.id"
                         :label="templateTypeMapping[tab]">
              <el-radio-group v-model="createInstance.templateId">
                <el-row v-for="template in templates.filter(v => v.typeId === tab)"
                        :key="template.id"
                        class="outsideRow">
                  <el-radio :label="template.id">
                    <el-row>
                      <el-col :span="8" style="padding-left: 30px;">
                        <img :src="template.templateIconPath"
                             width="130px">
                      </el-col>
                      <el-col :span="16">
                        <h4>{{ template.templateText }}</h4>
                        <p>操作系统：{{ template.osTypeName}}</p>
                        <p>虚拟化类型：{{ template.hyperVisor }}</p>
                      </el-col>
                    </el-row>
                  </el-radio>
                </el-row>
                </el-radio-group>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
        <el-collapse-item title="步骤二：配置实例" name="2">
          <el-form :model="createInstance"
                   ref="ruleForm"
                   :rules="rules"
                   label-width="100px"
                   style="width: 70%; margin: 0 auto">
            <el-form-item label="实例名称"
                          prop="instanceName">
              <el-input v-model="createInstance.instanceName"></el-input>
            </el-form-item>
            <el-form-item label="CPU内核数"
                          prop="cpuNumber">
              <el-input v-model.number="createInstance.cpuNumber"></el-input>
            </el-form-item>
            <el-form-item label="CPU(MHz)"
                          prop="cpuSpeed">
              <el-input v-model.number="createInstance.cpuSpeed"></el-input>
            </el-form-item>
            <el-form-item label="内存(MB)"
                          prop="memory">
              <el-input v-model.number="createInstance.memory"></el-input>
            </el-form-item>
            <el-form-item label="到期时间"
                          prop="dueTime">
              <el-date-picker v-model="createInstance.dueTime"
                              type="datetime"
                              placeholder="选择到期时间"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="步骤三：安全组"
                          class="collapse-style"
                          name="3">
          <el-table :data="getSecurityGroup"
                    style="width: 100%">
            <el-table-column prop="ruleType"
                             label="规则类型"
                             min-width="100"></el-table-column>
            <el-table-column prop="protocol"
                             label="协议"
                             min-width="100"></el-table-column>
            <el-table-column prop="startPort"
                             label="起始端口"
                             min-width="100"></el-table-column>
            <el-table-column prop="endPort"
                             label="结束端口"
                             min-width="100"></el-table-column>
            <el-table-column prop="cidp"
                             label="CIDP"
                             min-width="100"></el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="步骤四：添加存储"
                          class="collapse-style"
                          name="4">
          <el-table :data="getStorage">
            <el-table-column prop="storageName"
                             label="名称"
                             min-width="100"></el-table-column>
            <el-table-column prop="storageSize"
                             label="大小(GB)"
                             min-width="100"></el-table-column>
            <el-table-column label="操作"
                             min-width="100"
                             align="center">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="small"
                           icon="el-icon-plus"
                           v-show="scope.$index+1 === getStorage.length && addStorage===false"
                           @click="addStorage=true"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form inline
                   v-show="addStorage"
                   class="addStorage">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="dataDisk.storageName"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="dataDisk.storageSize"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: center">
                <el-form-item>
                  <el-button type="danger"
                              size="small"
                              icon="el-icon-delete"
                              @click="addStorage=false"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确 定</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 重新申请 -->
    <el-dialog title="重新申请"
               :visible.sync="onceApplyVisible"
               width="50%"
               @open="openOnceApplyDialog">
      <el-collapse v-model="activeNames"
                   class="applyCollapse">
        <el-collapse-item title="步骤一：选择模板" name="1">
          <el-tabs type="border-card">
            <el-tab-pane v-for="tab in tabTitel"
                         :key="tab.id"
                         :label="templateTypeMapping[tab]">
              <el-radio-group v-model="updateInstance.templateId">
                <el-row v-for="template in templates.filter(v => v.typeId === tab)"
                        :key="template.id"
                        class="outsideRow">
                  <el-radio :label="template.id">
                    <el-row>
                      <el-col :span="8" style="padding-left: 30px;">
                        <img :src="template.templateIconPath"
                             width="130px">
                      </el-col>
                      <el-col :span="16">
                        <h4>{{ template.templateText }}</h4>
                        <p>操作系统：{{ template.osTypeName}}</p>
                        <p>虚拟化类型：{{ template.hyperVisor }}</p>
                      </el-col>
                    </el-row>
                  </el-radio>
                </el-row>
                </el-radio-group>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
        <el-collapse-item title="步骤二：配置实例" name="2">
          <el-form :model="updateInstance"
                   ref="ruleForm"
                   :rules="rules"
                   label-width="100px"
                   style="width: 70%; margin: 0 auto">
            <el-form-item label="实例名称"
                          prop="instanceName">
              <el-input v-model="updateInstance.instanceName"></el-input>
            </el-form-item>
            <el-form-item label="CPU内核数"
                          prop="cpuNumber">
              <el-input v-model.number="updateInstance.cpuNumber"></el-input>
            </el-form-item>
            <el-form-item label="CPU(MHz)"
                          prop="cpuSpeed">
              <el-input v-model.number="updateInstance.cpuSpeed"></el-input>
            </el-form-item>
            <el-form-item label="内存(MB)"
                          prop="memory">
              <el-input v-model.number="updateInstance.memory"></el-input>
            </el-form-item>
            <el-form-item label="到期时间"
                          prop="dueTime">
              <el-date-picker v-model="updateInstance.dueTime"
                              type="datetime"
                              placeholder="选择到期时间"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="步骤三：安全组"
                          class="collapse-style"
                          name="3">
          <el-table :data="updateInstance.securityGroups"
                    style="width: 100%">
            <el-table-column prop="ruleType"
                             label="规则类型"
                             min-width="100"></el-table-column>
            <el-table-column prop="protocol"
                             label="协议"
                             min-width="100"></el-table-column>
            <el-table-column prop="startPort"
                             label="起始端口"
                             min-width="100"></el-table-column>
            <el-table-column prop="endPort"
                             label="结束端口"
                             min-width="100"></el-table-column>
            <el-table-column prop="cidp"
                             label="CIDP"
                             min-width="100"></el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="步骤四：添加存储"
                          class="collapse-style"
                          name="4">
          <el-table :data="updateInstance.storages|filterDataDisk">
            <el-table-column prop="storageName"
                             label="名称"
                             min-width="100"></el-table-column>
            <el-table-column prop="storageSize"
                             label="大小(GB)"
                             min-width="100"></el-table-column>
            <el-table-column label="操作"
                             min-width="100"
                             align="center">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="small"
                           icon="el-icon-plus"
                           v-show="scope.$index+temp === updateInstance.storages.length && addStorage===false"
                           @click="addStorage=true"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form inline
                   v-show="addStorage"
                   class="addStorage">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="updateDataDisk.storageName"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="updateDataDisk.storageSize"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align: center">
                <el-form-item>
                  <el-button type="danger"
                              size="small"
                              icon="el-icon-delete"
                              @click="deleteDataDisk"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="updateConfirm"
                   :loading="btnLoading">确 定</el-button>
        <el-button @click="onceApplyVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual'
import ApplyStateMapping from '../../utils/constant'
import { serverMixin } from '../mixins/serverMixins'
import { fetchAll, deleteOne, createOne, modifyOne } from '../../api/apply'
import { fetchAll as fetchTemplate } from '../../api/template'
import { fetchAll as fetchSecurityGroup } from '../../api/securityGroup'
import { fetchAll as fetchStorage } from '../../api/storage'
import { mapState } from 'vuex'
export default {
  name: 'Application',
  mixins: [serverMixin],
  data () {
    const originFormData = {
      id: -1,
      templateId: '',
      instanceName: '',
      cpuNumber: '',
      cpuSpeed: '',
      createTime: '',
      dueTime: '',
      securityGroup: [],
      storages: []
    }
    return {
      rules: {
        instanceName: [
          { required: true, message: '请输入实例名称', trigger: 'blur' }
        ],
        cpuNumber: [
          { required: true, message: '请输入CPU内核数', trigger: 'blur' },
          { type: 'number', message: 'CPU内核数必须为数字值', trigger: 'blur' }
        ],
        cpuSpeed: [
          { required: true, message: '请输入CPU主频', trigger: 'blur' },
          { type: 'number', message: 'CPU主频必须为数字值', trigger: 'blur' }
        ],
        memory: [
          { required: true, message: '请输入内存大小', trigger: 'blur' },
          { type: 'number', message: '内存必须为数字值', trigger: 'blur' }
        ],
        dueTime: [
          { required: true, message: '请输入到期时间', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      onceApplyVisible: false,
      btnLoading: false,
      activeNames: ['1', '2', '3', '4'],
      templates: [],
      getSecurityGroup: [],
      getStorage: [],
      tabTitel: [0, 1, 2, 3], // 对应系统模板，应用模板...
      templateTypeMapping: {
        0: '系统模板',
        1: '应用模板',
        2: '数据库模板',
        3: '中间件模板'
      },
      dataDisk: {
        id: -1,
        storageName: 'DATADISK',
        storageSize: ''
      },
      addStorage: false,
      createInstance: Object.assign({}, originFormData),
      originInstance: Object.assign({}, originFormData),
      updateInstance: {},
      hasDataDisk: -1,
      updateDataDisk: {},
      selectedId: -1,
      temp: 1,
      applyAgain: [1, 3]
    }
  },
  filters: {
    filterDataDisk (val) {
      if (val) {
        return val.filter(v => v.storageName !== 'DATADISK')
      }
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
          this.$message.info({ message: '已取消操作' })
        })
    },
    dialogClosed () {
      this.addStorage = false
      this.createInstance = { ...this.originInstance }
      this.$refs.ruleForm.clearValidate()
    },
    // 关闭前确认
    beforeClose (done) {
      if (isEqual(this.createInstance, this.originInstance)) {
        done()
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            done()
          })
          .catch(() => {})
      }
    },
    deleteDataDisk () {
      this.addStorage = false
      if (this.hasDataDisk !== -1) {
        this.temp = 2
      }
    },
    // 确认撤销
    revokeConfirm () {
      this.$confirm(`是否撤销
        ${this.items.find(list => list.id === this.selectedId).instanceName}
        的申请？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateInstance = Object.assign({}, this.items.find(list => list.id === this.selectedId))
        this.updateInstance.applyState = 3
        modifyOne(this.updateInstance)
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
          .then(() => {
            this.btnLoading = false
          }).catch(() => {
            this.$message.info('已取消操作')
          })
      })
    },
    // 重新申请
    selectOne ({ row }) {
      this.selectedId = row.id
      if (this.applyAgain.indexOf(row.applyState) !== -1) {
        this.temp = 1
        this.onceApplyVisible = true
      } else if (row.applyState === 0) {
        this.$message.warning({ message: '申请已通过，无法重新申请！' })
      } else if (row.applyState === 2) {
        this.revokeConfirm()
      }
    },
    openOnceApplyDialog () {
      this.updateInstance = Object.assign({}, this.items.find(list => list.id === this.selectedId))
      this.hasDataDisk = this.updateInstance.storages.findIndex(v => v.storageName === 'DATADISK')
      if (this.hasDataDisk === -1) { // 不存在DATADISK
        this.addStorage = false
        this.updateDataDisk = {
          id: -1,
          storageName: 'DATADISK',
          storageSize: ''
        }
      } else { // 存在DATADISK
        this.addStorage = true
        this.updateDataDisk = Object.assign({}, this.updateInstance.storages.find(v => v.storageName === 'DATADISK'))
      }
    },
    updateConfirm () {
      if (this.addStorage && this.updateDataDisk.storageSize === '') {
        this.$message.warning({ message: '请选择DATADISK大小' })
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            if (this.hasDataDisk !== -1 && this.addStorage) {
              this.updateInstance.storages.splice(this.hasDataDisk, 1, this.updateDataDisk)
            } else if (this.hasDataDisk !== -1 && this.addStorage === false) {
              this.updateInstance.storages.splice(this.hasDataDisk, 1)
            } else if (this.hasDataDisk === -1 && this.addStorage) {
              this.updateInstance.storages.push(this.updateDataDisk)
            }
            modifyOne(this.updateInstance)
              .then(res => {
                this.onceApplyVisible = false
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
          } else {
            return false
          }
        })
      }
    },
    // 添加
    confirm () {
      if (this.createInstance.templateId === '') {
        this.$message.warning({ message: '请选择模板' })
      } else if (this.addStorage && this.dataDisk.storageSize === '') {
        this.$message.warning({ message: '请选择DATADISK大小' })
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.createInstance.securityGroup = this.getSecurityGroup
            this.createInstance.storages = this.getStorage
            this.createInstance.createTime = this.nowDate
            if (this.addStorage) {
              this.createInstance.storages.push(this.dataDisk)
            }
            createOne(this.createInstance)
              .then(res => {
                this.dialogVisible = false
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
          } else {
            return false
          }
        })
      }
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
    // 获取当前时间，yyyy-mm-dd hh-mm-ss
    nowDate () {
      return new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().substr(0, 8)
    }
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
