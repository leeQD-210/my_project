<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索框区，每行划分为24格栅,gutter指定行内子元素间距 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
        </el-row>
        <!-- 表单显示区域 -->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!-- el-table组件在渲染时row属性表示每一行的信息数据信息,此时users作为父组件需使用作用域插槽获的el-table组件中的信息 -->
            <template v-slot:default="{ row }">
              <el-switch v-model="row.mg_state" @change="toggleStatus(row.id, row.mg_state)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" :id="row.id" @click="deleteUser(row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="设置" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" :id="row.id"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
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
      </div>
    </el-card>
    <!-- 弹出添加用户对话框区域 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="resetForm">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" width="60px">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" width="60px">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" width="60px">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" width="60px">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出修改用户对话框区域 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="resetEditUserForm">
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" width="60px">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" width="60px">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" width="60px">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除确认框区域 -->
  </div>
</template>
<script>
export default {
  data() {
    const validateEmail = function(rule, value, callback) {
      const RegEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (RegEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确格式的邮箱'))
    }
    const validateMobile = function(rule, value, callback) {
      const RegMobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (RegMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确格式的手机号'))
    }
    return {
      /* 用户信息列表 */
      userList: [],
      /* 用户列表查询参数 */
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      /* 用户数据总数 */
      total: 0,
      /* 控制添加用户对话框的隐藏显示 */
      dialogVisible: false,
      /* 添加用户表单信息 */
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      /* 添加用户验证规则 */
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '请输入3到15位字符用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6到16位密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      /* 控制编辑用户对话框显示隐藏 */
      editDialogVisible: false,
      /* 编辑用户表单信息 */
      editUserForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      /* 编辑用户验证规则 */
      editUserRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    /* 获取用户列表信息 */
    getUserList: async function() {
      const { data: res } = await this.$http.get('/users', { params: this.queryParams })
      console.log(res)
      if (!res.meta.status === 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userList = res.data.users
      this.pagenum = res.data.pagenum
      this.total = res.data.total
    },
    /* 调整每页数据条数 */
    handleSizeChange: function(val) {
      console.log(`每页${val}条数据`)
      this.queryParams.pagesize = val
      this.getUserList()
    },
    /* 调整当前页 */
    handleCurrentChange: function(val) {
      console.log(`当前是第${val}页`)
      this.queryParams.pagenum = val
      this.getUserList()
    },
    /* 切换用户状态 */
    toggleStatus: async function(id, currentStatus) {
      const { data: res } = await this.$http.put(`/users/${id}/state/${currentStatus}`)
      if (!res.meta.status === 200) {
        /* 如果修改失败，将当前状态取反，返回原来的状态 */
        currentStatus = !currentStatus
        return this.$message.error('切换用户状态失败')
      }
      this.$message.success('切换用户状态成功')
    },
    /* 对话框关闭时重置对话框信息 */
    resetForm: function() {
      this.$refs.addUserFormRef.resetFields()
    },
    /* 点击确定按钮进行登录预验证，验证通过发送axios请求 */
    addUsers: function() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('用户信息验证失败，请完善信息')
        }
        const { data: res } = await this.$http.post('/users', this.addUserForm)
        /* 如果返回状态码不是201,说明添加失败 */
        if (!res.meta.status === 201) {
          return this.$message.error('用户添加失败')
        }
        this.$message.success('用户添加成功')
        /* 重新获取用户列表并渲染到页面中 */
        this.getUserList()
      })
    },
    /* 点击编辑用户按钮，查询当前用户信息显示到编辑文本框中 */
    editUserInfo: async function(id) {
      const { data: res } = await this.$http.get('/users/' + id)
      this.editUserForm.id = id
      this.editUserForm.username = res.data.username
      this.editUserForm.mobile = res.data.mobile
      this.editUserForm.email = res.data.email
      this.editDialogVisible = true
    },
    /* 当编辑对话框关闭时，重置表单内容为初始值 */
    resetEditUserForm: function() {
      this.$refs.editUserFormRef.resetFields()
    },
    /* 当点击编辑对话框确定时，先进行预验证，验证通过发送axios请求 */
    editUser: function() {
      this.$refs.editUserFormRef.validate(async valid => {
        /* valid为true表示预验证通过 */
        if (!valid) {
          return this.$message.info('请输入符合要求的信息')
        }
        const { data: res } = await this.$http.put('/users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (!res.meta.status === 200) {
          return this.$message.error('用户信息更细失败')
        }
        this.$message.success('用户信息更新成功')
        /* 关闭编辑用户对话框 */
        this.editDialogVisible = false
        /* 重新渲染用户列表 */
        this.getUserList()
      })
    },
    /* 点击删除按钮时，弹出对话框 */
    deleteUser: async function(id) {
      /* 确认框返回一个promise对象，通过async await获取返回结果 */
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => {
        return err
      })
      /* 结果确认表示用户点了确定 */
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete('/users/' + id)
        if (!res.meta.status === 200) {
          return this.$message.error('用户删除失败')
        }
        this.$message.success('删除用户成功')
        /* 重新渲染用户列表 */
        this.getUserList()
      }
      if (result === 'cancel') {
        this.$message.info('删除取消')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
