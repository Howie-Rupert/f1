<template>
  <div class="aside">
    <div class="userinfo" @click="openmyview">
      <div class="block">
        <el-avatar
          shape="square"
          :size="50"
          :src="userinfo.usericon"
        ></el-avatar>
      </div>
      <div class="text_box">
        <div class="nickname">{{ userinfo.nickname }}</div>
        <div class="user_sign">{{ userinfo.slog }}</div>
      </div>
    </div>
    <div class="btn_content">
      <div class="btn" @click="show_list = 0">
        <img :src="show_list == 0 ? ml_l_img : ml_img" alt="" />
      </div>
      <div class="btn" @click="show_list = 1">
        <img :src="show_list == 1 ? fl_l_img : fl_img" alt="" />
      </div>
    </div>
    <div class="content">
      <Message v-if="show_list == 0" />
      <Friend v-if="show_list == 1" />
    </div>
    <div class="search">
      <img
        @click="logout"
        class="add_fri"
        src="../../static/images/logout.png"
        alt=""
      />
      <img
        @click="openFri"
        class="add_fri"
        src="../../static/images/add_fri.png"
        alt=""
      />
      <img
        class="add_fri"
        @click="showAddmenu = !showAddmenu"
        src="../../static/images/menu.png"
        alt=""
      />
      <div class="addmenu" v-if="showAddmenu">
        <div class="addtexts" @click="goutogroup">创建群组</div>
        <div class="addtexts" @click="openShenqing">好友申请</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import img1 from "../../static/images/userimg.png";
import ml_img from "../../static/images/message.png";
import ml_l_img from "../../static/images/message_l.png";
import fl_img from "../../static/images/friendlist.png";
import fl_l_img from "../../static/images/friendlist_l.png";
import Message from "../messagelist";
import Friend from "../friendlist";
import { mapGetters } from "vuex";
import { ipcRenderer, ipcMain } from "electron";
export default {
  data() {
    return {
      messagelist: [],
      userlist: [],
      userid: "",
      img1,
      show_list: 0,
      ml_img,
      ml_l_img,
      fl_img,
      fl_l_img,
      userinfo: "",
      time: "",
      otheruser: "",
      showAddmenu: false,
    };
  },
  components: { Message, Friend },
  mounted() {
    this.userid = this.$store.state.userid;
    // this.userid = 16;
    this.getthisUserinfo(this.userid);
    this.time = setInterval(() => {
      this.haschange = localStorage.getItem("haschange");
      if (this.haschange == 1) {
        this.getthisUserinfo(this.userid);
        localStorage.setItem("haschange", 0);
      }
    }, 200);
    ipcRenderer.on("message", (event, userinfo) => {
      // 执行相关操作
      this.getthisUserinfo(this.userid);
    });
  },
  beforeDestroy() {
    clearInterval(this.time);
  },
  computed: {
    ...mapGetters(["contectuser"]),
    otherUserId() {
      return this.contectuser;
    },
  },
  watch: {
    otherUserId(newData, oldData) {
      this.otheruser = newData;
      if (newData != oldData) {
        this.show_list = 0;
      }
    },
  },
  methods: {
    getthisUserinfo(id) {
      axios({
        url: this.baseUrl + "getUserinfo.php",
        method: "get",
        params: {
          userid: id,
        },
      }).then((res) => {
        console.log(res);
        this.userinfo = res.data.data[0];
        console.log("userinfo", this.userinfo);
      });
    },
    getmessagelist() {
      var userid = window.localStorage.getItem("userid");
      axios({
        url: this.baseUrl + "message.php",
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          userid,
        },
      }).then((res) => {
        console.log("消息列表", res);
        res.data.data.forEach((item) => {
          if (item.from_userid != userid) {
            axios({
              url: this.baseUrl + "search.php",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              method: "post",
              data: {
                userid: item.from_userid,
              },
            }).then((res_i) => {
              item.usericon = res_i.data.data[0].usericon;
              item.nickname = res_i.data.data[0].nickname;
            });
          } else if (item.to_userid != userid) {
            axios({
              url: this.baseUrl + "search.php",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              method: "post",
              data: {
                userid: item.to_userid,
              },
            }).then((res_i) => {
              item.usericon = res_i.data.data[0].usericon;
              item.nickname = res_i.data.data[0].nickname;
            });
          }
        });
        this.messagelist = res.data.data;
        console.log(this.messagelist);
      });
    },
    openFri() {
      ipcRenderer.send("addfriend", this.$store.state.userid);
    },
    openShenqing() {
      this.showAddmenu = false;

      ipcRenderer.send("shenqing", this.$store.state.userid);
    },
    goutogroup() {
      this.showAddmenu = false;
      ipcRenderer.send("groupAdd", this.$store.state.userid);
    },
    logout() {
      this.$store.commit("SET_USERID", "");
      this.$store.commit("SET_TOUSER", "");
      this.$store.commit("SET_MESSAGE", "");
      localStorage.clear();
      this.$router.push("/");
    },
    openmyview() {
      ipcRenderer.send("myinfo", this.$store.state.userid);
    },
  },
};
</script>

<style scoped>
.aside {
  width: calc(100% - 1px);
  height: 100vh;
  border-right: 1px solid #eee;
  position: relative;
}
.content {
  height: calc(100% - 150px);
  display: flex;
  overflow: auto;
  flex-direction: column;
}
/deep/.content::-webkit-scrollbar {
  width: 10px;
}
/deep/.content::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d2d2d2;
}
/deep/.content::-webkit-scrollbar-button {
  width: 10px;
  border-radius: 50%;
  background: black;
  display: none;
}
.messages_item {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 10px;
}
.texts {
  width: 60%;
  margin-left: 10px;
  padding-top: 2.6px;
}
.texts > * {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}
.userinfo {
  width: calc(100% -40px);
  height: 50px;
  display: flex;
  padding: 10px 20px 10px 20px;
  /* padding: 20px; */
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.text_box {
  margin-left: 10px;
  text-align: left;
  padding-top: 5px;
}
.user_sign {
  font-size: 12px;
  margin-top: 5px;
  color: #b8b7b7;
  overflow: hidden;
  text-overflow: ellipsis;
}
.userimg {
  width: 64px;
  height: 64px;
}
.btn_content {
  width: 100%;
  display: flex;
}
.btn {
  width: 50%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.btn > img {
  width: 30px;
}
.search {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #d6d6d6;
  border-top: 1px solid #d6d6d6;
  position: absolute;
  bottom: 0px;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
}
.add_fri {
  width: 30px;
  height: 30px;
  margin-left: 20px;
  cursor: pointer;
}
.addmenu {
  position: fixed;
  width: 100px;
  height: 40px;
  border: 1px solid #f5f5f5;
  bottom: 42px;
  left: 110px;
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  align-items: center;
}
.addtexts {
  font-size: 12px;
  height: 20px;
  display: flex;
  width: calc(100% - 10px);
  align-items: center;
  padding-left: 10px;
  cursor: pointer;
}
.addtexts:first-child {
  border-bottom: 1px solid #f5f5f5;
}
.nickname{
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>