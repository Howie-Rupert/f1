<template>
  <div class="friendlistbody">
    <div v-for="item in afterSortList" class="friendrow">
      <div class="sort">{{ item.sort }}</div>
      <div
        v-for="ite in item.list"
        class="name_img"
        @click="openview(ite)"
        @contextmenu.prevent="contextMenu($event, ite.id)"
      >
        <img class="userimg" :src="ite.usericon" alt="" />
        <div class="username">
          {{ ite.nickname }}
        </div>
      </div>
    </div>
    <vue-context-menu
      :contextMenuData="contextMenuData"
      @insertData="insertData"
      @deleteData="deleteData"
    ></vue-context-menu>
  </div>
</template>

<script>
import { getSpell } from "jian-pinyin";
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
            fnHandler: "insertData",
            btnName: "发送消息",
          },
          {
            fnHandler: "deleteData",
            btnName: "删除好友",
          },
        ],
      },
      friendlist: [],
      pylist: [],
      afterSortList: [],
      friendlistss: [],
    };
  },
  methods: {
    insertData() {
      this.$store.commit("SET_TOUSER", localStorage.getItem("touserid"));
    },
    deleteData() {
      this.$confirm("确认删除该好友?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          var params = JSON.parse(localStorage.getItem("deleteInfo"));
          axios({
            url: "/api/deletefriend.php",
            method: "get",
            params: {
              userid: params.userid,
              touserid: params.touserid,
            },
          }).then((res) => {
            this.$message({
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消",
          });
        });
    },
    contextMenu(e, data) {
      let x = e.clientX;
      let y = e.clientY;
      this.contextMenuData.axis = { x, y };
      localStorage.setItem("touserid", data);
      var params = {
        userid: this.$store.state.userid,
        touserid: data,
      };
      localStorage.setItem("deleteInfo", JSON.stringify(params));
    },
    getfriends() {
      var id = this.$store.state.userid;
      // var id = 16;
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
    openview(item) {
      console.log(item.id);
      this.$store.commit("SET_TOUSER", item.id);
    },
  },
  mounted() {
    var that = this;
    this.getfriends().then((res) => {
      console.log("初始化", res);
      setTimeout(() => {
        that.getFirst(res);
      }, 200);
    });
  },
};
</script>

<style scoped>
.friendlistbody {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
.friendlistbody::-webkit-scrollbar {
  width: 0 !important;
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
}
.userimg {
  width: 50px;
  height: 50px;
}
.username {
  margin-left: 15px;
}
</style>