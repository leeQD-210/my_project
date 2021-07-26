<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 750px;height:400px;"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
/* 导入echarts组件 */
import * as echarts from 'echarts'
/* 导入lodash组件 */
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  /* mouted钩子函数表示已经挂载渲染完成,此时才能获取页面中的dom元素 */
  mounted() {
    this.initEcharts()
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        this.$message.error('获取图表数据失败')
      }
      /* 将返回的数据的定义的数据格式合并成一个对象 */
      const result = _.merge(res.data, this.options)
      console.log(result)
      /* 添加要显示的数据 */
      myChart.setOption(result)
    }
  }
}
</script>
<style lang="less" scoped></style>
