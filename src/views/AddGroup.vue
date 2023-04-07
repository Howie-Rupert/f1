<template>
  <div class="groupbody">
    <div class="drag"></div>
    <!-- <drag /> -->
    <div class="mainbody">
      <div class="friendlist">
        <el-checkbox-group v-model="checkList" @change="showinfo">
          <div v-for="item in afterSortList" class="friendrow">
            <div class="sort">{{ item.sort }}</div>
            <div v-for="ite in item.list" class="name_img">
              <el-checkbox class="checkbox" :label="ite.id"> </el-checkbox>
              <img class="userimg" :src="ite.usericon" alt="" />
              <div class="username">
                {{ ite.nickname }}
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="chooselist">
        <p>选择联系人</p>
        <div class="mainchoosebody">
          <div v-if="checkUser.length != 0" class="chooseBodyList">
            <div v-for="item in checkUser" class="checkUserCon">
              <img class="checkUserIcon" :src="item.usericon" alt="" />
              <span class="checkUserName">{{ item.nickname }}</span>
            </div>
          </div>
        </div>
        <div class="btns">
          <div class="btnitem">完成</div>
          <div class="btnitem" @click="closeWindow">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import axios from "axios";
import drag from "../components/dragchild";
import { getSpell } from "jian-pinyin";

export default {
  data() {
    return {
      userId: "",
      friendlist: [],
      pylist: [],
      afterSortList: [],
      friendlistss: [],
      checkList: [],
      checkUser: [],
    };
  },
  components: { drag },

  mounted() {
    var that = this;
    ipcRenderer.on("getUserid", function (event, data) {
      console.log("ipc", data);
      that.userId = data;
      that.getfriends().then((res) => {
        console.log("初始化", res);
        setTimeout(() => {
          that.getFirst(res);
        }, 200);
      });
    });
  },
  methods: {
    showinfo(value) {
      this.checkUser = [];
      this.checkList.forEach((item) => {
        this.friendlist.forEach((ite) => {
          if (item == ite.id) {
            console.log(ite.nickname);
            this.checkUser.push(ite);
          }
        });
      });
      console.log(this.checkUser);
    },
    closeWindow() {
      ipcRenderer.send("close");
    },
    getfriends() {
      var id = this.userId;
      //   var id = 27;
      return new Promise((resolve, rehect) => {
        axios({
          url: this.baseUrl + "friendlist.php",
          method: "get",
          params: {
            userid: id,
          },
        }).then((res) => {
          var lists = [];
          if (res.data.code == 200) {
            res.data.data.forEach((item) => {
              if (item.bsq_userid != id) {
                lists.push(item.bsq_userid);
              } else if (item.sq_userid != id) {
                lists.push(item.sq_userid);
              }
            });
            lists = new Set(lists);
            console.log("lists", lists);
            var arr = [];
            lists.forEach((item) => {
              axios({
                url: this.baseUrl + "getUserinfo.php",
                method: "get",
                params: {
                  userid: item,
                },
              }).then((ress) => {
                if (ress.code != 200) {
                  arr.push(ress.data.data[0]);
                }
              });
            });
            this.friendlist = arr;
            setTimeout(() => {
              resolve(arr);
            }, 1000);
          }
        });
      });
    },
    getFirst(arr) {
      arr.forEach((item) => {
        var str = item.nickname;
        var pystr = getSpell(
          str,
          (charactor, spell) => {
            return spell[1];
          },
          ""
        );
        this.pylist.push(pystr);
      });
      this.createNewList();
    },
    createNewList() {
      var friendlist = [];
      friendlist = this.pylist.sort();
      var arr = [];
      friendlist.forEach((item) => {
        arr.push(item.slice(0, 1).toUpperCase());
      });
      var narr = new Set(arr);
      var newfirendlist = [];
      narr.forEach((item) => {
        newfirendlist.push({
          sort: item,
          list: [],
        });
      });
      newfirendlist.forEach((item) => {
        this.friendlist.forEach((ite) => {
          var str = ite.nickname;
          var pystr = getSpell(
            str,
            (charactor, spell) => {
              return spell[1];
            },
            ""
          );
          if (pystr.slice(0, 1).toUpperCase() == item.sort) {
            item.list.push(ite);
          }
        });
      });
      this.afterSortList = newfirendlist;
      console.log("排序", this.afterSortList);
    },
  },
};
</script>

<style scoped>
.drag {
  position: fixed;
  width: 100%;
  height: 40px;
  -webkit-app-region: drag;
}
.mainbody {
  width: 100%;
  height: 100vh;
  display: flex;
}
.friendlist {
  width: 40%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 2px solid #f5f5f5;
}
/deep/.friendlist::-webkit-scrollbar {
  width: 2px;
}
/deep/.friendlist::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d2d2d2;
}
/deep/.friendlist::-webkit-scrollbar-button {
  width: 2px;
  border-radius: 50%;
  background: black;
  display: none;
}
.friendrow {
  height: auto;
  width: 100%;
  padding: 10px;
  text-align: left;
}
.sort {
  color: #b8b7b7;
  font-size: 14px;
  margin-bottom: 10px;
}
.name_img {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  width: auto;
}
.checkbox {
  margin-right: 10px;
}
.userimg {
  width: 32px;
  height: 32px;
  border-radius: 5px;
}
.username {
  margin-left: 15px;
  font-size: 14px !important;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chooselist {
  width: 60%;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px;
}
.chooselist > p {
  font-size: 12px;
  text-align: left;
}
.mainchoosebody {
  height: 80%;
  width: 100%;
  margin-top: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}
.btns {
  width: 100%;
  display: flex;
  margin-top: 15px;
  justify-content: space-around;
}
.btnitem {
  width: 100px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #63c160;
  cursor: pointer;
  background-color: #f3f3f3;
}
.btnitem:first-child {
  background-color: #ebebeb;
  color: #9e9e9e;
}
.btnitem:hover {
  background-color: #dbdbdb;
}
/deep/.el-checkbox__label {
  width: 0px !important;
  overflow: hidden;
}
.chooseBodyList {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.checkUserCon {
  width: 50px;
}
.checkUserIcon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin: 10px;
}
/deep/.mainchoosebody::-webkit-scrollbar {
  width: 2px;
}
/deep/.mainchoosebody::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d2d2d2;
}
/deep/.mainchoosebody::-webkit-scrollbar-button {
  width: 2px;
  border-radius: 50%;
  background: black;
  display: none;
}
.checkUserName {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}
</style>