<template>
  <!-- <div @click="back_pg">mainpage</div> -->
  <el-container>
    <el-aside class="el_aside" width="300px">
      <a_side />
    </el-aside>
    <el-container>
      <el-header class="el_header"> <drag /> </el-header>

      <el-main class="el_main"> <messagebody /> </el-main>
    </el-container>
  </el-container>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import drag from "../components/drag";
import a_side from "../components/aside";
import messagebody from "../components/messagebody";
export default {
  components: { drag, a_side, messagebody },
  data() {
    return {};
  },
  mounted() {
    ipcRenderer.send("LoginSuccess");
  },
  methods: {
    back_pg() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.el_header {
  position: relative;
  height: 30px !important;
}

.el_aside {
  height: 100%;
  min-height: 100vh;
}
.el_main {
  width: 100%;
  padding: 0;
  margin: 0;
  height: 1px;
  /* border-top: 1px solid #d6d6d6; */
}
</style>