<template>
  <div class="login_body">
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
        @click="closeWindow"
        @mouseover="close_img_or = close_ac_img"
        @mouseleave="close_img_or = close_img"
        class="close_btn"
      >
        <img :src="close_img_or" alt="" />
      </div>
    </div>
    <div class="table_list" v-loading="loading">
      <div>
        <el-input
          class="inps username"
          v-model="userName"
          placeholder="请输入账号"
          @keyup.enter.native="goaccount"
          clearable
          maxlength="10"
        />
        <el-input
          class="inps userpass"
          v-model="userPass"
          placeholder="请输入密码"
          @keyup.enter.native="goaccount"
          show-password
          clearable
          maxlength="16"
        />
        <el-input
          class="inps userpass"
          v-model="userPass_ag"
          placeholder="请再次输入密码"
          @keyup.enter.native="goaccount"
          show-password
          clearable
          maxlength="16"
        />
      </div>
      <div class="account_btn" @click="goaccount">注册</div>
      <div class="login_back"><span @click="login_bk">返回登录</span></div>
    </div>
    <div class="big_block" v-show="show_err" @click="show_err = false">
      <div class="dialog" :style="add_success?'backgroundColor:#32ff95':''">{{ msg }}</div>
    </div>
  </div>
</template>
  
  <script>
const { ipcRenderer } = window.require("electron");
import close_img from "../static/images/close.png";
import close_ac_img from "../static/images/close_ac.png";
import mini_img from "../static/images/mini.png";
import mini_ac_img from "../static/images/mini_ac.png";
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
      userPass_ag: "",
      loading: false,
      msg: "",
      show_err: false,
      add_success: false,
    };
  },
  mounted() {
    ipcRenderer.send("Login");
  },
  methods: {
    goaccount() {
      if (this.userName == "") {
        this.msg = "账号不能为空！";
        this.show_err = true;
        setTimeout(() => {
          this.show_err = false;
        }, 2000);
      } else if (this.userPass == "") {
        this.msg = "密码不能为空！";
        this.show_err = true;
        setTimeout(() => {
          this.show_err = false;
        }, 2000);
      } else if (this.userPass_ag == "") {
        this.msg = "请再次输入密码！";
        this.show_err = true;
        setTimeout(() => {
          this.show_err = false;
        }, 2000);
      } else if (this.userPass !== this.userPass_ag) {
        this.msg = "两次密码输入不一致！";
        this.show_err = true;
        setTimeout(() => {
          this.show_err = false;
        }, 2000);
      } else if (this.userName != "" && this.userPass != "") {
        this.axios({
          // url: "http://150.158.84.153/account.php",
          url:'http://www.test.com:8083/account.php',
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            username: this.userName,
            userpass: this.userPass,
          },
        }).then((res) => {
          if (res.data.code == "200") {
            this.msg = "注册成功";
            this.add_success = true;
            this.show_err = true;
            setTimeout(() => {
              this.show_err = false;
              this.$router.push("/");
            }, 1000);
          } else {
            if (res.data.code == "500") {
              this.msg = "用户名重复，请重新输入！";
              this.show_err = true;
              setTimeout(() => {
                this.show_err = false;
              }, 2000);
            } else if (res.data.code == "501") {
              this.msg = "未知错误，请联系管理员";
              this.show_err = true;
              setTimeout(() => {
                this.show_err = false;
              }, 2000);
            }
          }
        });
      }
    },
    minimize() {
      ipcRenderer.send("minimize");
    },
    closeWindow() {
      ipcRenderer.send("closeWindow");
    },
    login_bk() {
      this.$router.push("/");
    },
  },
};
</script>
  
  <style scoped>
.login_body {
  padding-top: 30px;
}
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
.table_list {
  margin-top: 50px;
}
.inps {
  width: 80%;
  border: none;
  border-bottom: 1px solid #eee;
  height: 36px;
}
.username >>> .el-input__inner,
.userpass >>> .el-input__inner {
  border: none;
}
.username >>> input,
.userpass >>> input {
  border-bottom: 1px solid #eee !important;
}
.userpass {
  margin-top: 5px;
}
.username >>> input:focus,
.userpass >>> input:focus {
  border-bottom: 1px solid #15fe95 !important;
}

.account_btn {
  background-color: #32ff95;
  width: 70%;
  margin: 0 auto;
  cursor: pointer;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
}
.account_btn:hover {
  background-color: #60feac;
}
.big_block {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.374);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  position: absolute;
  min-width: 180px;
  max-width: 220px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fe4c38;
  border-radius: 5px;
  height: 45px;
  color: #fff;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
}
.login_back {
  font-size: 12px;
  color: #1677d2;
  margin-top: 10px;
  cursor: pointer;
}
</style>