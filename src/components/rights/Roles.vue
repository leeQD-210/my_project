<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        <!-- 表单显示区域 stripe表示斑马条纹显示 -->
        <el-table :data="rolesList" style="width: 100%" border stripe>
          <el-table-column type="expand" label="">
            <template v-slot="{ row }">
              <el-row :class="['vcenter', 'border-bottom', index === 0 ? 'border-top' : '']" v-for="(item1, index) in row.children" :key="item1.id">
                <el-col :span="4" align>
                  <el-tag closable type="primary" effect="dark" @close="deleteRight(row, item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-row :class="['vcenter', 'border-left', index === 0 ? '' : 'border-top']" v-for="(item2, index) in item1.children" :key="item2.id" class="vcenter">
                    <el-col :span="6">
                      <el-tag closable type="success" effect="dark" @close="deleteRight(row, item2.id)">
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="item3 in item2.children" :key="item3.id" closable type="warning" effect="dark" @close="deleteRight(row, item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{ row }">
              <el-tooltip class="item" effect="light" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleInfo(row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="openRightsDialog(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 弹出添加用户对话框区域 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm">
          <el-form :model="addRoleForm" :rules="roleRules" ref="addRoleFormRef" label-width="auto" class="demo-ruleForm">
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="roleDesc">
              <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <!--底部区域-->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 弹出修改用户对话框区域 -->
        <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
          <el-form :model="editRoleForm" :rules="roleRules" ref="editRoleFormRef" label-width="auto" class="demo-ruleForm">
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="editRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="roleDesc">
              <el-input v-model="editRoleForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配权限对话框区域 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @close="resetDefaultId">
          <el-tree :data="rightsTree" show-checkbox node-key="id" :default-expanded-keys="defaultExpandRights" :default-checked-keys="checkedRights" :props="defaultProps" ref="tree"> </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeRoleRights">确 定</el-button>
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
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightsDialogVisible: false,
      /* 添加用户信息 */
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      /* 添加、编辑用户验证规则 */
      roleRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '角色描述信息不能为空', trigger: 'blur' }]
      },
      /* 编辑角色信息 */
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      /* 树形权限数据 */
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      /* 选中的权限 */
      checkedRights: [],
      /* 展开的权限 */
      defaultExpandRights: []
    }
  },
  created() {
    /* 组件被创建时初始化角色列表 */
    this.getRolesList()
  },
  methods: {
    /* 查询角色列表 */
    getRolesList: async function() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status === 200) {
        this.rolesList = res.data
      }
    },
    /* 根据角色id,权限id,删除指定权限 */
    deleteRight(row, rightId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(row.id)
          const { data: res } = await this.$http.delete(`/roles/${row.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('删除角色权限成功')
          /* 删除成功后将返回的最新权限数据赋值给row进行动态渲染 */
          row.children = res.data
        })
        .catch(() => {
          return this.$message.info('用户取消删除')
        })
    },
    /* 添加对话框关闭时重置表单数据 */
    resetAddForm(event) {
      this.$refs.addRoleFormRef.resetFields()
    },
    /* 对话框关闭时重置表单数据 */
    resetEditForm(event) {
      this.$refs.editRoleFormRef.resetFields()
    },
    /* 添加用户之前进行预验证，验证通过执行axios请求 */
    addRoles() {
      this.$refs.addRoleFormRef.validate(async valid => {
        /* valid不存在表示预验证通过 */
        if (!valid) {
          return this.$message.error('请输入正确格式的信息')
        }
        const { data: res } = await this.$http.post('/roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        /* 初始化角色列表 */
        this.getRolesList()
        /* 关闭对话框 */
        this.addDialogVisible = false
      })
    },
    async editRoleInfo(id) {
      /* 根据id查询角色信息，显示到对话框表单中 */
      const { data: res } = await this.$http.get('/roles/' + id)
      if (!res.meta.status === 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editRoleForm.id = id
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      /* 显示编辑对话框 */
      this.editDialogVisible = true
    },
    /* 通过axios修改角色 */
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入正确格式的信息')
        }
        const { data: res } = await this.$http.put('/roles/' + this.editRoleForm.id, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息修改失败')
        }
        console.log(res.meta.status !== 200)
        this.$message.success('用户信息修改成功')
        /* 初始化角色列表 */
        this.getRolesList()
        /* 关闭对话框 */
        this.editDialogVisible = false
      })
    },
    /* 删除角色 */
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('角色删除成功')
          /* 重新渲染角色列表 */
          this.getRolesList()
        })
        .catch(() => {
          return this.$message.info('取消删除角色')
        })
    },
    /* 打开分配权限对话框 */
    async openRightsDialog(row) {
      /* 打开对话框 */
      this.setRightsDialogVisible = true
      /* 发送权限查询请求 */
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsTree = res.data
      const checkedArr = []
      /* 调用递归函数 */
      this.getBottomNode(row, checkedArr)
      /* 默认展开id数组
        这里因为直接使用最底层的id也能达到效果，所以仅做一次递归
      */
      this.defaultExpandRights = checkedArr
      /* 默认选中id数组 */
      this.checkedRights = checkedArr
      /* 角色Id */
      this.editRoleForm.id = row.id
    },
    /* 递归获取最底层节点Id */
    getBottomNode(node, arr) {
      /* 判断是否还包含children属性，如未包含，则表示已是最底层 */
      if (!node.children) {
        return arr.push(node.id)
      }
      /* 创建递归函数 */
      node.children.forEach(item => {
        /* 将上一层遍历的item作为参数重新调用函数 */
        this.getBottomNode(item, arr)
      })
    },
    /* 修改用户权限 */
    async changeRoleRights() {
      /* 使用剩余参数将两个数组合并成一个数组，再转换为字符串 */
      const currentCheckedStr = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()].toString()
      console.log(currentCheckedStr)
      const { data: res } = await this.$http.post(`/roles/${this.editRoleForm.id}/rights`, { rids: currentCheckedStr })
      if (res.meta.status !== 200) {
        return this.$message.error('权限修改失败')
      }
      this.$message.success('权限修改成功')
      /* 关闭对话框 */
      this.setRightsDialogVisible = false
      /* 重新渲染角色信息 */
      this.getRolesList()
    },
    /* 关闭修改权限对话框时清楚储存的默认id */
    resetDefaultId() {
      /* 清空储存的默认选中数组 */
      this.checkedRights = []
      /* 清空默认展开节点数组 */
      this.defaultExpandRights = []
      /* 清空权限节点 */
      this.rightsTree = []
    }
  }
}
</script>
<style lang="less" scoped>
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-left {
  border-left: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
