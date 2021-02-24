<template>
  <div>
    <div style="text-align: left;">
      <el-button type="text" @click="dialogVisible = true" style="padding: 20px 10px">新增预设</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="name" label="预设名称" width="200"/>
      <el-table-column prop="itemsStr" label="产品列表" width="1000"/>
    </el-table>

    <el-dialog title="新增预设" :visible.sync="dialogVisible" width="50%" @closed="addPrePurchaseButtonCancel">
      <el-form ref="form" :model="prePurchase" label-width="80px">
        <el-form-item label="预设名称">
          <el-input v-model="prePurchase.name"></el-input>
        </el-form-item>
        <el-form-item label="预设商品">
          <div style="display: inline-flex; width: 100%">
            <el-select v-model="selectValue" placeholder="请选择" style="width: 60%">
              <el-option
                v-for="item in itemOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-input type="number" v-model.number="selectValueCount" style="width: 20%"></el-input>
            <el-button type="success" @click="addPrePurchaseItemButtonClick" style="width: 20%">新增</el-button>
          </div>
        </el-form-item>

        <div>
          <h3 style="text-align: left">预设入货表</h3>
          <br>
          <el-table :data="prePurchase.items">
            <el-table-column property="itemId" label="商品ID" width="150"></el-table-column>
            <el-table-column property="itemName" label="商品名" width="200"></el-table-column>
            <el-table-column property="count" label="数量"></el-table-column>
            <el-table-column label="功能">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="deletePrePurchaseItemButtonClick(scope.row, scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addPrePurchaseButtonCancel">取 消</el-button>
            <el-button type="primary" @click="addPrePurchaseButtonClick">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      //表单
      prePurchase: {
        userId: '',
        name: '',
        items: [],
      },
      tableData: [],

      dialogVisible: false,

      //商品列表
      itemOptions: [],
      itemNameMap: new Map(),
      selectValue: '',
      selectValueCount: 0,
    }
  }
  ,
  mounted() {
    this.initTable();
    this.initItemDropdownList();
  }
  ,
  methods: {
    initTable() {
      this.$axios.post(this.Const.SERVER_URL + `/pre-purchase/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let showData = []
            resp.data.data.forEach(function (prePurchase) {
              let itemsStrList = []
              prePurchase.items.forEach(function (item) {
                itemsStrList.push("[" + item.itemName + "-" + item.count + "]")
              });
              prePurchase.itemsStr = itemsStrList.join(";")
              showData.push(prePurchase)
            });
            this.tableData = showData
          } else {
            this.$message.error('请求发生错误：' + resp.data)
          }
        });
    },
    initItemDropdownList() {
      this.$axios.post(this.Const.SERVER_URL + `/item/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let self = this
            self.itemOptions = resp.data.data
            self.itemOptions.forEach(function (option) {
              self.itemNameMap[option.id] = option.name
            });
            console.log(self.itemNameMap)
          } else {
            this.$message.error('请求发生错误：' + resp.data)
          }
        });
    },
    addPrePurchaseItemButtonClick() {
      this.prePurchasePush(this.selectValue, this.itemNameMap[this.selectValue], this.selectValueCount)
      this.selectValue = ''
      this.selectValueCount = 0
    },
    prePurchasePush(itemId, itemName, count) {
      if (count <= 0) {
        this.$message.error("数量不允许为0")
        return
      }

      let isContain = false
      let updateIndex = 0

      this.prePurchase.items.forEach(function (item, index) {
        console.log("index", index)
        if (item.itemId == itemId) {
          isContain = true;
          updateIndex = index
          return;
        }
      })

      if (isContain) {
        let tmpObj = this.prePurchase.items[updateIndex]
        tmpObj.count += count
        this.prePurchase.items.splice(updateIndex, 1, tmpObj)
      } else {
        this.prePurchase.items.push({
          itemId: itemId,
          itemName: itemName,
          count: count,
        })
      }
    },
    deletePrePurchaseItemButtonClick(row, index) {
      if (row) {
        this.prePurchase.items.splice(index, 1)
      }
    },

    addPrePurchaseButtonClick() {
      this.prePurchase.userId = this.Const.LOGIN_USER.id

      let validate = true
      this.prePurchase.items.forEach(function (item){
        if (item.count <= 0) {
          validate = false
        }
      });
      if (!validate) {
        this.$message.error("不允许有数量为0")
        return
      }

      this.$axios.post(this.Const.SERVER_URL + `/pre-purchase/add`, this.prePurchase)
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
    }
    ,
    addPrePurchaseButtonCancel() {
      this.dialogVisible = false
      this.clearDialogData()
    }
    ,
    clearDialogData() {
      this.prePurchase = {
        userId: '',
        name: '',
        items: [],
      }
      this.selectValue = ''
      this.selectValueCount = 0
    }
  }
}
</script>

<style>
</style>
