<template>
  <div class="friendlistbody">
    <div v-for="item in afterSortList" class="friendrow">
      <div class="sort">{{ item.sort }}</div>
      <div v-for="ite in item.list" class="name_img" @click="openview(ite)">
        <img class="userimg" :src="ite.usericon" alt="" />
        <div class="username">
          {{ ite.nickname }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpell } from "jian-pinyin";
import axios from "axios";
export default {
  data() {
    return {
      friendlist: [],
      pylist: [],
      afterSortList: [],
      friendlistss: [],
    };
  },
  methods: {
    getfriends() {
      var id = this.$store.state.userid;
      // var id = 16;
      return new Promise((resolve, rehect) => {
        axios({
          url: "http://www.test.com:8083/friendlist.php",
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
                url: "http://www.test.com:8083/getUserinfo.php",
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
            }, 200);
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
      that.getFirst(res);
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