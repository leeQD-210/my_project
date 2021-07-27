<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索框区，每行划分为24格栅,gutter指定行内子元素间距 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @input="queryGoodsByName">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"><el-button type="primary" @click="goAddGoods">添加商品</el-button></el-col>
        </el-row>
        <!-- 表单显示区域 stripe表示斑马条纹显示 -->
        <el-table :data="goodsList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#">
            <template v-slot="scope">
              <!-- （当前页码-1）*页面数据数量+当前行渲染索引+1 -->
              <span>{{ (queryParams.pagenum - 1) * queryParams.pagesize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="600px"> </el-table-column>
          <el-table-column prop="goods_price" label="商品价格（元）" width="110px"> </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"> </el-table-column>
          <el-table-column label="创建时间">
            <template v-slot="{ row }">
              <span>{{ row.add_time | dateFormat }}</span> </template
            >m
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsInfo(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" :id="row.id" @click="deleteGoods(row)"></el-button>
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
      </div>
    </el-card>
    <!-- 弹出修改用户对话框区域 -->
    <el-dialog title="编辑用户" :visible.sync="editGoodsDialogVisible" width="50%">
      <el-form :model="editGoodsForm" :rules="editGoodsRules" ref="editGoodsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from '../../assets/js/tools'
export default {
  data() {
    return {
      /* 添加商品对话框 */
      addGoodsDialogVisible: false,
      /* 编辑商品对话框 */
      editGoodsDialogVisible: false,
      /* 商品列表 */
      goodsList: [],
      /* 查询商品参数 */
      queryParams: {
        /* 查询名称 */
        query: '',
        /* 当前页码 */
        pagenum: 1,
        /* 页面显示数据多少 */
        pagesize: 10
      },
      /* 添加商品表单 */
      addGoodsForm: {},
      /* 编辑商品表单 */
      editGoodsForm: {},
      /* 当面查询数据总数 */
      total: 0,
      /* 编辑商品表单验证规则 */
      editGoodsRules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '商品重量不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    /* 查询所有商品 */
    async getGoods() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) return
      /* 保存返回商品列表 */
      this.goodsList = res.data.goods
      /* 保存当前页码 */
      this.queryParams.pagenum = parseInt(res.data.pagenum)
      /* 保存数据总数 */
      this.total = res.data.total
    },
    /* 编辑商品信息 */
    async editGoodsInfo(row) {
      this.editGoodsDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return
      this.editGoodsForm = res.data
    },
    /* 编辑商品 */
    editGood() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/goods/' + this.editGoodsForm.goods_id, {
          goods_name: this.editGoodsForm.goods_name,
          goods_number: this.editGoodsForm.goods_number,
          goods_weight: this.editGoodsForm.goods_weight,
          goods_price: this.editGoodsForm.goods_price,
          goods_cat: this.editGoodsForm.goods_cat
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('商品信息修改失败')
        }
        this.editGoodsDialogVisible = false
        this.$message.success('商品信息修改成功')
        /* 重新渲染列表 */
        this.getGoods()
      })
    },
    /* 删除商品 */
    deleteGoods(row) {
      const options = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', options)
        .then(async () => {
          const { data: res } = await this.$http.delete('/goods/' + row.goods_id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('删除商品成功')
          this.getGoods()
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    /* 处理页面显示数据大小变化 */
    handleSizeChange(val) {
      /* 更新变化后的页面数据数量 */
      this.queryParams.pagesize = val
      this.getGoods()
    },
    /* 处理当前页码变化 */
    handleCurrentChange(val) {
      /* 更新变化后的页面页码 */
      this.queryParams.pagenum = val
      console.log(this)
      this.getGoods()
    },
    /* 根据商品名称查询商品 */
    /* 调用防抖函数,最后一次点击1000ms执行查询操作 */
    queryGoodsByName: debounce(function() {
      this.getGoods()
    }, 1000),
    /* 跳转添加商品界面 */
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
