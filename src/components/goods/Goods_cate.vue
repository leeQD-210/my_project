<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        <!-- 表单显示区域 stripe表示斑马条纹显示selection-type:是否多选 is-fold是否折叠 -->
        <tree-table
          index-text="#"
          show-index
          :selection-type="false"
          :expand-type="false"
          :data="goodsCateList"
          :columns="columns"
          children-prop="children"
          tree-type
          :show-row-hover="false"
          stripe
          border
        >
          <!-- 状态插槽 -->
          <template v-slot:isWork="{ row }">
            <span :class="['iconfont', row.cat_deleted ? 'icon-error' : 'icon-correct']"></span>
          </template>
          <!-- 排序插槽 -->
          <template v-slot:order="{ row }">
            <el-tag v-if="row.cat_level == 0" effect="dark">{{ '一级' }}</el-tag>
            <el-tag v-else-if="row.cat_level == 1" type="success" effect="dark">{{ '二级' }}</el-tag>
            <el-tag v-else type="warning" effect="dark">{{ '三级' }}</el-tag>
          </template>
          <!-- 操作插槽 -->
          <template v-slot:action="{ row }">
            <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsCate(row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" :id="row.id" @click="deleteGoodsCate(row)"></el-button>
            </el-tooltip>
          </template>
        </tree-table>
        <!-- 分页功能区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="resetAddForm">
          <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- 级联选择器 -->
              <el-cascader v-model="selectParentCateId" :options="parentCateInfo" :props="cascaderProps" @change="handleCascaderChange" clearble filterable placeholder="尝试搜索关键词"></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
          <el-form :model="editCateForm" :rules="editCateRules" ref="editCateFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsCateList: [],
      queryParams: {
        /* 获取分类等级 */
        type: 3,
        /* 当前页码 */
        pagenum: 1,
        /* 显示数据大小 */
        pagesize: 10
      },
      /* 共有多少条数据 */
      total: 1,
      /* 定义table每一列数据 */
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        /* 使用模板插槽 */
        {
          label: '是否有效',
          type: 'template',
          template: 'isWork'
        },
        /* 模板插槽 */
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'action'
        }
      ],
      /* 添加分类对话框显示 */
      addCateDialogVisible: false,
      /* 编辑分类对话框显示 */
      editCateDialogVisible: false,
      /* 添加分类表单信息,level：0表示一级 */
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      /* 选中的父级分类id */
      selectParentCateId: 0,
      /* 父级分类信息 */
      parentCateInfo: [],
      /* 级联选择器配置信息 */
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children',
        value: 'cat_id',
        /* 开启多选 */
        multiple: true,
        /* 父子不关联 */
        checkStrictly: true
      },
      /* 添加分类表单验证规则 */
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      /* 编辑分类表单 */
      editCateForm: {
        cat_name: '',
        id: 0
      },
      /* 编辑分类表单验证规则 */
      editCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    /* 组件创建时初始化商品分类数据 */
    this.getGoodsCateList()
  },
  methods: {
    /* 获取商品分类列表 */
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
    },
    /* 编辑商品分类 */
    async editGoodsCate(row) {
      const { data: res } = await this.$http.get('/categories/' + row.cat_id)
      if (res.meta.status !== 200) return
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateForm.id = res.data.cat_id
      /* 打开编辑对话框 */
      this.editCateDialogVisible = true
    },
    /* 删除商品分类 */
    deleteGoodsCate(row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/categories/' + row.cat_id)
          if (res.meta.status !== 200) {
            return this.$message.error('分类删除失败')
          }
          this.$message.success('分类删除成功')
          this.getGoodsCateList()
        })
        .catch(() => {
          this.$message.info('删除取消')
        })
    },
    /* 調整頁面顯示數據大小 */
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getGoodsCateList()
    },
    /* 調整現在頁碼 */
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getGoodsCateList()
    },
    /* 打开添加分类对话框 */
    async showAddCateDialog() {
      /* 获取父级分类数据 */
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return
      console.log(res)
      this.parentCateInfo = res.data
      /* 显示对话框 */
      this.addCateDialogVisible = true
    },
    /* 级联选择器变化时触发 */
    handleCascaderChange() {
      console.log(this.selectParentCateId.length)
      console.log(this.selectParentCateId)
      /* 如果被选中父级Id数组长度为0,说明为选父级，该分类作为一级分类 */
      if (this.selectParentCateId.length === 0) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      } else {
        /* 选中父级Id为数组最后一位，数组长度为几则为几级分类 */
        this.addCateForm.cat_pid = this.selectParentCateId[0][this.selectParentCateId[0].length - 1]
        this.addCateForm.cat_level = this.selectParentCateId[0].length
      }
    },
    /* 添加对话框点击确定,先进行预验证，再发送请求 */
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/categories', this.addCateForm)
        console.log(this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加分类成功')
        /* 初始化分类列表 */
        this.getGoodsCateList()
        /* 关闭对话框 */
        this.addCateDialogVisible = false
      })
    },
    /* 对话框关闭时重置表单 */
    resetAddForm() {
      this.$refs.addCateFormRef.resetFields()
      /* 级联菜单选择id为空 */
      this.selectParentCateId = []
      /* 提交数据重置 */
      this.addCateForm.cat_id = 0
      this.addCateForm.cat_level = 0
    },
    /* 编辑对话框点击确定,先进行预验证，再发送请求 */
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/categories/' + this.editCateForm.id, { cat_name: this.editCateForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error(this.meta.msg)
        }
        this.$message.success('分类名称修改成功')
        this.editCateDialogVisible = false
        /* 重新渲染列表 */
        this.getGoodsCateList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.icon-correct {
  color: lightgreen;
}
.icon-erroe {
  color: red;
}
</style>
