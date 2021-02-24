<template>
  <div>
    <span class="user_area">用户：{{this.Const.LOGIN_USER.name}} ｜ 身份：{{this.Const.LOGIN_USER.type}}</span>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="stock">库存管理</el-menu-item>
      <el-menu-item index="saleRecord">发货管理</el-menu-item>
      <el-menu-item index="purchaseRecord">入货管理</el-menu-item>
      <el-menu-item index="prePurchase">入货预设</el-menu-item>
      <el-menu-item index="item">商品管理</el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "my-menu",
  props: {
    activeIndex: {
      type: String
    }
  },
  data() {
    return {};
  },
  mounted() {
    if (!this.Const.LOGIN_USER.id) {
      this.$router.replace("/login")
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key)
      this.$emit("UpdateMenuIndex", key)
    }
  }
}
</script>

<style scoped>
.user_area{
  position: absolute;
  height: 60px;
  line-height:60px;
  padding: 0 50px;
  text-align: center;
  right: 30px;
  z-index:99;
}
</style>
