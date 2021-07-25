<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon effect="dark" :closable="false"> </el-alert>
      <el-form label-width="100px">
        <el-form-item label="选择商品分类">
          <el-cascader v-model="selectedCateId" :options="cateForm" :props="props" @change="handleCasChange"></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
          <!-- 动态参数表格渲染区域 -->
				<el-tab-pane label="动态属性" name="many">
          <el-button type="primary" @click="openAddAttrDialog">添加属性</el-button>
          <!-- 表单显示区域 stripe表示斑马条纹显示 -->
          <el-table :data="attributeList" style="width: 100%" border stripe>
            <el-table-column type="expand" label="">
              <template v-slot="{ row }">
                <el-tag :key="index" v-for="(item, index) in row.attr_vals" closable :disable-transitions="false" @close="closeTag(row, index)">
                  {{ item }}
                </el-tag>
                <!-- 这里因为按下回车键也会触发Blur事件，所以会执行两次处理函数
										解决办法：讲按下回车事件绑定为blur事件
								-->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="$event.target.blur(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="{ row }">
                <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttrInfo(row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="openAddAttrDialog">添加属性</el-button>
          <!-- 表单显示区域 stripe表示斑马条纹显示 -->
          <el-table :data="attributeList" style="width: 100%" border stripe>
            <el-table-column type="expand" label="">
              <template v-slot="{ row }">
                <el-tag :key="index" v-for="(item, index) in row.attr_vals" closable :disable-transitions="false" @close="closeTag(row, index)">
                  {{ item }}
                </el-tag>
                <!-- 这里因为按下回车键也会触发Blur事件，所以会执行两次处理函数
										解决办法：讲按下回车事件绑定为blur事件
								-->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="$event.target.blur(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="{ row }">
                <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttrInfo(row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加参数" :visible.sync="addAttrDialogVisible" width="50%" @close="resetAddForm">
        <el-form :model="addAttrForm" :rules="attrRules" ref="addAttrFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="attr_name">
            <el-input v-model="addAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAttrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttr">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加编辑对话框 -->
      <el-dialog title="添加参数" :visible.sync="editAttrDialogVisible" width="50%">
        <el-form :model="editAttrForm" :rules="attrRules" ref="editAttrFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="attr_name">
            <el-input v-model="editAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAttrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAttr">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      /* 商品分类列表 */
      cateForm: [],
      /* 选中的商品分类id */
      selectedCateId: [],
      /* 级联选择器参数 */
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      /* tab选项卡名称 */
      tabName: 'many',
      /* 属性列表 */
      attributeList: [],
      /* 添加属性名称 */
      addAttrForm: {
        attr_name: ''
      },
      /* 编辑属性名称 */
      editAttrForm: {},
      /* 控制添加属性对话框显示 */
      addAttrDialogVisible: false,
      /* 控制编辑属性对话框显示 */
      editAttrDialogVisible: false,
      attrRules: {
        attr_name: [{ required: true, message: '属性名不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    /* 获取分类列表 */
    async getGoodsCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return
      this.cateForm = res.data
    },
    /* 获取参数列表 */
    async getAttributes() {
      console.log(this.selectedCateId)
      /* 如果长度不是3说明不是第三级分类 */
      if (this.selectedCateId.length !== 3) {
        this.selectedCateId = []
        this.attributeList = []
        return
      }
      const { data: res } = await this.$http.get(`/categories/${this.selectedCateId[2]}/attributes`, { params: { sel: this.tabName } })
      if (res.meta.status !== 200) return
      console.log(res.data)
      /* 将返回值的attr_vals属性转换为数组 */
      res.data.forEach(item => {
        if (item.attr_vals.length === 0) {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(',')
        }
        /* 给每一个对象添加inputvisible和inpuevalue属性，
					 使得每一行的tag标签输入值由每一行自己作用域控制，
					 避免发生冲突
				*/
        item.inputVisible = false
        item.inputValue = ''
      })
      this.attributeList = res.data
    },
    /* 当级联选择器变化时触发 */
    handleCasChange() {
      /* 查询参数列表 */
      this.getAttributes()
    },
    /* 当Tab页签发生切换 */
    handleTabClick() {
      this.getAttributes()
    },
    /* 控制标签输入框 */
    showInput(row) {
      row.inputVisible = true
      /* 使输入文本框获得焦点 */
      /* nextTick函数会在元素渲染完成后调用 */
      this.$nextTick(() => {
        /* 将文本框获得焦点 */
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /* 当标签输入框输入完毕时 */
    handleInputConfirm(row) {
      /* 判断输入值是否为空 */
      if (row.inputValue.trim().length === 0) {
        /* 清空绑定的属性值 */
        row.inputValue = ''
        /* 关闭文本框 */
        row.inputVisible = false
      } else {
        /* 将输入值添加到row对象中进行前端渲染 */
        row.attr_vals.push(row.inputValue)
        /* 关闭文本框 */
        row.inputVisible = false
        /* 向服务器端请求修改参数 */
        this.editParams(row)
      }
    },
    /* 修改可选参数 */
    async editParams(row) {
      const { data: res } = await this.$http.put(`/categories/${this.selectedCateId[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.tabName,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    /* 删除可选参数 */
    closeTag(row, index) {
      /* 从row.attr_Vals数组中删除指定索引的项 */
      row.attr_vals.splice(index, 1)
      this.editParams(row)
    },
    /* 打开添加属性对话框 */
    openAddAttrDialog() {
      this.addAttrDialogVisible = true
    },
    /* 添加属性 */
    addAttr() {
      this.$refs.addAttrFormRef.validate(async valid => {
        /* 判断是否验证成功 */
        if (!valid) return
        /* 判断是否选择第三级分类 */
        if (this.selectedCateId.length !== 3) {
          return this.$message.error('参数分类为空，请选择三级分类')
        }
        const { data: res } = await this.$http.post(`/categories/${this.selectedCateId[2]}/attributes`, {
          attr_name: this.addAttrForm.attr_name,
          attr_sel: this.tabName,
          attr_vals: ''
        })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('属性添加失败')
        }
        this.$message.success('属性添加成功')
        /* 关闭对话框 */
        this.addAttrDialogVisible = false
        /* 重新渲染列表 */
        this.getAttributes()
      })
    },
    /* 重置添加表单 */
    resetAddForm() {
      this.$refs.addAttrFormRef.resetFields()
    },
    /* 编辑属性对话框打开级信息查询 */
    async editAttrInfo(row) {
      const { data: res } = await this.$http.get(`categories/${this.selectedCateId[2]}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return
      this.editAttrForm = res.data
      this.editAttrDialogVisible = true
    },
    /* 编辑属性提交 */
    editAttr() {
      this.$refs.editAttrFormRef.validate(async valid => {
        /* 判断是否验证成功 */
        if (!valid) return
        const { data: res } = await this.$http.put(`/categories/${this.selectedCateId[2]}/attributes/${this.editAttrForm.attr_id}`, {
          attr_name: this.editAttrForm.attr_name,
          attr_sel: this.tabName,
          attr_vals: ''
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('属性修改失败')
        }
        this.$message.success('属性修改成功')
        /* 关闭对话框 */
        this.editAttrDialogVisible = false
        /* 重新渲染列表 */
        this.getAttributes()
      })
    },
    deleteAttr(row) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.selectedCateId[2]}/attributes/${row.attr_id}`)
          if (res.meta.status !== 200) {
            return this.$http.error('删除属性失败')
          }
          this.$message.success('删除属性成功')
          /* 重新渲染列表 */
          this.getAttributes()
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.button-new-tag,
.input-new-tag {
  width: 100px;
}
</style>
