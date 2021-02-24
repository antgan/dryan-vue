<template>
  <div>
    <div style="text-align: left;">
      <el-button type="text" @click="dialogVisible = true" style="padding: 20px 10px">新增发货记录</el-button>
      <el-tag type="danger">总利润：{{ allProfitPrice }}元</el-tag>
      <el-tag type="danger">总销售：{{ allSalePrice }}元</el-tag>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="serialId" label="流水号" width="100"/>
      <el-table-column prop="itemsStr" label="发货商品" width="300"/>
      <el-table-column prop="profit" label="利润" width="80"/>
      <el-table-column prop="totalSalePrice" label="销售价格" width="80"/>
      <el-table-column prop="totalPurchasePrice" label="入货价格" width="80"/>
      <el-table-column prop="customerName" label="顾客" width="100"/>
      <el-table-column prop="address" label="收货地址" width="100"/>
      <el-table-column prop="logistics" label="物流公司" width="100"/>
      <el-table-column prop="expressNumber" label="物流号" width="100"/>
      <el-table-column prop="expressTime" label="发货时间" width="100"/>
      <el-table-column label="功能" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="updateCustomerInfoClick(scope.row, scope.$index)">
            更新
          </el-button>
          <el-button size="mini" type="danger" @click="deleteSaleRecordClick(scope.row, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100"/>
    </el-table>

    <el-dialog title="新增销售记录" :visible.sync="dialogVisible" width="50%" @closed="addSaleButtonCancel">
      <el-form ref="form" :model="saleRecord" label-width="80px">
        <el-form-item label="顾客姓名">
          <el-input type="text" v-model="saleRecord.customerName" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="顾客地址">
          <el-input type="text" v-model="saleRecord.address" style="width: 100%"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="预设套餐">
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
        <el-form-item label="商品">
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
            <el-button type="success" @click="addSaleItemButtonClick" style="width: 20%">新增</el-button>
          </div>
        </el-form-item>
        <div>
          <div style="">
            <h3>销售商品表</h3>
          </div>
          <br>
          <el-table :data="saleRecord.items">
            <el-table-column property="itemId" label="商品ID" width="150"></el-table-column>
            <el-table-column property="itemName" label="商品名" width="200"></el-table-column>
            <el-table-column property="count" label="数量"></el-table-column>
            <el-table-column property="purchasePrice" label="入货价"></el-table-column>
            <el-table-column label="功能">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="deleteSaleItemButtonClick(scope.row, scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addSaleButtonCancel">取 消</el-button>
            <el-button type="primary" @click="addSaleButtonClick">确 定</el-button>
          </span>
    </el-dialog>

    <el-dialog title="更新发货" :visible.sync="updateCustomerDialogVisible" width="50%"
               @closed="updateCustomerInfoButtonCancel">
      <el-form>
        <el-form-item label="流水号">
          <el-input type="text" disabled="disabled" v-model="updateCustomerInfo.serialId"
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="顾客姓名">
          <el-input type="text" v-model="updateCustomerInfo.customerName" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="顾客地址">
          <el-input type="text" v-model="updateCustomerInfo.address" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-input type="text" v-model="updateCustomerInfo.logistics" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input type="text" v-model="updateCustomerInfo.expressNumber" style="width: 100%"></el-input>
        </el-form-item>
        <br/>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="updateCustomerInfoButtonCancel">取 消</el-button>
            <el-button type="primary" @click="updateCustomerInfoButtonClick">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      //表单
      saleRecord: {
        userId: '',
        items: [],
        customerName: '',
        address: '',
      },
      //表单
      updateCustomerInfo: {
        userId: '',
        serialId: '',
        customerName: '',
        address: '',
        logistics: '',
        expressNumber: '',
      },

      tableData: [],

      dialogVisible: false,
      updateCustomerDialogVisible: false,
      allProfitPrice: 0,
      allSalePrice: 0,

      //商品列表
      itemOptions: [],
      itemMap: new Map(),
      selectValue: '',
      selectValueCount: 0,

      //预设列表
      prePurchaseOptions: [],
      prePurchaseMap: new Map(),
      prePurchaseSelectValue: '',
      prePurchaseSelectValueCount: 0
    }
  }
  ,
  mounted() {
    this.initTable();
    this.initItemDropdownList();
    this.initPrePurchaseList();
  }
  ,
  methods: {
    initTable() {
      this.$axios.post(this.Const.SERVER_URL + `/sale/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            let self = this
            self.allProfitPrice = 0
            self.allSalePrice = 0

            let showData = []
            resp.data.data.forEach(function (sale) {
              let itemsStrList = []
              sale.items.forEach(function (item) {
                itemsStrList.push("[" + item.itemName + "-" + item.count + "-" + item.purchasePrice + "-" + item.salePrice + "]")
              });
              sale.itemsStr = itemsStrList.join(";")
              showData.push(sale)

              self.allProfitPrice += sale["profit"];
              self.allSalePrice += sale["totalSalePrice"];
            });
            this.tableData = showData
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
    addSaleItemButtonClick() {
      this.salePush(this.selectValue, this.itemMap[this.selectValue].name,
        this.selectValueCount, this.calcPurchasePrice(this.itemMap[this.selectValue]));
      this.selectValue = ''
      this.selectValueCount = 0
    },
    calcPurchasePrice(item) {
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
        self.salePush(item.itemId, item.itemName,
          item.count * self.prePurchaseSelectValueCount, self.calcPurchasePrice(self.itemMap[item.itemId]));
      });
      self.prePurchaseSelectValue = ''
      self.prePurchaseSelectValueCount = 0
    },
    salePush(itemId, itemName, count, purchasePrice) {
      if (count <= 0) {
        this.$message.error("数量不允许为0")
        return
      }

      let isContain = false
      let updateIndex = 0

      this.saleRecord.items.forEach(function (item, index) {
        console.log("index", index)
        if (item.itemId == itemId) {
          isContain = true;
          updateIndex = index
          return;
        }
      })

      if (isContain) {
        let tmpObj = this.saleRecord.items[updateIndex]
        tmpObj.count += count
        this.saleRecord.items.splice(updateIndex, 1, tmpObj)
      } else {
        this.saleRecord.items.push({
          itemId: itemId,
          itemName: itemName,
          count: count,
          purchasePrice: purchasePrice
        })
      }
    },
    deleteSaleItemButtonClick(row, index) {
      if (row) {
        this.saleRecord.items.splice(index, 1)
      }
    },
    addSaleButtonClick() {
      let validate = true
      this.saleRecord.items.forEach(function (item){
        if (item.count <= 0) {
          validate = false
        }
      });
      if (!validate) {
        this.$message.error("不允许有数量为0")
        return
      }

      this.saleRecord.userId = this.Const.LOGIN_USER.id
      this.$axios.post(this.Const.SERVER_URL + `/sale/add`, this.saleRecord)
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
    addSaleButtonCancel() {
      this.dialogVisible = false
      this.clearDialogData()
    }
    ,
    clearDialogData() {
      this.saleRecord = {
        userId: '',
        items: [],
        customerName: '',
        address: '',
      };
      this.selectValue = ''
      this.selectValueCount = 0
      this.prePurchaseSelectValue = ''
      this.prePurchaseSelectValueCount = 0
    },

    //更新物流信息
    updateCustomerInfoButtonCancel() {
      this.updateCustomerDialogVisible = false
      this.clearCustomerInfo()
    },
    updateCustomerInfoButtonClick() {
      this.updateCustomerInfo.userId = this.Const.LOGIN_USER.id;
      this.$axios.post(this.Const.SERVER_URL + `/sale/update-customer-info`, this.updateCustomerInfo)
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.$message.success("新增成功！")
            this.updateCustomerDialogVisible = false
            this.clearCustomerInfo()
            this.initTable()
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    updateCustomerInfoClick(row, index) {
      if (row) {
        console.log("row" + row)
        this.updateCustomerInfo.serialId = row.serialId;
        this.updateCustomerInfo.customerName = row.customerName;
        this.updateCustomerInfo.address = row.address;
        this.updateCustomerInfo.logistics = row.logistics;
        this.updateCustomerInfo.expressNumber = row.expressNumber;

        this.updateCustomerDialogVisible = true;
      }
    },
    deleteSaleRecordClick(row, index) {
      if (row) {
        console.log("row" + row)
        this.$axios.post(this.Const.SERVER_URL + `/sale/delete`, {
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
    clearCustomerInfo() {
      this.updateCustomerInfo = {
        userId: '',
        serialId: '',
        customerName: '',
        address: '',
        logistics: '',
        expressNumber: '',
      }
    },
  }
}
</script>

<style>
</style>
