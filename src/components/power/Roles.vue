<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showrole(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色区域 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="70px">
        <el-form-item label="ID" prop="roleId">
          <el-input v-model="addRoleForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addRoleVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色区域 -->
    <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleClosed">
      <el-form :model="editRole" :rules="addRoleRules" ref="editRoleRef" label-width="70px">
        <el-form-item label="Id">
          <el-input v-model="editRole.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolelist: [],
      addRoleVisible: false,
      // 添加角色
      addRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证
      addRoleRules: {
        roleId: [
          { required: true, message: '请输入ID', trigger: 'blur' },
          { min: 1, max: 5, message: 'ID的长度在1~5个字符', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '名称的长度在1~10个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 1, max: 15, message: '描述的长度在1~15个字符', trigger: 'blur' }
        ]
      },
      // 修改角色
      editRole: {},
      editRoleVisible: false
    }
  },
  created() {
    // 获取角色列表
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.$http.get('roles').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取失败')
        }
        this.rolelist = res.data
      })
    },
    // 监听添加用户对话框的关闭事件
    addRoleClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(valid => {
        if (!valid) return
        this.$http.post('roles', this.addRoleForm).then(({ data: res }) => {
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败！')
            return
          }
          this.$message.success('添加角色成功！')
          // 隐藏添加用户的对话框
          this.addRoleVisible = false
          // 重新获取用户列表
          this.getRoleList()
        })
      })
    },
    // 展示角色信息
    showrole(id) {
      this.$http.get('roles/' + id).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editRole = res.data
        console.log(this.editRole)
        this.editRoleVisible = true
      })
    },
    editRoleClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    // 编辑角色信息
    editRoleInfo() {
      this.$refs.editRoleRef.validate(valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        this.$http.put('roles/' + this.editRole.roleId, { roleName: this.editRole.roleName, roleDesc: this.editRole.roleDesc }).then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error('修改用户信息失败！')
            return
          }
          this.$message.success('修改用户信息成功！')
          // 隐藏对话框
          this.editRoleVisible = false
          // 重新获取用户列表
          this.getRoleList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
