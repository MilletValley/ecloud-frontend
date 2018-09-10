<template>
  <section>
    <el-tabs type="border-card">
      <!-- 详细信息 -->
      <el-tab-pane label="详细信息">
        <el-form label-position="left"
                  inline
                  class="demo-table-expand">
          <el-form-item label="名称">{{ itemDetail.instanceName }}</el-form-item>
          <el-form-item label="虚拟机密码">{{ itemDetail.vmPass }}</el-form-item>
          <el-form-item label="资源域">{{ itemDetail.zoneName }}</el-form-item>
          <el-form-item label="CPU内核数">{{ itemDetail.cpuNumber }}</el-form-item>
          <el-form-item label="模板名称">{{ itemDetail.templateName }}</el-form-item>
          <el-form-item label="CPU(MHz)">{{ itemDetail.cpuSpeed }}</el-form-item>
          <el-form-item label="操作系统类型">{{ itemDetail.osName }}</el-form-item>
          <el-form-item label="内存(MB)">{{ itemDetail.memory }}</el-form-item>
          <el-form-item label="申请状态">
            <el-tag :type="tagType(itemDetail.applyState)"
                size="mini">{{ stateConvert(itemDetail.applyState) }}</el-tag>
          </el-form-item>
          <el-form-item label="数据卷大小">{{ itemDetail.diskSize }}</el-form-item>
          <el-form-item label="用户名">{{ userName }}</el-form-item>
          <el-form-item label="到期时间">
            <el-tag type="info"
                    size="mini">{{ itemDetail.dueTime }}</el-tag>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 网卡 -->
      <el-tab-pane label="网卡">
        <el-table :data="itemDetail.networkCards"
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
          <el-table-column label="默认网卡"
                           min-width="80"
                           align="center">
            <template slot-scope="scope">
              <i class="el-icon-success"
                 v-if="scope.row.isDefault === 1"
                 :class="$style.successColor"></i>
              <i class="el-icon-error"
                 :class="$style.errorColor"
                 v-else></i>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 统计数据 -->
      <el-tab-pane label="统计数据">
        <el-form label-position="left"
                  inline
                  class="demo-table-expand">
          <el-form-item label="总CPU">{{ itemDetail.cpuNumber }}*{{ itemDetail.cpuSpeed }} MHz</el-form-item>
          <el-form-item label="CPU利用率">{{ itemDetail.cpuUtilization }}</el-form-item>
          <el-form-item label="网络读取量">{{ itemDetail.networdRead }}</el-form-item>
          <el-form-item label="网络写入量">{{ itemDetail.networkWrite }}</el-form-item>
          <el-form-item label="磁盘读取(字节)">{{ itemDetail.diskReadByte }}</el-form-item>
          <el-form-item label="磁盘写入(字节)">{{ itemDetail.diskWriteByte }}</el-form-item>
          <el-form-item label="磁盘读取(IO)">{{ itemDetail.diskReadIO }}</el-form-item>
          <el-form-item label="磁盘写入(IO)">{{ itemDetail.diskWriteIO }}</el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { ApplyStateMapping, typeMapping } from '../utils/constant'
import { mapState } from 'vuex'

export default {
  name: 'Accordion',
  props: ['itemDetail'],
  data () {
    return {

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
    })
  },
  methods: {
    stateConvert (state) {
      return ApplyStateMapping[state]
    },
    tagType (type) {
      return typeMapping[type]
    }
  }
}
</script>
<style lang="scss" module>
@import '../style/color.scss';
</style>
