<template>
  <section>
    <el-dialog title="统计实例数据"
               :visible.sync="dialogVisible"
               class="dialogTableVisible"
               @open="openTableDialog"
               width="80%">
      <el-table v-if="tableData"
                :data="tableData.slice((dialogCurrentPage-1)*dialogPageSize,dialogCurrentPage*dialogPageSize)"
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
                      :total="tableData.length"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: 'StatisticsInstanceDialog',
  props: ['tableData', 'visible'],
  data () {
    return {
      dialogCurrentPage: 1,
      dialogPageSize: 10
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('update:visible', value)
        }
      }
    }
  },
  methods: {
    openTableDialog () {
      this.dialogCurrentPage = 1
    },
    dialogCurrentChange (currentPage) {
      this.dialogCurrentPage = currentPage
    }
  }
}
</script>
