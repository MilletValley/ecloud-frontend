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
                <el-option label="名称" value="instanceName"></el-option>
                <el-option label="资源域" value="zoneName"></el-option>
                <el-option label="到期时间" value="dueTime"></el-option>
              </el-select>
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchByName"></el-button>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table v-if="items"
              :data="items.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              style="width: 100%">
      <el-table-column label="序号"
                       min-width="50"
                       fixed=""
                       align="center">
        <template slot-scope="scope">
          {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       min-width="100"
                       prop="instanceName"
                       align="center"></el-table-column>
      <el-table-column label="服务方案"
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
      <el-table-column label="到期时间"
                       min-width="100"
                       prop="dueTime"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       min-width="100"
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
  </section>
</template>
<script>
import { fetchAll } from '../../api/database'
import { serverMixin } from '../mixins/serverMixins'
export default {
  name: 'DatabaseManage',
  mixins: [serverMixin],
  methods: {
    fetchData () {
      fetchAll()
        .then(res => {
          const { data } = res.data
          this.items = data
          this.originItems = data
        })
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
</style>
