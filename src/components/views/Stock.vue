<template>
  <div>
    <el-tabs v-model="activeName" >
      <el-tab-pane label="库存" name="stockTab">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="itemId" label="商品ID" width="220"/>
          <el-table-column prop="itemName" label="商品名称" width="180"/>
          <el-table-column prop="remainCount" label="剩余库存" width="150"/>
          <el-table-column prop="updateTime" label="更新时间" width="220"/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="偷吃记录" name="selfConsumeTab">
        <div style="text-align: left;">
          <el-button type="text" @click="dialogVisible = true" style="padding: 20px 10px">新增偷吃记录</el-button>
        </div>
        <el-table
          :data="selfConsumeTableData"
          border
          style="width: 100%">
          <el-table-column prop="itemId" label="商品ID" width="220"/>
          <el-table-column prop="itemName" label="商品名称" width="180"/>
          <el-table-column prop="count" label="偷吃数量" width="150"/>
          <el-table-column prop="updateTime" label="更新时间" width="220"/>
        </el-table>

        <el-dialog title="新增偷吃记录" :visible.sync="dialogVisible" width="50%" @closed="addSelfConsumeButtonCancel">
          <el-form ref="form" :model="selfConsume" label-width="80px">
            <el-form-item label="商品名称">
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
                <el-button type="success" @click="addSelfConsumeItemButtonClick" style="width: 20%">新增</el-button>
              </div>
            </el-form-item>

            <div>
              <h3 style="text-align: left">偷吃商品列表</h3>
              <br>
              <el-table :data="selfConsume.items">
                <el-table-column property="itemId" label="商品ID" width="150"></el-table-column>
                <el-table-column property="itemName" label="商品名" width="200"></el-table-column>
                <el-table-column property="count" label="数量"></el-table-column>
                <el-table-column label="功能">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deleteSelfConsumeButtonClick(scope.row, scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addSelfConsumeButtonCancel">取 消</el-button>
            <el-button type="primary" @click="addSelfConsumeButtonClick">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>

export default {
  data() {
    return {
      //表单
      selfConsume: {
        userId: '',
        items: [],
      },

      //商品列表
      itemOptions: [],
      itemNameMap: new Map(),
      selectValue: '',
      selectValueCount: 0,

      dialogVisible: false,
      activeName: 'stockTab',

      tableData: [],
      selfConsumeTableData: []
    }
  },
  mounted() {
    this.initTable();
    this.initSelfConsumeTable();
    this.initItemDropdownList();
  },
  methods: {
    initTable() {
      this.$axios.post(this.Const.SERVER_URL + `/stock/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.tableData = resp.data.data
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    initSelfConsumeTable() {
      this.$axios.post(this.Const.SERVER_URL + `/self-consume/get-all`, {"userId": this.Const.LOGIN_USER.id})
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.selfConsumeTableData = resp.data.data
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
              self.itemNameMap[option.id] = option.name
            });
            console.log(self.itemNameMap)
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    },
    addSelfConsumeItemButtonClick() {
      this.selfConsumePush(this.selectValue,this.itemNameMap[this.selectValue], this.selectValueCount)
    },
    selfConsumePush(itemId, itemName, count) {
      if (count <= 0) {
        this.$message.error("数量不允许为0")
        return
      }

      let isContain = false
      let updateIndex = 0

      this.selfConsume.items.forEach(function (item, index) {
        console.log("index", index)
        if (item.itemId == itemId) {
          isContain = true;
          updateIndex = index
          return;
        }
      })

      if (isContain) {
        let tmpObj = this.selfConsume.items[updateIndex]
        tmpObj.count += count
        this.selfConsume.items.splice(updateIndex, 1, tmpObj)
      } else {
        this.selfConsume.items.push({
          itemId: itemId,
          itemName: itemName,
          count: count,
        })
      }
    },
    deleteSelfConsumeButtonClick(row, index) {
      if (row) {
        this.selfConsume.items.splice(index, 1)
      }
    },

    addSelfConsumeButtonClick() {
      let validate = true
      this.selfConsume.items.forEach(function (item){
        if (item.count <= 0) {
          validate = false
        }
      });
      if (!validate) {
        this.$message.error("不允许有数量为0")
        return
      }

      this.selfConsume.userId = this.Const.LOGIN_USER.id
      this.$axios.post(this.Const.SERVER_URL + `/self-consume/add`, this.selfConsume)
        .then(resp => {
          if (resp.data['code'] == 0) {
            this.$message.success("新增成功！")
            this.dialogVisible = false
            this.clearDialogData();
            this.initTable();
            this.initSelfConsumeTable();
          } else {
            this.$message.error('请求发生错误：' + resp.data.msg)
          }
        });
    }
    ,
    addSelfConsumeButtonCancel() {
      this.dialogVisible = false
      this.clearDialogData()
    }
    ,
    clearDialogData() {
      this.selfConsume = {
        userId: '',
        items: [],
      }
      this.selectValue = ''
      this.selectValueCount = 0
    }
  }
}
</script>
