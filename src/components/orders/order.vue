<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索框区，每行划分为24格栅,gutter指定行内子元素间距 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryParams.query" clearable>
              <el-button slot="append" icon="el-icon-search" @click="queryOrderByName"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!-- 表单显示区域 stripe表示斑马条纹显示 -->
        <el-table :data="orderList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#">
            <template v-slot="scope">
              <!-- （当前页码-1）*页面数据数量+当前行渲染索引+1 -->
              <span>{{ (queryParams.pagenum - 1) * queryParams.pagesize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_number" label="订单编号"> </el-table-column>
          <el-table-column prop="order_price" label="订单价格"> </el-table-column>
          <el-table-column label="是否付款">
            <template v-slot="{ row }">
              <el-tag v-if="row.pay_status == 0" type="danger" effect="dark">
                未付款
              </el-tag>
              <el-tag v-else effect="dark">
                已付款
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"> </el-table-column>
          <el-table-column label="下单时间">
            <template v-slot="{ row }">
              <span>{{ row.create_time | dateFormat }}</span> </template
            >m
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-tooltip class="item" effect="light" content="修改订单地址" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderInfo(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="物流信息" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-map-location" size="mini" :id="row.id" @click="logisticsInfo(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页功能区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 修改地址对话框 -->
        <!-- 弹出修改用户对话框区域 -->
        <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
          <el-form :model="editAddressForm" :rules="editFormRules" ref="editFormRef" label-width="auto" class="demo-ruleForm">
            <el-form-item label="省市区/县" prop="area">
              <!-- 级联选择器 -->
              <el-cascader v-model="editAddressForm.area" :options="cityOptions" :props="cascaderProps" clearable filterable placeholder="请选择分类" class="cascader"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="editAddressForm.address"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editForm">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 物流进度查询对话框区域 -->
        <el-dialog title="物流进度" :visible.sync="logisticsDialogVisible" width="50%" @close="resetLogisticsForm">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in logisticsMessage"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.time"
            >
              {{ activity.context }}
            </el-timeline-item>
          </el-timeline>
          <span slot="footer" class="dialog-footer">
            <el-button @click="logisticsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
/* 引入省市级数据 */
import cityData from './city_data2017_element'
/* 引入防抖函数 */
import { debounce } from '../../assets/js/tools'
export default {
  data() {
    return {
      queryParams: {
        /* 查询参数 */
        query: '',
        /* 页面显示数据数量 */
        pagesize: 5,
        /* 当前页码 */
        pagenum: 1
      },
      /* 数据总数 */
      total: 0,
      /* 订单列表 */
      orderList: [],
      /* 控制修改地址对话框 */
      editDialogVisible: false,
      /* 修改地址表单 */
      editAddressForm: {
        area: [],
        address: ''
      },
      cityOptions: cityData,
      /* 表单验证规则 */
      editFormRules: {
        area: [{ required: true, message: '请选则所在的区县', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      /* 级联选择器配置 */
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'label',
        children: 'children'
      },
      logisticsDialogVisible: false,
      logisticsMessage: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
          icon: 'el-icon-map-location',
          color: 'green'
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    /* 获取订单列表 */
    async getOrders() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) return
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    /* 处理页面显示数据大小变化 */
    handleSizeChange(val) {
      /* 更新变化后的页面数据数量 */
      this.queryParams.pagesize = val
      this.getOrders()
    },
    /* 处理当前页码变化 */
    handleCurrentChange(val) {
      /* 更新变化后的页面页码 */
      this.queryParams.pagenum = val
      this.getOrders()
    },
    /* 编辑订单信息 */
    editOrderInfo(row) {
      this.editDialogVisible = true
    },
    /* 物流信息 */
    async logisticsInfo() {
      this.logisticsDialogVisible = true
      /* const { data: res } = await this.$http.get('/kuaidi/SF1400221975275')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.logisticsMessage = res.data */
    },
    /* 根据订单编号查询  */
    /* 使用防抖算法进行搜索 */
    queryOrderByName: debounce(function() {
      this.getOrders()
    }, 1000),
    /* 对话框关闭时重置表单 */
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    /* 点击确定提交编辑表单 */
    editForm() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请按要求填写地址')
        }
        this.editDialogVisible = false
      })
    },
    /* 清空物流信息 */
    resetLogisticsForm() {}
  }
}
</script>
<style lang="less" scoped>
.cascader {
  width: 100%;
}
</style>
