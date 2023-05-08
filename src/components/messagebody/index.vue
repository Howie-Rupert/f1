<template>
  <div class="messagebody">
    <div class="bodyname">
      <div v-if="$store.state.contectuser.indexOf('!!!') == '-1'">
        {{ otherUserInfo.nickname }}
      </div>
      <div v-if="$store.state.contectuser.indexOf('!!!') != '-1'">
        <div @click="changeGroupname = false" v-if="changeGroupname">
          {{ otherUserInfo.nickname }}
        </div>
        <div v-else>
          <input
            type="text"
            v-model="otherUserInfo.nickname"
            @blur="changeGroupInfo"
          />
        </div>
      </div>
      <div class="otherControl" @click="showEdit">
        <img src="../../static/images/eil.png" alt="" />
      </div>
    </div>
    <div class="his_message" ref="his_message">
      <div
        v-for="(item, index) in message"
        v-if="
          item.delby != null && item.delby != ''
            ? Number(item.delby.indexOf($store.state.userid)) === Number(-1)
            : true
        "
      >
        <div class="timestamp">{{ renderMessageDate(item, index) }}</div>
        <div class="message_list">
          <div v-if="$store.state.userid == item.from_userid" class="senduser">
            <!-- <div v-if="16 == item.from_userid" class="senduser"> -->
            <el-avatar
              :size="35"
              :src="currentUserInfo.usericon"
              class="from_avatar"
            ></el-avatar>
            <div class="from_message" v-if="item.message_type == 1">
              <div>
                {{ item.message }}
              </div>
              <div class="bottom_arrow_send"></div>
            </div>
            <div v-if="item.message_type == 2" class="imgmessage">
              <img
                @click="openimg(item.message, 'img')"
                :src="item.message"
                alt=""
              />
            </div>
            <div v-if="item.message_type == 3" class="imgmessage">
              <video
                :src="item.message"
                @click="openimg(item.message, 'video')"
              ></video>
              <img
                @dragstart.prevent
                class="pause_btn"
                @click="openimg(item.message, 'video')"
                src="../../static/images/pause.png"
                alt=""
              />
            </div>
            <a
              v-if="item.message_type == 4"
              :href="item.message"
              @click.prevent="download(item.message, $event)"
              download="download"
            >
              <div class="content-file" title="点击下载">
                <div class="file-info">
                  <span class="file-name">{{ item.messageName }}</span>
                  <!-- <span class="file-size"
                          >{{
                            (message.payload.size / 1024).toFixed(2)
                          }}KB</span
                        > -->
                </div>
                <img class="file-img" src="../../static/images/file-icon.png" />
              </div>
            </a>
          </div>
          <div v-else class="sendeduser">
            <el-avatar
              :size="35"
              :src="
                item.from_userIcon != undefined
                  ? item.from_userIcon
                  : otherUserInfo.usericon
              "
              class="to_avatar"
            ></el-avatar>
            <span class="groupMemName" v-if="item.from_userName != undefined">{{
              item.from_userName
            }}</span>
            <div
              :class="
                item.from_userName != undefined ? 'to_message2' : 'to_message'
              "
              v-if="item.message_type == 1"
            >
              <div>
                {{ item.message }}
              </div>
              <div
                :class="
                  item.from_userName != undefined
                    ? 'bottom_arrow_to2'
                    : 'bottom_arrow_to'
                "
              ></div>
            </div>
            <div
              v-if="item.message_type == 2"
              :class="
                item.from_userName != undefined ? 'imgmessage2' : 'imgmessage'
              "
            >
              <img
                @click="openimg(item.message, 'img')"
                :src="item.message"
                alt=""
              />
            </div>
            <div
              v-if="item.message_type == 3"
              :class="
                item.from_userName != undefined ? 'imgmessage2' : 'imgmessage'
              "
            >
              <video
                :src="item.message"
                @click="openimg(item.message, 'video')"
              ></video>
              <img
                @dragstart.prevent
                @click="openimg(item.message, 'video')"
                class="pause_btn"
                src="../../static/images/pause.png"
                alt=""
              />
            </div>
            <a
              v-if="item.message_type == 4"
              :href="item.message"
              download="download"
              @click.prevent="download(item.message, $event)"
            >
              <div
                :class="
                  item.from_userName != undefined
                    ? 'content-file2'
                    : 'content-file'
                "
                title="点击下载"
              >
                <div class="file-info">
                  <span class="file-name">{{ item.messageName }}</span>
                  <!-- <span class="file-size"
                          >{{
                            (message.payload.size / 1024).toFixed(2)
                          }}KB</span
                        > -->
                </div>
                <img class="file-img" src="../../static/images/file-icon.png" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="kong"></div>
    <div class="send_message">
      <div class="action-bar">
        <!-- 表情 -->
        <div class="action-item">
          <div v-if="emoji.visible" class="emoji-box">
            <img
              v-for="(emojiItem, emojiKey, index) in emoji.map"
              class="emoji-item"
              :key="index"
              :src="emoji.url + emojiItem"
            />
          </div>
          <i
            class="iconfont icon-smile"
            title="表情"
            @click="showEmoji = !showEmoji"
          ></i>
        </div>
        <!-- 图片 -->
        <div class="action-item">
          <ImgUpload for="img-input" @input="filelist"></ImgUpload>
        </div>
        <!-- 视频 -->
        <div class="action-item">
          <VideoUpload for="video-input" @input="filelist1"></VideoUpload>
        </div>
        <!-- 文件 -->
        <div class="action-item">
          <label for="file-input">
            <FileUpload for="video-input" @input="filelist2"></FileUpload>
          </label>
        </div>
        <!-- <div class="action-item">
          <label for="file-input">
            <i @click="screen" class="iconfont icon-paizhao" title="表情"></i>
          </label>
        </div> -->
      </div>
      <Emoji class="emojibox" @emoji_click="emoji" v-show="showEmoji" />
      <el-input
        type="textarea"
        ref="inputArea"
        class="textar"
        @blur="handleInputBlur"
        :rows="5"
        v-model="textarea"
        maxlength="2000"
        refs="drag-input"
      >
      </el-input>
      <div class="sendbtn" @click="sendmessage">发送</div>
    </div>
    <div class="hidden" v-if="showControl" @click="showControl = false">
      <div class="cotBody">
        <div v-if="contGroup" class="cotItem2" @click="showGroupMembers">
          查看群成员
        </div>
        <div v-if="contGroup" class="cotItem2" @click="editGroupMember">
          添加好友入群
        </div>
        <div class="cotItem" @click.stop="delmessage">删除聊天记录</div>
        <div v-if="contGroup" class="cotItem" @click="deleteDataG">
          退出群聊
        </div>
      </div>
    </div>

    <div class="editgroupmember" v-if="showAddMember">
      <div class="mainbody">
        <div class="friendlist">
          <el-checkbox-group v-model="checkList" @change="showinfo">
            <div v-for="item in afterSortList" class="friendrow">
              <div class="sort" :style="connn(item) ? 'disabled' : ''">
                {{ item.sort }}
              </div>
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
              <div
                v-if="item.id != $store.state.userid"
                v-for="(item, index) in checkUser"
                class="checkUserCon"
              >
                <img
                  class="closeBtn"
                  src="../../static/images/groupclose.png"
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
      <div
        class="big_block"
        v-show="show_success"
        @click="show_success = false"
      >
        <div class="dialog1">{{ msg }}</div>
      </div>
      <div class="big_block" v-show="show_err" @click="show_err = false">
        <div class="dialog">{{ msg }}</div>
      </div>
    </div>

    <div class="groupmembers" v-if="showGroupMember">
      <div class="mainbody2">
        <span class="closeshowmem" @click="showGroupMember = false">x</span>
        <div class="chooseBodyList">
          <div
            class="checkUserCon2"
            @click="openview(item)"
            v-for="item in groupMembersList"
          >
            <img class="checkUserIcon" :src="item.usericon" alt="" />
            <span class="checkUserName">{{ item.nickname }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Emoji from "../../components/emoji";
import ImgUpload from "../../components/Imageupload";
import VideoUpload from "../../components/Videoupload";
import FileUpload from "../../components/FileUpload";
import { ipcRenderer, desktopCapturer, BrowserWindow } from "electron";
import { formatDate } from "../../utils/utils";
import axios from "axios";
import { mapGetters } from "vuex";
import { getSpell } from "jian-pinyin";
export default {
  components: { Emoji, ImgUpload, VideoUpload, FileUpload },
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      username: "USERNAME",
      showEmoji: false,
      textarea: "",
      cursorIndex: "",
      currentid: "",
      to_userId: "",
      otherUserInfo: {
        nickname: "",
      },
      message: [],
      otheruser: "",
      groupId: "",
      currentUserInfo: "",
      wsUrl: "ws://150.158.84.153/ws", // ws地址
      // wsUrl: "ws://127.0.0.1:1234", // ws地址
      websock: null, // ws实例
      message: "",
      timeout: 6000,
      timeoutObj: "",
      serverTimeoutObj: "",
      repeatGroupId: [],
      isFinish: true,
      showControl: false,
      contGroup: false,
      changeGroupname: true,
      friendlist: "",
      show_success: false,
      show_err: false,
      pylist: [],
      afterSortList: [],
      friendlistss: [],
      checkList: [],
      checkList2: [],
      checkUser: [],
      myinfo: "",
      msg: "",
      groupName: "",
      showAddMember: false,
      showGroupMember: false,
      groupMembersList: [],
    };
  },
  mounted() {
    this.initWebSocket();
    console.log(Date.now());
    axios({
      url: this.baseUrl + "getUserinfo.php",
      method: "get",
      params: {
        userid: this.$store.state.userid,
        // userid: 16,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        this.currentUserInfo = res.data.data[0];
      }
    });
    this.otheruser = this.$store.state.contectuser;
    this.getmessagelist();
    this.getUserInfo();
    this.$nextTick(() => {
      this.$refs.his_message.scrollTop = this.$refs.his_message.scrollHeight;
    });
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
      this.getmessagelist();
      this.getUserInfo();
    },
  },
  beforeDestroy() {
    this.websock.close();
  },
  methods: {
    connn(data) {
      if (data) {
        return true;
      } else {
        return false;
      }
    },
    deleteDataG() {
      this.showControl = false;
      this.$confirm("确认退出群聊?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          var userId = this.$store.state.userid;
          var toUserId = this.$store.state.contectuser;
          var params = {
            userId: userId,
            groupId: toUserId.split("!!!")[1],
          };
          axios({
            url: this.baseUrl + "delGroup.php",
            method: "get",
            params,
          }).then((res) => {
            this.$message({
              message: "删除成功!",
            });
            this.$store.commit("SET_TOUSER", "006");
          });
        })
        .catch(() => {});
    },
    delmessage() {
      this.showControl = false;
      console.log(this.$store.state.userid);
      console.log(this.$store.state.contectuser);
      var userId = this.$store.state.userid;
      var toUserId = this.$store.state.contectuser;
      if (toUserId.indexOf("!!!") != -1) {
        var params = {
          userId: userId,
          groupId: toUserId.split("!!!")[1],
        };
      } else {
        var params = {
          userId: userId,
          touserId: toUserId,
        };
      }

      this.$confirm("确认清空消息记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          axios({
            url: this.baseUrl + "delmessage.php",
            method: "get",
            params,
          }).then((res) => {
            this.getmessagelist();
            this.$message({
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    reset() {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      return this;
    },
    start() {
      var that = this;
      this.serverTimeoutObj = setInterval(function () {
        console.log("websocket", that.websock.readyState === 1);
        if (that.websock.readyState === 1) {
          console.log("连接状态，发送消息保持连接");
          that.websock.send("socket heart"); // 连接成功将消息传给服务端
          that.reset();
          that.start(); // 如果获得消息 说明连接正常 重置心跳检测
        } else {
          console.log("断开连接， 尝试重连");
          that.initWebSocket();
        }
      }, this.timeout);
    },
    // 初始化weosocket
    initWebSocket() {
      if (typeof WebSocket === "undefined")
        return console.log("您的浏览器不支持websocket");
      this.websock = new WebSocket(this.wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      this.reset();
      this.start(); // 成功建立连接后，重置心跳检测
      // 连接建立之后执行send方法发送数据
      let actions = {
        type: "login",
        msg: this.$store.state.userid + "用户进入",
        userid: this.$store.state.userid,
        // msg: 16 + "用户进入",
        // userid: 16,
      };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      // 数据接收
      const redata = JSON.parse(e.data);
      console.log("接收的数据", redata);
      this.getmessagelist();
      this.$store.commit("SET_MESSAGE", true);
      // setTimeout(() => {
      //   this.reset();
      //   this.start();
      // }, 10000);
    },
    websocketsend(Data) {
      // 数据发送
      this.websock.send(Data);
      this.$store.commit("SET_MESSAGE", true);
    },
    websocketclose(e) {
      // 关闭
      console.log("断开连接", e);
    },
    before_ws_send() {
      var to_userId = this.otherUserId;
      if (this.otherUserId.indexOf("!!!") != -1) {
        var data = {
          type: "group",
          to_userid: "",
          msg: "1",
        };
        this.websocketsend(JSON.stringify(data));

        // axios({
        //   url: this.baseUrl + "groupList.php",
        //   method: "get",
        //   params: {
        //     groupId: this.otherUserId.split("!!!")[1],
        //   },
        // }).then((res) => {
        //   console.log("groupInfo", res.data.data[0]);
        //   var shouldSendUsers = res.data.data[0].memberUser.split(";");
        //   shouldSendUsers.forEach((item) => {
        //     if (item != "") {
        //       var data = {
        //         type: "user",
        //         to_userid: item,
        //         msg: "1",
        //       };
        //       if (this.isFinish == true) {
        //         this.isFinish = false;
        //         this.websocketsend(JSON.stringify(data));
        //         console.log("群发websocket", item);
        //       }
        //     }
        //   });
        // });
      } else {
        var data = {
          type: "user",
          to_userid: to_userId,
          msg: "1",
        };
        this.websocketsend(JSON.stringify(data));
      }
    },
    download(url, event) {
      event.preventDefault();
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status === 200) {
          const blob = new Blob([this.response], {
            type: xhr.getResponseHeader("Content-Type"),
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = url.substring(url.lastIndexOf("/") + 1);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      xhr.send();
    },
    changeGroupInfo() {
      console.log(this.otherUserInfo.nickname);
      axios({
        url: this.baseUrl + "editGroup.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          groupId: this.$store.state.contectuser.split("!!!")[1],
          groupName: this.otherUserInfo.nickname,
        },
      }).then((res) => {
        this.changeGroupname = true;
        this.before_ws_send();
      });
    },
    getUserInfo() {
      if (this.contectuser.indexOf("!!!") == -1) {
        axios({
          url: this.baseUrl + "getUserinfo.php",
          method: "get",
          params: {
            userid: this.otheruser,
          },
        }).then((res) => {
          console.log("userinfo", res);
          if (res.data.code == 200) {
            this.otherUserInfo = res.data.data[0];
          }
        });
      } else {
        axios({
          url: this.baseUrl + "groupList.php",
          method: "get",
          params: {
            groupId: this.contectuser.split("!!!")[1],
          },
        }).then((res) => {
          console.log("groupInfo", res);
          if (res.data.code == 200) {
            res.data.data[0].nickname = res.data.data[0].groupName;
            res.data.data[0].usericon = res.data.data[0].groupicon;
            this.otherUserInfo = res.data.data[0];
          }
        });
      }
    },
    getGroupInfo(id) {
      // var isrepeat = false;
      // if (this.repeatGroupId.indexOf(id) != -1) {
      //   isrepeat = true;
      // } else {
      //   this.repeatGroupId.push(id);
      // }
      return new Promise((resolve, reject) => {
        // if (isrepeat) {
        //   resolve(this.groupMemberInfo);
        // } else {
        axios({
          url: this.baseUrl + "returnGroupM.php",
          method: "get",
          params: {
            groupId: id,
          },
        }).then((res) => {
          if (res) {
            var arr = res.data.data;
            this.groupMemberInfo = arr;
            console.log("群成员头像", arr);
            resolve(arr);
          } else {
            resolve(this.groupMemberInfo);
          }
        });
        // }
      });
    },
    openview(item) {
      console.log(item.id);
      this.$store.commit("SET_TOUSER", item.id);
      this.showGroupMember = false;
    },
    getmessagelist() {
      var id = this.$store.state.userid;
      // var id = 16;
      console.log("getmessagelist中", this.otheruser, this.groupId);
      this.getGroupInfo(this.otheruser.split("!!!")[1]).then((ress) => {
        axios({
          url: this.baseUrl + "getAllMessage.php",
          method: "get",
          params: {
            userid: id,
          },
        }).then((res) => {
          var message = [];
          if (res.data.code == 200) {
            res.data.data.forEach((item) => {
              if (item.to_userid == 0) {
                if (item.groupId == this.otheruser.split("!!!")[1]) {
                  // this.getGroupInfo(item.groupId).then((res) => {
                  //   console.log("群组消息Promise", res);
                  //   if (res != undefined) {
                  //     res.forEach((ite) => {
                  //       if (ite.id == item.from_userid) {
                  //         item.from_userName = ite.nickname;
                  //         item.from_userIcon = ite.usericon;
                  //       }
                  //     });
                  //     message.push(item);
                  //   }
                  // });
                  ress.forEach((ite) => {
                    if (ite.id == item.from_userid) {
                      item.from_userName = ite.nickname;
                      item.from_userIcon = ite.usericon;
                    }
                  });
                  message.push(item);
                }
              } else {
                if (
                  (item.from_userid == id &&
                    item.to_userid == this.otheruser) ||
                  (item.from_userid == this.otheruser && item.to_userid == id)
                ) {
                  message.push(item);
                }
              }
            });
            this.message = message;

            console.log("gusss", this.message);
            // 让滚动条始终在最底部
            this.$nextTick(() => {
              this.$refs.his_message.scrollTop =
                this.$refs.his_message.scrollHeight;
            });
          }
        });
      });
    },
    formatDate,
    emoji(index) {
      console.log("父组件", index);
      var s1 = this.textarea;
      var s2 = this.textarea;
      var len = this.textarea.length;
      this.textarea = "";
      this.textarea =
        s1.substring(0, this.cursorIndex) +
        index +
        s2.substring(this.cursorIndex, len);
      this.showEmoji = false;
    },
    //图片
    filelist(index) {
      console.log("父元素", index);
      var userId = this.$store.state.userid;
      // var userId = 16;
      var to_userId = this.otherUserId;
      var messagetype = 2;
      if (to_userId.indexOf("!!!") != -1) {
        var data = {
          userid: userId,
          groupId: to_userId.split("!!!")[1],
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index,
        };
      } else {
        var data = {
          userid: userId,
          to_userid: to_userId,
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index,
        };
      }
      axios({
        url: this.baseUrl + "sendmessage.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.textarea = "";
          this.getmessagelist();
          this.before_ws_send();
        }
      });
    },
    //视频
    filelist1(index) {
      console.log("父元素", index);

      var userId = this.$store.state.userid;
      // var userId = 16;
      var to_userId = this.otherUserId;
      var messagetype = 3;
      if (to_userId.indexOf("!!!") != -1) {
        var data = {
          userid: userId,
          groupId: to_userId.split("!!!")[1],
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index[0].name,
        };
      } else {
        var data = {
          userid: userId,
          to_userid: to_userId,
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index[0].name,
        };
      }
      axios({
        url: this.baseUrl + "sendmessage.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.textarea = "";
          this.getmessagelist();
          this.before_ws_send();
        }
      });
    },
    //文件
    filelist2(index) {
      console.log("父元素", index);
      var userId = this.$store.state.userid;
      // var userId = 16;
      var to_userId = this.otherUserId;
      var messagetype = 4;
      if (to_userId.indexOf("!!!") != -1) {
        var data = {
          userid: userId,
          groupId: to_userId.split("!!!")[1],
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index[0].name,
          message_name: index[0].name,
        };
      } else {
        var data = {
          userid: userId,
          to_userid: to_userId,
          message_type: messagetype,
          message: this.baseUrl + "upload/" + index[0].name,
          message_name: index[0].name,
        };
      }
      axios({
        url: this.baseUrl + "sendmessage.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.textarea = "";
          this.getmessagelist();
          this.before_ws_send();
        }
      });
    },
    handleInputBlur(e) {
      this.cursorIndex = e.srcElement.selectionStart;
    },
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },
    activateEv(index) {
      console.log("activateEv" + index);
      this.$refs["drag-input"].focus();
    },
    screen() {
      var yourImgDom = this.$refs.yourImgDom;
      console.log(yourImgDom);
      desktopCapturer
        .getSources({
          types: ["screen"],
          thumbnailSize: { width: 1920, height: 1080 }, //实际屏幕尺寸可以通过主进程的screen模块获得
        })
        .then((imgs) => {
          yourImgDom.src = imgs[0].thumbnail.toDataURL();
          ipcRenderer.invoke("showWindow"); //屏幕拍照完成后，再显示这个窗口，不然它也会被拍进去
        });
    },
    //计算间隔时间
    renderMessageDate(message, index) {
      var messageTime = new Date(parseInt(message.messageTime) * 1000);
      if (index === 0) {
        return this.formatDate(messageTime);
      } else {
        var far_messageTime = new Date(
          parseInt(this.message[index - 1].messageTime) * 1000
        );
        if (messageTime - far_messageTime > 5 * 60 * 1000) {
          return this.formatDate(messageTime);
        }
      }
      return "";
    },
    openimg(data, type) {
      if (type == "video") {
        var options = {
          type: "video",
          data: data,
        };
        localStorage.setItem("type", "video");
      } else if (type == "img") {
        var options = {
          type: "img",
          data: data,
        };
        localStorage.setItem("type", "img");
      }
      localStorage.setItem("data", data);
      ipcRenderer.send("newwindow", JSON.stringify(options));
    },
    sendmessage() {
      var userId = this.$store.state.userid;
      // var userId = 16;
      var to_userId = this.otherUserId;
      var message = this.textarea;
      var messagetype = 1;
      if (to_userId.indexOf("!!!") != -1) {
        var data = {
          userid: userId,
          groupId: to_userId.split("!!!")[1],
          message_type: messagetype,
          message,
        };
      } else {
        var data = {
          userid: userId,
          to_userid: to_userId,
          message_type: messagetype,
          message,
        };
      }
      axios({
        url: this.baseUrl + "sendmessage.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.textarea = "";
          this.getmessagelist();
          this.before_ws_send();
        }
      });
    },
    showEdit() {
      if (this.otherUserId.indexOf("!!!") != -1) {
        console.log("修改群");
        this.contGroup = true;
      } else {
        console.log("修改个人");
        this.contGroup = false;
      }
      this.showControl = true;
    },
    getfriends() {
      var id = this.$store.state.userid;
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
      setTimeout(() => {
        this.getgrouplist();
      }, 1000);
    },
    getgrouplist() {
      axios({
        url: this.baseUrl + "groupList.php",
        method: "get",
        params: {
          groupId: this.contectuser.split("!!!")[1],
        },
      }).then((res) => {
        if (res.data.code == 200) {
          var list = res.data.data[0].memberUser.split(";");
          var after = JSON.parse(JSON.stringify(this.afterSortList));
          list.forEach((item) => {
            this.afterSortList.forEach((ite, index) => {
              ite.list.forEach((itt, ind) => {
                if (item != "") {
                  if (item == itt.id) {
                    this.$delete(after[index].list, ind);
                  }
                }
              });
            });
          });

          after.forEach((item, index) => {
            if (item.list.length == 0) {
              this.$delete(after, index);
            }
          });
          after.forEach((item, index) => {
            if (item.list.length == 0) {
              this.$delete(after, index);
            }
          });
          this.afterSortList = after;
        }
        this.showAddMember = true;
      });
    },
    editGroupMember() {
      this.getfriends().then((res) => {
        console.log("初始化", res);
        setTimeout(() => {
          this.getFirst(res);
        }, 200);
      });
    },
    showGroupMembers() {
      var groupId = this.$store.state.contectuser.split("!!!")[1];
      axios({
        url: this.baseUrl + "returnGroupM.php",
        method: "get",
        params: {
          groupId,
        },
      }).then((res) => {
        this.groupMembersList = res.data.data;
        this.showGroupMember = true;
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
    delSelect(index, oin) {
      this.checkUser.splice(index, 1);
      const list = this.checkList.filter((item) => {
        return item != oin;
      });
      this.checkList = list;
      console.log(list);
    },
    closeWindow() {
      this.showAddMember = false;
    },
    addGroup() {
      var str = "";
      this.checkUser.forEach((item) => {
        str += item.id + ";";
      });
      console.log(str);
      axios({
        url: this.baseUrl + "addGroupMem.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          id: this.contectuser.split("!!!")[1],
          member: str,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          this.msg = "添加成功";
          this.show_success = true;
          setTimeout(() => {
            this.closeWindow();
          }, 500);
        } else {
          this.msg = "添加失败";
          this.show_err = true;
          setTimeout(() => {
            this.closeWindow();
          }, 500);
        }
      });
    },
  },
};
</script>

<style scoped>
.messagebody {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bodyname {
  width: calc(100% -20px);
  height: 40px;
  text-align: left;
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 40px;
  /* background-color: #eee; */
  border-bottom: 1px solid #d6d6d6;
}
.otherControl {
  width: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}
.otherControl > img {
  width: 20px;
}
.his_message {
  height: calc(100% - 200px);
  width: 100%;
  overflow: auto;
  background-color: #f5f5f5;
}
.send_message {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  border-top: 1px solid #d6d6d6;
}
/deep/ .el-textarea__inner {
  width: 100%;
  height: 92%;
  resize: none;
  border: none !important;
  background-color: #f5f5f5;
}
.textar {
  width: 100% !important;
  height: calc(100% - 130px) !important;
  overflow: auto;
  background-color: #f5f5f5;
  z-index: 99;
}
/deep/.el-textarea__inner::-webkit-scrollbar {
  width: 10px;
}
/deep/.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d2d2d2;
}
/deep/.el-textarea__inner::-webkit-scrollbar-button {
  width: 10px;
  border-radius: 50%;
  background: black;
  display: none;
}
.drag_top {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  border-top: 1px solid red;
  cursor: n-resize;
}
.action-bar {
  display: flex;
  flex-direction: row;
  padding: 0 10px;
}

.action-bar .action-item {
  text-align: left;
  padding: 10px 0;
  position: relative;
}

.action-bar .action-item .iconfont {
  font-size: 22px;
  margin: 0 10px;
  z-index: 3;
  color: #606266;
  cursor: pointer;
}

.action-bar .action-item .iconfont:focus {
  outline: none;
}

.action-bar .action-item .iconfont:hover {
  color: #d02129;
}

.emoji-box {
  width: 210px;
  position: absolute;
  top: -111px;
  left: -11px;
  z-index: 2007;
  background: #fff;
  border: 1px solid #ebeef5;
  padding: 12px;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  border-radius: 4px;
}

.emoji-item {
  width: 38px;
  height: 38px;
  margin: 0 2px;
}

.input-box {
  padding: 0 10px;
  flex: 1;
}

.input-content {
  border: none;
  resize: none;
  display: block;
  padding: 5px 15px;
  box-sizing: border-box;
  width: 100%;
  color: #606266;
  outline: none;
  background: #ffffff;
  word-break: break-all;
}

.send-box {
  padding: 5px 10px;
  text-align: right;
}
.send-button {
  width: 70px;
  height: 30px;
  font-size: 15px;
  border: 1px solid #d02129;
  background-color: #ffffff;
  color: #d02129;
  border-radius: 5px;
}

.action-popup {
  width: 850px;
  height: 100%;
  position: absolute;
  top: 0;
  left: -281px;
  background: rgba(51, 51, 51, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-popup-main {
  width: 150px;
  height: 120px;
  background: #ffffff;
  z-index: 100;
  border-radius: 10px;
  overflow: hidden;
}

.action-popup-main .action-item {
  text-align: center;
  line-height: 40px;
  font-size: 15px;
  color: #262628;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
}

.image-preview {
  max-width: 750px;
  max-height: 500px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
}

.image-preview img {
  max-width: 750px;
  max-height: 500px;
}

.image-preview .close {
  font-size: 50px;
  line-height: 24px;
  cursor: pointer;
  color: #ffffff;
  position: absolute;
  top: 10px;
  right: 5px;
  z-index: 1002;
}

.emojibox {
  position: absolute;
  top: -320px;
}
.sendbtn {
  width: 70px;
  height: 30px;
  float: right;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
  color: #0cd16b;
  font-size: 14px;
  background-color: #e9e9e9;
  cursor: pointer;
}
.senduser {
  display: flex;
  width: calc(100% - 20px);
  justify-content: flex-start;
  flex-direction: row-reverse;
  padding: 0 10px 0 10px;
  height: auto;
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
}
.sendeduser {
  position: relative;
  display: flex;
  float: left;
  width: calc(100% - 20px);
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 10px 0 10px;
}
.from_avatar {
  margin-left: 10px;
}
.to_avatar {
  margin-right: 10px;
}
.from_message {
  width: auto;
  max-width: 80%;
  height: auto;
  padding: 10px;
  background-color: #95ec69;
  border-radius: 5px;
  /* z-index: 2; */
  text-align: left;
}
.to_message {
  width: auto;
  height: auto;
  padding: 10px;
  background-color: #fff;
  /* z-index: 2; */
  border-radius: 5px;
}
.to_message2 {
  width: auto;
  height: auto;
  padding: 10px;
  background-color: #fff;
  /* z-index: 2; */
  border-radius: 5px;
  margin-top: 12px;
}
.bottom_arrow_send {
  position: absolute;
  right: 45px;
  top: 8px;
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
  background-color: #95ec69;
  z-index: 1;
}
.bottom_arrow_to {
  position: absolute;
  left: 55px;
  top: 8px;
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
  background-color: #fff;
  z-index: 1;
}
.bottom_arrow_to2 {
  position: absolute;
  left: 55px;
  top: 19px;
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
  background-color: #fff;
  z-index: 1;
}
.kong {
  width: 100%;
  height: 10px;
  background-color: #f5f5f5;
}

/deep/.his_message::-webkit-scrollbar {
  width: 10px;
}
/deep/.his_message::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #d2d2d2;
}
/deep/.his_message::-webkit-scrollbar-button {
  width: 10px;
  border-radius: 50%;
  background: black;
  display: none;
}
.imgmessage > img {
  max-width: 200px;
}
.imgmessage > video {
  max-width: 200px;
}
.imgmessage {
  display: flex;
  position: relative;
}
.imgmessage2 {
  display: flex;
  position: relative;
  margin-top: 15px;
}

.imgmessage2 > img {
  max-width: 200px;
}
.imgmessage2 > video {
  max-width: 200px;
}
.pause_btn {
  position: absolute;
  width: 50px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.content-file {
  width: 240px;
  height: 65px;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.content-file:hover {
  background: #f1f1f1;
}
.content-file2 {
  width: 240px;
  height: 65px;
  font-size: 15px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.content-file2:hover {
  background: #f1f1f1;
}
.file-info {
  width: 194px;
  text-align: left;
}

.file-name {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.file-size {
  font-size: 12px;
  color: #ccc;
}

.file-img {
  width: 50px;
  height: 50px;
}
.timestamp {
  color: #7f7f7f;
  font-size: 12px;
}
.groupMemName {
  position: absolute;
  left: 55px;
  top: -5px;
  font-size: 12px;
}
.hidden {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cotBody {
  width: 200px;
  min-height: 100px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.cotItem {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 15px;
  cursor: pointer;
}
.cotItem2 {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: 15px;
  cursor: pointer;
}
.editgroupmember {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.groupmembers {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainbody {
  width: 60%;
  min-height: 200px;
  display: flex;
  padding: 20px;
  z-index: 99999;
  background-color: #fff;
}
.mainbody2 {
  min-width: 200px;
  max-width: 400px;
  min-height: 200px;
  display: flex;
  padding: 20px;
  z-index: 99999;
  background-color: #fff;
  position: relative;
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
  width: 500px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.checkUserCon {
  width: 50px;
  height: 60px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.checkUserCon2 {
  width: 50px;
  height: 60px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  cursor: pointer;
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
  z-index: 99999999;
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
  z-index: 99999999;
}

/deep/ .el-input__inner {
  width: 100%;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  margin-top: 20px;
  float: left;
}
.closeshowmem {
  position: absolute;
  right: 8px;
  top: 0;
  font-size: 20px;
  cursor: pointer;
}
</style>