<template>
  <div class="messagebody">
    <div class="list_content" v-for="(item, index) in messagelist" :key="index">
      <img class="message_icon" :src="item.usericon" alt="" />
      <div class="name_message">
        <div>
          {{ item.nickname }}
        </div>
        <div class="message">
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
        {
          img: img1,
          name: "USERNAME",
          message: "message",
          message_type: 0,
          time: "12:17",
          isread: "1",
        },
        {
          img: img1,
          name: "USERNAME",
          message: "message",
          message_type: 0,
          time: "12:17",
          isread: "1",
        },
      ],
      firstList: [],
      myfirst: [],
      otherfirst: [],
      userlist: [],
    };
  },
  mounted() {
    var that = this;
    this.getlist().then((res) => {
      console.log("promise", res);
      that.userlist = res;
      var id = 16;
      res.forEach((item) => {
        that.firstList.forEach((ite) => {
          if (item.id == ite.from_userid && id == ite.to_userid) {
            that.otherfirst.push(ite);
          }
          if (item.id == ite.to_userid && id == ite.from_userid) {
            console.log("myfirst", ite);
            that.myfirst.push(ite);
          }
        });
      });
      console.log("其他人发起", that.otherfirst);
      console.log("我发起", that.myfirst);
      var arr1 = that.otherfirst;
      var arr2 = that.myfirst;
      var after1 = [];
      var after2 = [];
      //他人发起的重复的取最近的一条
      for (var i = 0; i < arr1.length; i++) {
        for (var j = i + 1; j < arr1.length; j++) {
          if (arr1[i].from_userid == arr1[j].from_userid) {
            if (arr1[i].messageTime < arr1[j].messageTime) {
              after1.push(arr1[j]);
            }
          }
        }
      }
      //自己发起的重复的取最近的一条
      for (var i = 0; i < arr2.length; i++) {
        for (var j = i + 1; j < arr2.length; j++) {
          if (arr2[i].to_userid == arr2[j].to_userid) {
            if (arr2[i].messageTime < arr2[j].messageTime) {
              after2.push(arr2[j]);
            }
          }
        }
      }
      var re = [];
      var re2 = [];
      //他人发起
      arr1.forEach((item) => {
        after1.forEach((ite) => {
          if (item.from_userid == ite.from_userid) {
            arr1.splice(arr1.indexOf(item), 1, " ");
          }
        });
      });
      arr1.forEach((item) => {
        if (item != " ") {
          re.push(item);
        }
      });
      //自己发起
      arr2.forEach((item) => {
        after2.forEach((ite) => {
          if (item.to_userid == ite.to_userid) {
            arr2.splice(arr2.indexOf(item), 1, " ");
          }
        });
      });
      arr2.forEach((item) => {
        if (item != " ") {
          re2.push(item);
        }
      });
      after1.forEach((item) => {
        re.push(item);
      });
      after2.forEach((item) => {
        re2.push(item);
      });
      // console.log('他人发起',re)
      // console.log('自己发起',re2)
      re2.forEach((item) => {
        re.push(item);
      });
      console.log("合并后", re);
      var newlist = [];
      for (var i = 0; i < re.length; i++) {
        for (var j = i + 1; j < re.length; j++) {
          if (
            re[i].from_userid == re[j].to_userid &&
            re[i].to_userid == re[j].from_userid
          ) {
            if (re[i].messageTime > re[j].messageTime) {
              newlist.push(re[i]);
            }
            if (re[j].messageTime > re[i].messageTime) {
              newlist.push(re[j]);
            }
          }
        }
      }
      var findexlist = [];
      var tindexlist = [];
      newlist.forEach((item) => {
        if (item.from_userid != 16) {
          findexlist.push(item.from_userid);
        }
        if (item.to_userid != 16) {
          tindexlist.push(item.to_userid);
        }
      });
      var newre = [];
      re.forEach((item) => {
        findexlist.forEach((ite) => {
          if (item.from_userid == ite || item.to_userid == ite) {
            newre.push(item);
          }
        });
      });
      re.forEach((item) => {
        tindexlist.forEach((ite) => {
          if (item.from_userid == ite || item.to_userid == ite) {
            newre.push(item);
          }
        });
      });
      newre.forEach((item) => {
        re.splice(re.indexOf(item), 1, "");
      });
      re.forEach((item) => {
        if (item != "") {
          newlist.push(item);
        }
      });
      //经过过滤后的列表
      console.log(newlist);
      newlist.forEach((item) => {
        var date = new Date(parseInt(item.messageTime) * 1000);
        let Y = date.getFullYear() + "-";
        let M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1) + "-"
            : date.getMonth() + 1 + "-";
        let D =
          date.getDate() < 10
            ? "0" + date.getDate() + " "
            : date.getDate() + " ";
        let h =
          date.getHours() < 10
            ? "0" + date.getHours() + ":"
            : date.getHours() + ":";
        let m =
          date.getMinutes() < 10
            ? "0" + date.getMinutes() + ":"
            : date.getMinutes() + ":";
        let s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var today = new Date();
        var todayY = today.getFullYear() + "-";
        let todayM =
          today.getMonth() + 1 < 10
            ? "0" + (today.getMonth() + 1) + "-"
            : today.getMonth() + 1 + "-";
        let todayD =
          today.getDate() < 10
            ? "0" + today.getDate() + " "
            : today.getDate() + " ";
        if (Y == todayY && M == todayM && D == todayD) {
          item.messageTime = h + m + s;
        } else {
          item.messageTime = Y + M + D + h + m + s;
        }
        if (item.to_userid != 16) {
          that.userlist.forEach((ite) => {
            if (item.to_userid == ite.id) {
              item.nickname = ite.nickname;
              item.usericon = ite.usericon;
            }
          });
        }
        if (item.from_userid != 16) {
          that.userlist.forEach((ite) => {
            if (item.from_userid == ite.id) {
              item.nickname = ite.nickname;
              item.usericon = ite.usericon;
            }
          });
        }
      });
      this.messagelist = newlist;
    });
  },
  methods: {
    getlist() {
      var id = 16;
      return new Promise((resolve, rehect) => {
        axios({
          url: "http://www.test.com:8083/message.php",
          method: "get",
          params: {
            userid: id,
          },
        }).then((res) => {
          console.log(res);
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