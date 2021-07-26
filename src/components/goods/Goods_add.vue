<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 提示区 -->
        <el-alert title="添加商品信息" type="info" :closable="false" show-icon center> </el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="stepActiveIndex" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 左侧导航区 -->
        <el-tabs :tab-position="'left'" style="height:auto;" class="tabs" @tab-click="handleTabClick" value="0" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsFormRef" label-width="100px" class="demo-ruleForm">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoodsForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格（元）" prop="goods_price">
                <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <!-- 级联选择器 -->
                <el-cascader
                  v-model="addGoodsForm.goods_cat"
                  :options="goodsCateInfo"
                  :props="cascaderProps"
                  @change="handleCascaderChange"
                  clearable
                  filterable
                  placeholder="请选择分类"
                ></el-cascader>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form ref="addAttrFormRef" label-width="200px" class="goodsPropsForm">
              <el-form-item :label="item.attr_name" v-for="(item, i) in onlyPropsInfo" :key="i">
                <el-checkbox-group v-model="item.checkboxGroup" size="medium">
                  <el-checkbox :label="item2" border v-for="(item2, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form ref="addAttrFormRef" label-width="200px" class="goodsPropsForm">
              <el-form-item :label="item.attr_name" v-for="(item, i) in manyAttrInfo" :key="i">
                <el-checkbox-group v-model="item.checkboxGroup" size="medium">
                  <el-checkbox :label="item2" border v-for="(item2, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" list-type="picture-card" :auto-upload="true" :headers="ImgUpHeader" :on-success="uploadSuccess" ref="picUpload">
              <i slot="default" class="el-icon-plus"></i>
              <template v-slot:file="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <!-- 预览图标 -->
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <!-- 下载 -->
                  <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                    <i class="el-icon-download"></i>
                  </span>
                  <!-- 删除 -->
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </template>
            </el-upload>
            <el-dialog :visible.sync="dialogImageVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" style="margin-top:15px" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    const validateNum = function(rule, val, callback) {
      if (val <= 0) {
        /* 验证失败调用回调抛出错误 */
        callback(new Error('必须是大于0的数值'))
      }
      /* 验证通过调用回调 */
      callback()
    }
    return {
      /* 添加商品表单 */
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      /* 商品分类信息 */
      goodsCateInfo: [],
      /* 级联选择器配置 */
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      /* 判断是动态参数还是静态参数 */
      attr_sel: '',
      /* 参数信息 */
      onlyPropsInfo: [],
      /* 属性信息 */
      manyAttrInfo: [],
      /* step步骤条的活越index */
      stepActiveIndex: 0,
      /* 添加商品表达验证规则 */
      addGoodsRules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '商品分类不能为空', trigger: 'change' }]
      },
      /* 图片路径 */
      dialogImageUrl: '',
      /* 图片对话框显示 */
      dialogImageVisible: false,
      /* 图片上传请求头信息 */
      ImgUpHeader: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    /* 获取商品分类 */
    async getGoodsCate() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return
      this.goodsCateInfo = res.data
    },
    /* 当级联选择器变化时 */
    handleCascaderChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.warning('只能选择三级分类')
        this.addGoodsForm.goods_cat = []
      }
      /* 获取对应的属性参数,当分类参数标识不为空时获取属性 */
      if (this.attr_sel !== '') {
        this.queryGoodsAttr()
      }
    },
    /* 当tab导航点击时 */
    handleTabClick(tab) {
      /* 接受触发点击事件的tab原色 */
      /* 将tab标签对应的Index赋值给步骤条的活越序号 */
      this.stepActiveIndex = parseInt(tab.index)
      /* 如果点击参数标签 */
      if (tab.index === '1') {
        this.attr_sel = 'only'
        if (this.onlyPropsInfo.length === 0) {
          this.queryGoodsAttr()
        }
      }
      if (tab.index === '2') {
        this.attr_sel = 'many'
        if (this.manyAttrInfo.length === 0) {
          this.queryGoodsAttr()
        }
      }
    },
    beforeLeave(activeName, oldName) {
      /* 如果跳转的不是第一项且还未选择分类，阻止跳转tab */
      if (activeName !== '0' && this.addGoodsForm.goods_cat.length === 0) {
        this.$message.error('请先选择三级分类')
        return false
      }
    },
    /* 查询商品属性参数 */
    async queryGoodsAttr() {
      const { data: res } = await this.$http.get(`/categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
        params: {
          sel: this.attr_sel
        }
      })
      if (res.meta.status !== 200) return
      res.data.forEach(item => {
        if (item.attr_vals.length === 0) {
          return (item.attr_vals = [])
        }
        item.attr_vals = item.attr_vals.split(',')
        /* 为每个元素添加checkboxGroup属性，存储被选中的属性数组 */
        item.checkboxGroup = item.attr_vals
      })
      /* 如果是many动态参数 */
      if (this.attr_sel === 'many') {
        this.manyAttrInfo = res.data
      } else {
        this.onlyPropsInfo = res.data
      }
    },
    /* 图片预览触发 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    /* 图片点击删除时触发 */
    handleRemove(file) {
      /* 图片列表里删除当前图片 */
      this.$refs.picUpload.handleRemove(file)
      /* 保存当前文件的临时路径 */
      const filePath = file.response.data.tmp_path
      /* 通过es6findIndex方法查询符合条件的下标 */
      const fileIndex = this.addGoodsForm.pics.findIndex(item => item.pic === filePath)
      console.log(fileIndex)
      /* 删除添加商品表单中存放的路径 */
      this.addGoodsForm.pics.splice(fileIndex, 1)
    },
    /* 图片上传完成时钩子函数 */
    uploadSuccess(response, file, fileList) {
      /* response：当前上传文件的响应结果 */
      /* file：当前上传文件的信息,包含response */
      /* fileList所有上传文件的信息 */
      const imgPathObj = { pic: response.data.tmp_path }
      /* 将上传图片的路径对象添加到添加商品表单Pic数组中 */
      this.addGoodsForm.pics.push(imgPathObj)
    },
    /* 图片点击下载时触发 */
    handleDownload(file) {
      /* 跳转服务器的图片地址 */
      window.open(file.response.data.url)
    },
    /* 添加商品 */
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请按要求填入商品信息')
        }
        /* 将商品分类从数组转化为字符串 */
        if (typeof this.addGoodsForm.goods_cat !== 'string') {
          this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
        }
        /* 处理attrs数组 */
        this.addGoodsAttr(this.manyAttrInfo)
        this.addGoodsAttr(this.onlyPropsInfo)
        /* 发送axios请求 */
        const { data: res } = await this.$http.post('/goods', this.addGoodsForm)
        if (res.meta.status !== 201) {
          /* 添加失败时清空添加表单的属性，防止重复添加 */
          this.addGoodsForm.attrs = []
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('商品添加成功')
        /* 清空表单数据 */
        this.$refs.addGoodsFormRef.resetFields()
        /* 清空分类数据 */
        this.goodsCateInfo = []
        /* 清空属性数据 */
        this.manyAttrInfo = []
        this.onlyPropsInfo = []
        /* 清空图片预览数据 */
        this.$refs.picUpload.clearFiles()
        this.addGoodsForm.pics = []
        /* 清空添加表单中的数据 */
        this.addGoodsForm.attrs = []
        this.addGoodsForm.goods_introduce = ''
        /* 跳转商品列表页面 */
        this.$router.push('/goods')
      })
    },
    /* 添加商品属性函数 */
    addGoodsAttr(arr1) {
      if (arr1.length !== 0) {
        arr1.forEach(item => {
          if (item.checkboxGroup.length !== 0) {
            item.checkboxGroup.forEach(item2 => {
              this.addGoodsForm.attrs.push({ attr_id: item.attr_id, attr_vals: item2 })
            })
          }
        })
      }
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.tabs {
  margin-top: 20px;
}
</style>
