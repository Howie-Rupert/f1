<template>
  <div class="messagebody">
    <div class="bodyname">
      {{ username }}
    </div>
    <div class="his_message" ref="his_message">
      <div v-for="(item, index) in message">
        <div class="timestamp">{{ renderMessageDate(item, index) }}</div>
        <div class="message_list">
          <div v-if="currentid == item.from_userid" class="senduser">
            <el-avatar
              :size="35"
              :src="circleUrl"
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
                src="../../static/images/pause.png"
                alt=""
              />
            </div>
          </div>
          <div v-else class="sendeduser">
            <el-avatar
              :size="35"
              :src="circleUrl"
              class="to_avatar"
            ></el-avatar>
            <div class="to_message" v-if="item.message_type == 1">
              <div>
                {{ item.message }}
              </div>
              <div class="bottom_arrow_to"></div>
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
                src="../../static/images/pause.png"
                alt=""
              />
            </div>
            <a
              v-if="item.message_type == 4"
              :href="item.message"
              target="_blank"
              download="download"
            >
              <div class="content-file" title="点击下载">
                <div class="file-info">
                  <span class="file-name">{{ item.message_name }}</span>
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
          <VideoUpload for="video-input" @input="filelist"></VideoUpload>
        </div>
        <!-- 文件 -->
        <div class="action-item">
          <label for="file-input">
            <FileUpload for="video-input" @input="filelist"></FileUpload>
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
  </div>
</template>

<script>
import Emoji from "../../components/emoji";
import ImgUpload from "../../components/Imageupload";
import VideoUpload from "../../components/Videoupload";
import FileUpload from "../../components/FileUpload";
import { ipcRenderer, desktopCapturer, BrowserWindow } from "electron";
import { formatDate } from "../../utils/utils";
import img1 from "../../assets/ava.jpg";
import img2 from "../../static/images/img1.png";
import video1 from "../../static/video/01.mp4";
import axios from "axios";
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
      currentid: "16",
      to_userId: "16",
      message: [
        {
          timestamp: 1676447963084,
          from_userid: "16",
          to_userid: "17",
          message_type: "1",
          message: "测试",
          message_name: "",
        },
        {
          timestamp: 1676447963084,
          from_userid: "16",
          to_userid: "17",
          message_type: "2",
          message: img1,
          message_name: "",
        },
        {
          timestamp: 1676447963084,
          from_userid: "17",
          to_userid: "16",
          message_type: "2",
          message: img2,
          message_name: "",
        },
        {
          timestamp: 1676447964084,
          from_userid: "17",
          to_userid: "16",
          message_type: "1",
          message: "测试1",
          message_name: "",
        },
        {
          timestamp: 1676447965084,
          from_userid: "16",
          to_userid: "17",
          message_type: "1",
          message_name: "",
          message:
            "测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2测试2",
        },
        {
          timestamp: 1676448470499,
          from_userid: "16",
          to_userid: "17",
          message_type: "1",
          message: "测试3",
          message_name: "",
        },
        {
          timestamp: 1676448470499,
          from_userid: "17",
          to_userid: "16",
          message_type: "1",
          message: "测试4",
          message_name: "",
        },
        {
          timestamp: 1676448470499,
          from_userid: "17",
          to_userid: "16",
          message_type: "3",
          message: video1,
          message_name: "",
        },
        {
          timestamp: 1676613203431,
          from_userid: "17",
          to_userid: "16",
          message_type: "4",
          message: video1,
          message_name: "download1",
        },
      ],
    };
  },
  mounted() {
    console.log(Date.now());
    this.$nextTick(() => {
      var div = this.$refs.his_message;
      div.scrollTop = div.scrollHeight;
      console.log("scrollHeight", div.scrollHeight);
      console.log("scrolltop", div.scrollTop);
    });
  },

  methods: {
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
    filelist(index) {
      console.log("父元素", index);
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
      if (index === 0) {
        return this.formatDate(message.timestamp);
      } else {
        if (
          message.timestamp - this.message[index - 1].timestamp >
          5 * 60 * 1000
        ) {
          return this.formatDate(message.timestamp);
        }
      }
      return "";
    },
    openimg(data, type) {
      if (type == "video") {
        localStorage.setItem("type", "video");
      } else if (type == "img") {
        localStorage.setItem("type", "img");
      }
      localStorage.setItem("data", data);
      ipcRenderer.send("newwindow");
    },
    sendmessage() {
      var userId = this.$store.state.userid;
      var to_userId = this.to_userId;
      var message = this.textarea;
      var messagetype = 1;
      axios({
        url: "http://www.test.com:8083/sendmessage.php",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "post",
        data: {
          userid: userId,
          to_userid: to_userId,
          message_type: messagetype,
          message: message,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.textarea = "";
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
  line-height: 40px;
  /* background-color: #eee; */
  border-bottom: 1px solid #d6d6d6;
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
  z-index: 2;
  text-align: left;
}
.to_message {
  width: auto;
  height: auto;
  padding: 10px;
  background-color: #fff;
  z-index: 2;
  border-radius: 5px;
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
</style>