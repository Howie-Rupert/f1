<template>
  <div class="sqBody">
    <div class="title">好友验证</div>
    <div class="xian"></div>
    <div class="lists">
      <!-- <div class="items tops">
        <div>头像</div>
        <div>昵称</div>
        <div>申请时间</div>
        <div>操作</div>
      </div> -->
      <div v-for="item in lists" class="items">
        <el-avatar
          class="icon"
          shape="circle"
          :size="50"
          :src="item.usericon"
        ></el-avatar>
        <div class="nickname" style="margin-left: 10px">
          {{ item.nickname }}
        </div>
        <div class="sqtime">
          {{ item.created_time }}
        </div>
        <div class="control">
          <div class="btn agree" v-if="item.is_agree == 1">已同意</div>
          <div class="btn" v-else @click="agree(item.id)">同意</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ipcRenderer } from "electron";

export default {
  data() {
    return {
      lists: [],
      userId: "",
    };
  },
  mounted() {
    var that = this;
    ipcRenderer.on("getUserid", function (event, data) {
      console.log("ipc", data);
      that.userId = data;
      that.getlists();
    });
  },
  methods: {
    getlists() {
      var userId = this.userId;
      // var userId = 16;
      axios({
        url: this.baseUrl + "sqlist.php",
        method: "get",
        params: {
          userid: userId,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.length != 0) {
          this.lists = res.data;
        }
      });
    },
    agree(id) {
      axios({
        url: this.baseUrl + "editfriend.php",
        method: "get",
        params: {
          id: id,
        },
      }).then((res) => {
        console.log(res);
        this.$Message({
          message: "好友申请通过",
          type: "success",
        });
        this.getlists();
      });
    },
  },
};
</script>

<style scoped>
.sqBody {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.lists {
  display: flex;
  flex-direction: column;
}
.title {
  background-color: #24d96f;
  height: 40px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.xian {
  width: 100%;
  border-top: 1px solid #eee;
}
.icon {
  width: 5%;
}
.items {
  display: flex;
  margin-top: 40px;
  justify-content: center;
}
.nickname {
  display: flex;
  align-items: center;
  margin-right: 50px;
  width: 20%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sqtime {
  display: flex;
  margin-right: 50px;
  align-items: center;
  width: 15%;
}
.control {
  display: flex;
  align-items: center;
  width: 20%;
}
.tops {
  margin-bottom: 20px;
}
.btn {
  width: 50px;
  height: 20px;
  background-color: #24d96f;
  text-align: center;
  line-height: 20px;
  border-radius: 5px;
  padding: 2px;
  color: #fff;
  cursor: pointer;
}
.agree {
  background-color: #f1f3f4;
  color: #333;
}
</style>