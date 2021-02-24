<template>
  <div>
    <div style="text-align: left;">
      <el-button type="text" @click="dialogVisible = true" style="padding: 20px 10px">新增商品</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="id" label="ID" width="220"/>
      <el-table-column prop="name" label="名称" width="180"/>
      <el-table-column prop="salePrice" label="零售价" width="150"/>
      <el-table-column prop="discountPrice1" label="优惠价1" width="150"/>
      <el-table-column prop="discountPrice2" label="优惠价2" width="150"/>
      <el-table-column prop="officialPrice" label="官方价" width="150"/>
      <el-table-column prop="directorPrice" label="董事价" width="150"/>
      <el-table-column prop="createTime" label="创建时间" width="220"/>
    </el-table>

    <el-dialog title="新增商品" :visible.sync="dialogVisible" width="50%" @closed="addItemButtonCancel">
      <el-form ref="form" :model="itemInfo" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="itemInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="salePrice">
          <el-input type='number' v-model.number="itemInfo.salePrice"></el-input>
        </el-form-item>
        <el-form-item label="优惠价1" prop="discountPrice1">
          <el-input type='number' v-model.number="itemInfo.discountPrice1"></el-input>
        </el-form-item>
        <el-form-item label="优惠价2" prop="discountPrice2">
          <el-input type='number' v-model.number="itemInfo.discountPrice2"></el-input>
        </el-form-item>
        <el-form-item label="官方价" prop="officialPrice">
          <el-input type='number' v-model.number="itemInfo.officialPrice"></el-input>
        </el-form-item>
        <el-form-item label="董事价" prop="directorPrice">
          <el-input type='number' v-model.number="itemInfo.directorPrice"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addItemButtonCancel">取 消</el-button>
            <el-button type="primary" @click="addItemButtonClick">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      itemInfo: {
        name: '',
        salePrice: 0,
        discountPrice1: 0,
        discountPrice2: 0,
        officialPrice: 0,
        directorPrice: 0,
      },
      dialogVisible: false,
      tableData: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        salePrice: [{ required: true, message: '请输入正整数', trigger: 'blur', pattern: /^[0-9]*[1-9][0-9]*$/}],
        discountPrice1: [{ required: true, message: '请输入正整数', trigger: 'blur', pattern: /^[0-9]*[1-9][0-9]*$/}],
        discountPrice2: [{ required: true, message: '请输入正整数', trigger: 'blur', pattern: /^[0-9]*[1-9][0-9]*$/}],
        officialPrice: [{ required: true, message: '请输入正整数', trigger: 'blur', pattern: /^[0-9]*[1-9][0-9]*$/}],
        directorPrice: [{ required: true, message: '请输入正整数', trigger: 'blur', pattern: /^[0-9]*[1-9][0-9]*$/}],
      }
    }
  },
  mounted() {
    this.initTable();
  },
  methods: {
    initTable() {
      this.$axios.post(this.Const.SERVER_URL + `/item/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.tableData = resp.data.data
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    addItemButtonClick() {
      this.$axios.post(this.Const.SERVER_URL + `/item/add`, this.itemInfo)
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.$message.success("新增成功！")
            this.dialogVisible = false
            this.clearDialogData()
            this.initTable()
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    addItemButtonCancel() {
      this.dialogVisible = false
      this.clearDialogData()
    },
    clearDialogData() {
      this.itemInfo = {
        name: '',
        salePrice: 0,
        discountPrice1: 0,
        discountPrice2: 0,
        officialPrice: 0,
        directorPrice: 0,
      }
    }
  }
}
</script>
