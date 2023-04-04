<template>
  <div class="friendAdd">
    <drag />
    <div class="title">搜索用户</div>
    <div class="searchContent">
      <el-input
        class="inputContent"
        v-model="keyword"
        placeholder="请输入昵称/手机号"
      ></el-input>
      <div @click="search" class="search">搜索</div>
    </div>
    <div class="xian"></div>
    <div class="searchRes">
      <div class="searchResTitle">搜索结果</div>
      <div class="result" v-if="lists.length == 0">未搜索到结果</div>
      <div class="friendlist">
        <div class="userinfo" v-for="item in lists">
          <el-avatar shape="circle" :size="50" :src="item.usericon"></el-avatar>
          <div style="margin-left: 10px">
            {{ item.nickname }}
            <div class="addfriend" @click="addfriend(item.id)">+ 好友</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ipcRenderer } from "electron";
import drag from "../components/dragchild";
export default {
  components: { drag },
  data() {
    return {
      keyword: "",
      lists: [],
      isfriendlist: [],
      userId: "",
    };
  },
  mounted() {
    var that = this;
    ipcRenderer.on("getUserid", function (event, data) {
      console.log("ipc", data);
      that.userId = data;
      that.myfriend();
    });
  },
  methods: {
    myfriend() {
      var id = this.userId;
      // var id = 16;
      axios({
        url: this.baseUrl + "friendlist.php",
        method: "get",
        params: {
          userid: id,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.isfriendlist = res.data.data;
        }
      });
    },
    search() {
      this.lists = [];
      if (this.keyword == "") return;
      let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/;
      if (exp.test(this.keyword)) {
        var params = {
          phone: this.keyword,
        };
      } else {
        var params = {
          nickname: this.keyword,
        };
      }
      axios({
        url: this.baseUrl + "searchFriend.php",
        method: "get",
        params,
      }).then((res) => {
        if (res.data.length != 0) {
          res.data.forEach((item) => {
            if (item.id == this.userId) {
              res.data.splice(res.data.indexOf(item), 1, "");
            }
            this.isfriendlist.forEach((ite) => {
              if (item.id != this.userId) {
                if (
                  (item.id == ite.sq_userid && ite.bsq_userid == this.userId) ||
                  (item.id == ite.bsq_userid && ite.sq_userid == this.userId)
                ) {
                  res.data.splice(res.data.indexOf(item), 1, "");
                }
              }
            });
          });
        }
        res.data.forEach((item) => {
          if (item != "") {
            this.lists.push(item);
          }
        });
      });
    },
    addfriend(id) {
      var userId = this.userId;
      // var userId = 16;
      axios({
        url: this.baseUrl + "addfriend.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          sq_userid: userId,
          bsq_userid: id,
        },
      }).then((res) => {
        console.log(res);
        if ((res.data.code = 200)) {
          this.$Message({
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.friendAdd {
  text-align: left;
}
.title {
  margin: 50px 50px 20px 50px;
}
.searchContent {
  display: flex;
  margin: 0px 50px 30px 50px;
  justify-content: space-between;
}
.inputContent {
  width: 80%;
}
.search {
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #24d96f;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}
.xian {
  width: 100%;
  border-top: 1px solid #eee;
}
.searchResTitle {
  margin: 20px 50px 20px 50px;
}
.friendlist {
  margin: 0px 50px 0px 50px;
  display: flex;
  flex-wrap: wrap;
}
.userinfo {
  display: flex;
  align-items: center;
}
.addfriend {
  width: auto;
  height: auto;
  font-size: 14px;
  padding: 0 5px 0 5px;
  color: #fff;
  background-color: #24d96f;
  border-radius: 11px;
  cursor: pointer;
}
.result {
  text-align: center;
  font-size: 12px;
  color: #cccfd6;
}
</style>