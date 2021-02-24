<template>
  <div>
    <div style="text-align: left;">
      <el-button type="text" @click="dialogVisible = true" style="padding: 20px 10px">新增入货记录</el-button>
      <el-tag type="danger">总入货：{{ allPurchasePrice }}元</el-tag>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="serialId" label="流水号" width="250px"/>
      <el-table-column prop="itemsStr" label="入货商品" width="600px"/>
      <el-table-column prop="totalPurchasePrice" label="总入货价" width="100px"/>
      <el-table-column prop="createTime" label="入货时间" width="160px"/>
      <el-table-column label="功能" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="showPurchaseText(scope.row, scope.$index)">
            入货文本
          </el-button>
          <el-button size="mini" type="danger" @click="deletePurchaseRecordClick(scope.row, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增入货记录" :visible.sync="dialogVisible" width="50%" @closed="addPurchaseButtonCancel">
      <el-form ref="form" :model="purchase" label-width="80px">
        <el-form-item label="预设入货">
          <div style="display: inline-flex; width: 100%">
            <el-select v-model="prePurchaseSelectValue" placeholder="请选择" style="width: 60%">
              <el-option
                v-for="item in prePurchaseOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-input type="number" v-model.number="prePurchaseSelectValueCount" style="width: 20%"></el-input>
            <el-button type="success" @click="addPrePurchaseItemButtonClick" style="width: 20%">新增</el-button>
          </div>
        </el-form-item>
        <el-form-item label="入货商品">
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
            <el-button type="success" @click="addPurchaseItemButtonClick" style="width: 20%">新增</el-button>
          </div>
        </el-form-item>

        <div>
          <div style="">
            <h3>预设入货表</h3>
            <el-tag type="danger">共计：{{ totalPurchasePrice }}元</el-tag>
          </div>
          <br>
          <el-table :data="purchase.items">
            <el-table-column property="itemId" label="商品ID" width="150"></el-table-column>
            <el-table-column property="itemName" label="商品名" width="200"></el-table-column>
            <el-table-column property="count" label="数量"></el-table-column>
            <el-table-column property="purchasePrice" label="单价"></el-table-column>
            <el-table-column property="remainCount" label="库存"></el-table-column>
            <el-table-column label="功能">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="deletePurchaseItemButtonClick(scope.row, scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addPurchaseButtonCancel">取 消</el-button>
            <el-button type="primary" @click="addPurchaseButtonClick">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      //表单
      purchase: {
        userId: '',
        items: [],
      },
      tableData: [],

      dialogVisible: false,
      totalPurchasePrice: 0,
      allPurchasePrice: 0,

      //商品列表
      itemOptions: [],
      itemMap: new Map(),
      selectValue: '',
      selectValueCount: 0,

      //预设列表
      prePurchaseOptions: [],
      prePurchaseMap: new Map(),
      prePurchaseSelectValue: '',
      prePurchaseSelectValueCount: 0,

      //库存map
      stockMap: new Map(),
    }
  }
  ,
  mounted() {
    this.initTable();
    this.initStockMap();
    this.initItemDropdownList();
    this.initPrePurchaseList();
  }
  ,
  methods: {
    initTable() {
      this.$axios.post(this.Const.SERVER_URL + `/purchase/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let self = this
            self.allPurchasePrice = 0

            let showData = []
            resp.data.data.forEach(function (purchase) {
              let itemsStrList = []
              purchase.items.forEach(function (item) {
                itemsStrList.push("[" + item.itemName + "-" + item.count + "-" + item.purchasePrice + "]")
              });
              purchase.itemsStr = itemsStrList.join(";")
              showData.push(purchase)

              self.allPurchasePrice += purchase.totalPurchasePrice
            });
            this.tableData = showData
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    initStockMap() {
      this.$axios.post(this.Const.SERVER_URL + `/stock/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let self = this
            self.stockMap = new Map();
            resp.data.data.forEach(function (stock) {
              self.stockMap[stock.itemId] = stock
            })
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
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
              self.itemMap[option.id] = option
            });
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    initPrePurchaseList() {
      this.$axios.post(this.Const.SERVER_URL + `/pre-purchase/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let self = this
            self.prePurchaseOptions = resp.data.data
            self.prePurchaseOptions.forEach(function (option) {
              self.prePurchaseMap[option.name] = option.items
            });
            console.log(self.prePurchaseMap)
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    addPurchaseItemButtonClick() {
      this.purchasePush(this.selectValue, this.itemMap[this.selectValue].name,
        this.selectValueCount, this.calcPurchasePrice(this.itemMap[this.selectValue]));
      this.selectValue = ''
      this.selectValueCount = 0
    },
    calcPurchasePrice(item) {
      console.log("ii" + item.officialPrice)
      if (this.Const.LOGIN_USER.type == "director") {
        return item["directorPrice"]
      } else if (this.Const.LOGIN_USER.type == "official") {
        return item["officialPrice"]
      } else {
        return item["salePrice"]
      }
    },
    //批量新增预设中的数量
    addPrePurchaseItemButtonClick() {
      let readyItems = this.prePurchaseMap[this.prePurchaseSelectValue]
      let self = this
      readyItems.forEach(function (item) {
        self.purchasePush(item.itemId, item.itemName,
          item.count * self.prePurchaseSelectValueCount, self.calcPurchasePrice(self.itemMap[item.itemId]));
      });
      this.prePurchaseSelectValue = ''
      this.prePurchaseSelectValueCount = 0
    },
    purchasePush(itemId, itemName, count, purchasePrice) {
      if (count <= 0) {
        this.$message.error("数量不允许为0")
        return
      }

      let isContain = false
      let updateIndex = 0

      this.purchase.items.forEach(function (item, index) {
        console.log("index", index)
        if (item.itemId == itemId) {
          isContain = true;
          updateIndex = index
          return;
        }
      })

      if (isContain) {
        let tmpObj = this.purchase.items[updateIndex]
        tmpObj.count += count
        this.purchase.items.splice(updateIndex, 1, tmpObj)
      } else {
        this.purchase.items.push({
          itemId: itemId,
          itemName: itemName,
          count: count,
          purchasePrice: purchasePrice,
          remainCount: this.stockMap[itemId] ? this.stockMap[itemId].remainCount : 0
        })
      }
      this.totalPurchasePrice += purchasePrice * count;
      this.stockMap[itemId].remainCount += count;
    },
    deletePurchaseItemButtonClick(row, index) {
      if (row) {
        this.purchase.items.splice(index, 1)
      }
    },
    showPurchaseText(row, index) {
      if (row) {
        let numList = []
        let text = ""
        text += "补货共计：" + row.totalPurchasePrice + "元。<br/>"
        this.tableData[index].items.forEach(function (item) {
          let num = (item.purchasePrice * item.count)
          text += item.count + "个" + item.itemName + "*" + item.purchasePrice + "=" + num + "<br/>"
          numList.push(num)
        })
        text += "</br>合计：" + numList.join("+") + "=" + row.totalPurchasePrice + "元<br/>"

        console.log(text)

        this.$message({
          duration: 0,
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: text,
          type: 'success'
        });
      }
    },
    deletePurchaseRecordClick(row, index) {
      if (row) {
        console.log("row" + row)
        this.$axios.post(this.Const.SERVER_URL + `/purchase/delete`, {
          "serialId": row.serialId,
          "userId": this.Const.LOGIN_USER.id
        }).then(resp => {
          if (resp.data['code'] == 0) {
            this.$message.success("删除成功！")
            this.initTable()
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });

      }
    },
    addPurchaseButtonClick() {
      let validate = true
      this.purchase.items.forEach(function (item) {
        if (item.count <= 0) {
          validate = false
        }
      });
      if (!validate) {
        this.$message.error("不允许有数量为0")
        return
      }

      this.purchase.userId = this.Const.LOGIN_USER.id
      this.$axios.post(this.Const.SERVER_URL + `/purchase/add`, this.purchase)
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
    addPurchaseButtonCancel() {
      this.dialogVisible = false
      this.clearDialogData()
    }
    ,
    clearDialogData() {
      this.purchase = {
        userId: '',
        items: [],
      }
      this.selectValue = ''
      this.selectValueCount = 0
      this.prePurchaseSelectValue = ''
      this.prePurchaseSelectValueCount = 0
      this.totalPurchasePrice = 0
    }
  }
}
</script>

<style>
</style>
