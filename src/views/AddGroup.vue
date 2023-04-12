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
        <el-input
          placeholder="请输入群组名称"
          maxlength="8"
          v-model="groupName"
          class="groupNameInp"
        >
        </el-input>
        <p>选择联系人</p>
        <div class="mainchoosebody">
          <div v-if="checkUser.length != 0" class="chooseBodyList">
            <div
              v-if="item.id != userId"
              v-for="(item, index) in checkUser"
              class="checkUserCon"
            >
              <img
                class="closeBtn"
                src="../static/images/groupclose.png"
                alt=""
                @click="delSelect(index, item.id)"
              />
              <img class="checkUserIcon" :src="item.usericon" alt="" />
              <span class="checkUserName">{{ item.nickname }}</span>
            </div>
          </div>
        </div>
        <div class="btns">
          <div
            @click="addGroup"
            :class="checkUser.length > 0 ? 'btnitem success' : 'btnitem'"
          >
            完成
          </div>
          <div class="btnitem" @click="closeWindow">取消</div>
        </div>
      </div>
    </div>
    <div class="big_block" v-show="show_success" @click="show_success = false">
      <div class="dialog1">{{ msg }}</div>
    </div>
    <div class="big_block" v-show="show_err" @click="show_err = false">
      <div class="dialog">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import axios from "axios";
import drag from "../components/dragchild";
import { getSpell } from "jian-pinyin";

import { v4 as uuidv4 } from "uuid";
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
      uploadImgUrl: this.baseUrl + "fileupload.php",
      myinfo: "",
      msg: "",
      show_success: false,
      show_err: false,
      groupName: "",
    };
  },
  components: { drag },

  mounted() {
    console.log(uuidv4());
    var that = this;
    ipcRenderer.on("getUserid", function (event, data) {
      console.log("ipc", data);
      that.userId = data;
      that.getMyinfo(data);
      that.getfriends().then((res) => {
        console.log("初始化", res);
        setTimeout(() => {
          that.getFirst(res);
        }, 200);
      });
    });
  },
  methods: {
    getMyinfo(id) {
      axios({
        url: this.baseUrl + "getUserinfo.php",
        method: "get",
        params: {
          userid: id,
        },
      }).then((res) => {
        console.log(res);
        this.myinfo = res.data.data[0];
        console.log("myinfo", this.myinfo);
      });
    },
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
      setTimeout(() => {
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
      }, 1000);
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
    delSelect(index, oin) {
      this.checkUser.splice(index, 1);
      const list = this.checkList.filter((item) => {
        return item != oin;
      });
      this.checkList = list;
      console.log(list);
    },
    addGroup() {
      console.log(this.checkUser);
      var images = [];
      var image1 = new Image();
      var usericon = this.myinfo.usericon;
      image1.src = usericon;
      image1.onload = () => {
        images.push(image1);
      };
      setTimeout(() => {
        this.checkUser.forEach((item) => {
          const Image1 = new Image();
          Image1.src = item.usericon;
          Image1.onload = () => {
            images.push(Image1);
          };
        });
      }, 1000);
      console.log(images);
      setTimeout(() => {
        this.drawGrid(images);
      }, 1500);
    },
    drawGrid(images) {
      var ctx = document.createElement("canvas");
      ctx.width = 150;
      ctx.height = 150;
      if (images.length <= 4) {
        const cellWidth = (ctx.width - 20) / 2;
        const cellHeight = (ctx.height - 20) / 2;
        console.log(ctx.drawImage);
        console.log(images.length);
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            const index = i * 2 + j;
            if (index < images.length) {
              const image = images[index];
              console.log(j * cellWidth);
              console.log(i * cellWidth);
              ctx
                .getContext("2d")
                .drawImage(
                  image,
                  j * cellWidth + j * 10,
                  i * cellHeight + i * 10,
                  cellWidth,
                  cellHeight
                );
            }
          }
        }
      } else if (images.length >= 5) {
        const cellWidth = (ctx.width - 20) / 3;
        const cellHeight = (ctx.height - 20) / 3;
        console.log(ctx.drawImage);
        console.log(images.length);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            if (index < images.length) {
              const image = images[index];
              console.log(j * cellWidth);
              console.log(i * cellWidth);

              ctx
                .getContext("2d")
                .drawImage(
                  image,
                  j * cellWidth + j * 10,
                  i * cellHeight + i * 10,
                  cellWidth,
                  cellHeight
                );
            }
          }
        }
      }
      var src = ctx.toDataURL("image/webp");
      console.log(src);
      let arr = src.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      var theBlob = new Blob([u8arr], { type: mime });
      console.log(theBlob);
      var filename = uuidv4().split("-")[0] + uuidv4().split("-")[1];
      var ff = new File([theBlob], filename + ".webp", {
        type: theBlob.type,
        lastModified: Date.now(),
      });
      console.log(ff);
      this.getfile(ff);
    },
    getfile(file) {
      console.log("上传接口", file);
      const formData = new FormData();
      if (Array.isArray(file)) {
        file.forEach((item) => {
          console.log(item);
          formData.append("file", item);
        });
        console.log(formData);
      } else {
        console.log("fff", file);
        formData.append("file", file);
        console.log(formData);
      }
      axios({
        method: "post",
        url: this.uploadImgUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          console.log("upLoadFile======", res.data);
          var member = this.myinfo.id + ";";
          var master = this.myinfo.id;
          var groupicon = this.baseUrl + "upload/" + res.data.newname;
          this.checkUser.forEach((item) => {
            member += item.id + ";";
          });
          var data = {
            member,
            master,
            groupicon,
            groupName: this.groupName == "" ? "群组" : this.groupName,
          };
          this.addGroups(data);
        })
        .catch((err) => {
          console.log(err);
          this.msg = "群组创建失败";
          this.show_err = true;
        });
    },
    addGroups(data) {
      console.log(data);
      axios({
        method: "post",
        url: this.baseUrl + "addGroup.php",
        data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((res) => {
          console.log(res);
          this.msg = "创建群组成功";
          this.show_success = true;
          setTimeout(() => {
            this.closeWindow();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          this.msg = "群组创建失败";
          this.show_err = true;
          setTimeout(() => {
            this.show_err = false;
          }, 1000);
        });
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
  height: 60%;
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
  position: relative;
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
.closeBtn {
  position: absolute;
  top: 4px;
  right: -8px;
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.success {
  background-color: #07c160 !important;
  color: #fff !important;
}
.success:hover {
  background-color: #38cd7f !important;
  color: #fff !important;
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
.dialog1 {
  position: absolute;
  width: 180px;
  background-color: #13c468;
  border-radius: 5px;
  height: 45px;
  color: #fff;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
}
.dialog {
  position: absolute;
  width: 180px;
  background-color: #fe4c38;
  border-radius: 5px;
  height: 45px;
  color: #fff;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
}

/deep/ .el-input__inner {
  width: 100%;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  margin-top: 20px;
  float: left;

}
</style>