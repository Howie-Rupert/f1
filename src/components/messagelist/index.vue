<template>
  <div class="messagebody">
    <div
      class="list_content"
      v-for="(item, index) in newlists"
      :key="index"
      @click="chooseuser(item)"
    >
      <img class="message_icon" :src="item.usericon" alt="" />
      <div class="name_message">
        <div>
          {{ item.nickname }}
        </div>
        <div class="message">
          <!-- {{ item.from_userid != 16 ? item.nickname : "" }} -->
          {{ item.message }}
        </div>
      </div>
      <div class="time_read">
        <div class="sendtime">
          {{ item.messageTime }}
        </div>
        <div class="isread">
          <!-- {{ item.isread }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import img1 from "../../static/images/userimg.png";
export default {
  data() {
    return {
      messagelist: [
        // {
        //   img: img1,
        //   name: "USERNAME",
        //   message: "message",
        //   message_type: 0,
        //   time: "12:17",
        //   isread: "1",
        // },
        // {
        //   img: img1,
        //   name: "USERNAME",
        //   message: "message",
        //   message_type: 0,
        //   time: "12:17",
        //   isread: "1",
        // },
      ],
      firstList: [],
      myfirst: [],
      otherfirst: [],
      userlist: [],
      newlists: "",
      wsUrl: "ws://127.0.0.1:1234", // ws地址
      websock: null, // ws实例
      message: "",
    };
  },

  mounted() {
    var that = this;
    this.getlist().then((res) => {
      console.log("promise", res);
      that.userlist = res;
      var id = this.$store.state.userid;
      res.forEach((item) => {
        that.firstList.forEach((ite) => {
          if (item.id == ite.from_userid && id == ite.to_userid) {
            ite.nickname = item.nickname;
            ite.usericon = item.usericon;
          }
          if (item.id == ite.to_userid && id == ite.from_userid) {
            ite.nickname = item.nickname;
            ite.usericon = item.usericon;
          }
        });
      });
      that.firstList.forEach((item) => {
        var date = new Date(Number(item.messageTime) * 1000);
        var Y = date.getFullYear();
        var M = date.getMonth() + 1;
        var D = date.getDate();
        var newdate = new Date();
        var tY = newdate.getFullYear();
        var tM = newdate.getMonth() + 1;
        var tD = newdate.getDate();
        if (Y == tY && M == tM && D == tD) {
          var H = date.getHours();
          var m = date.getMinutes();
          item.messageTime = H + ":" + m;
        } else {
          item.messageTime = Y + "-" + M + "-" + D;
        }
      });
      console.log("加入头像昵称", that.firstList);
      this.newlists = this.firstList;
    });
  },
  methods: {
    getlist() {
      var id = this.$store.state.userid;
      return new Promise((resolve, rehect) => {
        axios({
          url: "http://www.test.com:8083/message.php",
          method: "get",
          params: {
            userid: id,
          },
        }).then((res) => {
          console.log("消息列表", res);
          if (res.data.code == 200) {
            var lists = [];
            this.firstList = res.data.data;
            res.data.data.forEach((item) => {
              lists.push(item.from_userid);
              lists.push(item.to_userid);
            });
            lists = new Set(lists);
            var arr = [];
            var leng = lists.size - 1;
            var len = 0;
            lists.forEach((item) => {
              if (item != id) {
                axios({
                  url: "http://www.test.com:8083/getUserinfo.php",
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
                      resolve(arr);
                    }
                  }
                });
              }
            });
          }
        });
      });
    },
    chooseuser(item) {
      console.log(item);
      if (item.from_userid != this.$store.state.userid) {
        this.$store.commit("SET_TOUSER", item.from_userid);
      } else if (item.to_userid != this.$store.state.userid) {
        this.$store.commit("SET_TOUSER", item.to_userid);
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
</style>