<template>
  <div class="messagebody">
    <div class="search"></div>
    <div
      class="list_content"
      v-for="(item, index) in newlists"
      :key="index"
      @click="chooseuser(item)"
      @contextmenu.prevent="contextMenu($event, item.id)"
    >
      <img class="message_icon" :src="item.usericon" alt="" />
      <div class="name_message">
        <div class="nicknamebox">
          {{ item.nickname }}
        </div>
        <div class="message">
          <!-- {{ item.from_userid != 16 ? item.nickname : "" }} -->
          {{
            item.message_type == "1"
              ? item.message
              : item.message_type == "2"
              ? "[图片]"
              : item.message_type == "3"
              ? "[视频]"
              : item.message_type == "4"
              ? "[文件]"
              : ""
          }}
        </div>
      </div>
      <div class="time_read">
        <div class="sendtime">
          {{
            item.messageTime.indexOf(":") != -1 ||
            item.messageTime.indexOf("-") != -1
              ? item.messageTime
              : ""
          }}
        </div>
        <div
          class="isread"
          v-if="item.isread == 0 && item.from_userid != $store.state.userid"
        ></div>
        <!-- <div
          class="isread"
          v-if="item.isread == 0 && item.from_userid != 16"
        ></div> -->
      </div>
    </div>
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @deleteData="deleteData"
    ></vue-context-menu>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      contextMenuData: {
        menuName: "rightMenu",
        axis: {
          x: null,
          y: null,
        },
        menulists: [
          {
            fnHandler: "deleteData",
            btnName: "从会话列表移除",
          },
        ],
      },
      messagelist: [],
      firstList: [],
      myfirst: [],
      otherfirst: [],
      userlist: [],
      newlists: "",
      wsUrl: "ws://127.0.0.1:1234", // ws地址
      websock: null, // ws实例
      message: "",
      haveMessage: false,
    };
  },
  watch: {
    "$store.state.haveMessage"(newData, oldData) {
      console.log(newData);
      this.haveMessage = newData;
      console.log("vuex中的msg变化了", newData);
      this.getlist().then((res) => {
        this.editdata(res);
      });
    },
  },
  mounted() {
    this.getlist().then((res) => {
      this.editdata(res);
    });
  },
  methods: {
    deleteData() {
      var message_id = localStorage.getItem("closemessageId");
      var user_id = this.$store.state.userid;
      axios({
        url: this.baseUrl + "closemessage.php",
        method: "get",
        params: {
          user_id,
          message_id,
        },
      }).then((response) => {
        this.getlist().then((res) => {
          this.editdata(res);
        });
      });
    },
    contextMenu(e, data) {
      let x = e.clientX;
      let y = e.clientY;
      this.contextMenuData.axis = { x, y };
      localStorage.setItem("closemessageId", data);
    },
    editdata(res) {
      var that = this;
      that.userlist = res;
      var id = this.$store.state.userid;
      console.log(that.firstList);
      // var id = 16;
      console.log("editdata", res);
      res.forEach((item) => {
        that.firstList.forEach((ite) => {
          if (ite.to_userid == 0 && item.id == ite.groupId) {
            ite.nickname = item.groupName;
            console.log("群头像", item.groupicon);
            ite.usericon = item.groupicon;
          } else {
            if (item.id == ite.from_userid && id == ite.to_userid) {
              ite.nickname = item.nickname;
              ite.usericon = item.usericon;
            }
            if (item.id == ite.to_userid && id == ite.from_userid) {
              ite.nickname = item.nickname;
              ite.usericon = item.usericon;
            }
          }
        });
      });
      that.firstList.forEach((item) => {
        if (this.haveMessage == false) {
          if (
            item.messageTime.indexOf("-") == -1 &&
            item.messageTime.indexOf(":") == -1
          ) {
            var date = new Date(Number(item.messageTime) * 1000);
            var Y = date.getFullYear();
            var M = date.getMonth() + 1;
            var D = date.getDate();
            var newdate = new Date();
            var tY = newdate.getFullYear();
            var tM = newdate.getMonth() + 1;
            var tD = newdate.getDate();
            if (Y == tY && M == tM && D == tD) {
              var H =
                date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
              var m =
                date.getMinutes() >= 10
                  ? date.getMinutes()
                  : "0" + date.getMinutes();
              item.messageTime = H + ":" + m;
            } else {
              item.messageTime = Y + "-" + M + "-" + D;
            }
          }
        }
      });
      console.log("加入头像昵称", that.firstList);
      this.$store.commit("SET_MESSAGE", false);
      var lllarr = that.firstList;
      that.firstList.forEach((item, index) => {
        if (item.closeby != null) {
          if (item.closeby.indexOf(id) != -1) {
            console.log("已经关闭", item);
            lllarr[index] = null;
          }
        }
      });
      for (let i = 0; i < lllarr.length; i++) {
        if (lllarr[i] == null) {
          lllarr.splice(i, 1);
          i--;
        }
      }
      that.firstList = lllarr;
      console.log("删除后", that.firstList);
      this.newlists = this.firstList;
    },
    getlist() {
      var id = this.$store.state.userid;
      // var id = 16;
      return new Promise((resolve, rehect) => {
        axios({
          url: this.baseUrl + "message.php",
          method: "get",
          params: {
            userid: id,
          },
        }).then((res) => {
          console.log("消息列表", res);
          if (res.data.code == 200) {
            var lists = [];
            var arr = [];
            this.firstList = res.data.data;
            res.data.data.forEach((item) => {
              if (item.groupId == null) {
                lists.push(item.from_userid);
                lists.push(item.to_userid);
              } else {
                console.log("有群", item.groupId);
                axios({
                  url: this.baseUrl + "groupList.php",
                  method: "get",
                  params: {
                    groupId: item.groupId,
                  },
                }).then((ress) => {
                  if (ress.code != 200) {
                    console.log("群组列表", ress.data.data[0]);
                    arr.push(ress.data.data[0]);
                  }
                });
              }
            });
            lists = new Set(lists);
            console.log(lists);

            var leng = lists.size - 1;
            var len = 0;
            if (leng > 0) {
              lists.forEach((item) => {
                if (item != id) {
                  axios({
                    url: this.baseUrl + "getUserinfo.php",
                    method: "get",
                    params: {
                      userid: item,
                    },
                  }).then((ress) => {
                    if (ress.code != 200) {
                      arr.push(ress.data.data[0]);
                      len = len + 1;
                      console.log(len);
                      if (len == leng) {
                        console.log("promise返回", arr);
                        setTimeout(() => {
                          resolve(arr);
                        }, 2000);
                      }
                    }
                  });
                }
              });
            } else {
              setTimeout(() => {
                resolve(arr);
              }, 2000);
            }
          }
        });
      });
    },
    chooseuser(item) {
      console.log(item);
      axios({
        url: this.baseUrl + "updateMessage.php",
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          id: item.id,
        },
      }).then((r) => {
        this.getlist().then((res) => {
          this.editdata(res);
        });
      });
      if (item.to_userid == 0) {
        var sendData = "!!!" + item.groupId;
        this.$store.commit("SET_TOUSER", sendData);
      } else {
        if (item.from_userid != this.$store.state.userid) {
          // if (item.from_userid != 16) {
          this.$store.commit("SET_TOUSER", item.from_userid);
        } else if (item.to_userid != this.$store.state.userid) {
          // } else if (item.to_userid != 16) {
          this.$store.commit("SET_TOUSER", item.to_userid);
        }
      }
      console.log(this.$store.state.contectuser);
    },
  },
};
</script>

<style scoped>
.messagebody {
  width: 100%;
  height: 100%;
}
.list_content {
  display: flex;
  position: relative;
  padding: 10px;
  cursor: pointer;
}
.name_message {
  margin-left: 10px;
  text-align: left;
  padding-top: 10px;
}
.message_icon {
  width: 50px;
  height: 50px;
}
.message {
  font-size: 15px;
  color: #b8b7b7;
}
.time_read {
  position: absolute;
  padding-top: 10px;
  right: 10px;
}
.sendtime {
  font-size: 12px;
  color: #b8b7b7;
}
.isread {
  border-radius: 50px;
  background-color: #ff3b30;
  color: #fff;
  width: 10px;
  height: 10px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  float: right;
  margin-top: 5px;
}
.nicknamebox {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>