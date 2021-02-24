<template>
  <div>
    <el-container>
      <el-header>
        <my-menu v-on:UpdateMenuIndex="changeRouter"></my-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import MyMenu from "./Menu";
export default {
  components: {MyMenu},
  data() {
    return {
      activeIndex: "stock"
    }
  },
  methods: {
    changeRouter(key){
      this.$router.push(key)

    }
  }
}
</script>
