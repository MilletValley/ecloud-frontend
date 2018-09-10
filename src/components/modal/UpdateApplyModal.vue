<template>
  <section>
    <el-dialog title="重新申请"
               :visible.sync="dialogVisible"
               width="50%"
               @open="dialogOpen"
               @close="dialogClosed"
               :before-close="beforeClose">
      <el-collapse v-model="activeNames"
                   class="applyCollapse">
        <el-collapse-item title="步骤一：选择模板" name="1">
          <el-tabs type="border-card">
            <el-tab-pane v-for="(value, key) in templateTypeMapping"
                         :key="key.id"
                         :label="value">
              <el-radio-group v-model="formData.templateId">
                <el-row v-for="template in templates.filter(v => v.typeId === Number(key))"
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
          <el-form :model="formData"
                   ref="ruleForm"
                   :rules="rules"
                   label-width="100px"
                   style="width: 70%; margin: 0 auto">
            <el-form-item label="实例名称"
                          prop="instanceName">
              <el-input v-model="formData.instanceName"></el-input>
            </el-form-item>
            <el-form-item label="CPU内核数"
                          prop="cpuNumber">
              <el-input v-model.number="formData.cpuNumber"></el-input>
            </el-form-item>
            <el-form-item label="CPU(MHz)"
                          prop="cpuSpeed">
              <el-input v-model.number="formData.cpuSpeed"></el-input>
            </el-form-item>
            <el-form-item label="内存(MB)"
                          prop="memory">
              <el-input v-model.number="formData.memory"></el-input>
            </el-form-item>
            <el-form-item label="到期时间"
                          prop="dueTime">
              <el-date-picker v-model="formData.dueTime"
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
          <el-table :data="formData.securityGroups"
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
          <el-table :data="formData.storages|filterDataDisk">
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
                           v-show="scope.$index+index === formData.storages.length && addStorage===false"
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
  </section>
</template>
<script>
import { applyModalMixin } from '../mixins/applyModalMixins'
export default {
  name: 'UpdateApplyModal',
  mixins: [applyModalMixin],
  props: [
    'visible',
    'btnLoading',
    'templates',
    'applyInfo'
  ],
  data () {
    return {
      formData: {},
      originFormData: {}
    }
  },
  filters: {
    filterDataDisk (val) {
      if (val) {
        return val.filter(v => v.storageName !== 'DATADISK')
      }
    }
  },
  computed: {
    // 不存在'DATADISK'
    hasDataDisk () {
      return this.formData.storages.findIndex(v => v.storageName === 'DATADISK') !== -1
    },
    // DATADISK索引
    dataDiskIndex () {
      return this.formData.storages.findIndex(v => v.storageName === 'DATADISK')
    },
    // 存储列表中最后一个元素显示添加
    index () {
      return this.hasDataDisk ? 2 : 1
    }
  },
  methods: {
    dialogClosed () {
      this.addStorage = false
      this.dataDisk = {
        id: -1,
        storageName: 'DATADISK',
        storageSize: ''
      }
      this.$refs.ruleForm.clearValidate()
    },
    dialogOpen () {
      this.originFormData = { ...this.applyInfo }
      this.formData = { ...this.applyInfo }
      if (this.hasDataDisk) { // 存在DATADISK
        this.addStorage = true
        this.dataDisk = Object.assign({}, this.formData.storages.find(v => v.storageName === 'DATADISK'))
      }
    },
    confirm () {
      if (this.addStorage && this.dataDisk.storageSize === '') {
        this.$message.warning({ message: '请选择DATADISK大小' })
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.hasDataDisk && this.addStorage) {
              this.formData.storages.splice(this.dataDiskIndex, 1, this.dataDisk)
            } else if (this.hasDataDisk && this.addStorage === false) {
              this.formData.storages.splice(this.dataDiskIndex, 1)
            } else if (!this.hasDataDisk && this.addStorage) {
              this.formData.storages.push(this.dataDisk)
            }
            this.$emit('confirm', this.formData)
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>
