<template>
  <div class="topbar">
    <div
      @click="minimize"
      @mouseover="mini_img_or = mini_ac_img"
      @mouseleave="mini_img_or = mini_img"
      class="mini_btn"
    >
      <img :src="mini_img_or" alt="" />
    </div>
    <div
      @click.stop="closeWindow"
      @mouseover="close_img_or = close_ac_img"
      @mouseleave="close_img_or = close_img"
      class="close_btn"
    >
      <img :src="close_img_or" alt="" />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import close_img from "../../static/images/close.png";
import close_ac_img from "../../static/images/close_ac.png";
import mini_img from "../../static/images/mini.png";
import mini_ac_img from "../../static/images/mini_ac.png";
export default {
  data() {
    return {
      close_img_or: close_img,
      close_img,
      close_ac_img,
      mini_img_or: mini_img,
      mini_img,
      mini_ac_img,
      userName: "",
      userPass: "",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      nickname: "",
      loading: false,
      msg: "",
      show_err: false,
    };
  },
  methods: {
    minimize() {
      ipcRenderer.send("minimize");
    },
    closeWindow() {
      console.log("关闭");
      ipcRenderer.send("closeWindowMain");
    },
  },
};
</script>

<style scoped>
.topbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: right;
  -webkit-app-region: drag;
}
.close_btn {
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  position: absolute;
  right: 0;
  -webkit-app-region: no-drag;
}
.close_btn:hover {
  background-color: red;
}
.close_btn > img {
  width: 20px;
}
.mini_btn {
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  position: absolute;
  right: 40px;
  -webkit-app-region: no-drag;
}
.mini_btn:hover {
  background-color: red;
}
.mini_btn > img {
  width: 20px;
}
</style>