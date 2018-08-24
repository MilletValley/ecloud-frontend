<template>
  <section>
    <template>
      <el-row :gutter="20">
        <el-col v-for="(value, key) in serverType"
                :key="value.id"
                :span="8">
          <el-card style="margin-bottom: 1em">
            <div slot="header" class="clearfix">
              <span>{{ value }}</span>
                <router-link :to="`servermanage/${key.slice(0,key.length-6)}`"
                             :class="$style.link"
                             v-if="key!=='server'"
                             style="float: right;">查看</router-link>
            </div>
            <div style="position: relative;">
              <span :class="$style.serverNumber">0</span>
              <i-icon :name="getKebabCase(key)"
                      :class="$style.serverIcon"></i-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-for="(value, key) in hardwareType"
                :key="value.id"
                :span="8">
          <el-card style="padding-bottom: 10px; margin-bottom: 1em; background-color: #00264a">
            <el-col :span="8">
              <i-icon :name="getKebabCase(key)"
                      :class="$style.hardwareIcon"></i-icon>
            </el-col>
            <el-col :span="16" :class="$style.hardware">
              <el-row><span :class="$style.hardwareName">{{ value[0] }}({{ value[1] }})</span></el-row>
              <el-row :class="$style.hardwareNumber">456</el-row>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <div style="text-align: center; font-weight: 700">申请总量历史记录</div>
          </div>
          <div>
            <div id="barChart" :style="{width: '100%', height: '300%', margin: '0 auto'}"></div>
          </div>
        </el-card>
      </el-row>
    </template>
  </section>
</template>

<script>
import IIcon from '../IIcon.vue'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'Dashbord',
  data () {
    return {
      serverType: {
        server: '服务器',
        systemServer: '系统服务器',
        applicationServer: '应用服务器',
        databaseServer: '数据库服务器',
        middlewareServer: '中间件服务器'
      },
      hardwareType: {
        cpu: ['CPU', '个'],
        memory: ['内存', 'MB'],
        disk: ['磁盘', 'GB']
      }
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    // 驼峰命名法转短横线命名法
    getKebabCase (str) {
      return str.replace(/[A-Z]/g, function (i) {
        return '-' + i.toLowerCase()
      })
    },
    // 画柱状图
    drawLine () {
      let barChart = echarts.init(document.getElementById('barChart'))
      barChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '申请总量', '通过总量'],
            ['2018-1-26', 9, 8],
            ['2018-1-29', 3, 0],
            ['2018-1-30', 1, 1],
            ['2018-8-27', 2, 2]
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
          {type: 'bar', label: this.labelNum, barWidth: 40},
          {type: 'bar', label: this.labelNum, barWidth: 40}
        ]
      })
      window.addEventListener('resize', function () {
        barChart.resize()
      })
    }
  },
  computed: {
    labelNum () {
      return {
        normal: {
          show: true,
          position: 'top',
          textStyle: {
            color: 'black'
          }
        }
      }
    }
  },
  components: {
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
.serverIcon {
  width: 2.5em;
  height: 2.5em;
  position: absolute;
  top: 0.4em;
  right: 0;
}
.serverNumber {
  font-size: 46px;
  color: #8a8a8a;
}
.hardwareIcon {
  height: 4em;
  width: 4em;
}
.hardware {
  text-align: right;
}
.hardwareName {
  font-size: 16px;
  font-weight: 700;
  color: #949da6;
}
.hardwareNumber {
  font-size: 36px;
  color: #fff;
}
</style>
