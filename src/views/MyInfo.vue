<template>
  <div class="userinfobody">
    <drag class="drag" />
    <el-form
      :model="list"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="头像" prop="nickname">
        <img class="preview" :src="list.usericon" alt="" />
        <div class="changeBtn" @click="editAvatar">修改头像</div>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="list.nickname"
          style="width: 80%"
          maxlength="15"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="list.phone" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="签名" prop="slog">
        <el-input
          v-model="list.slog"
          style="width: 80%"
          maxlength="50"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="list.password"
          style="width: 80%"
          type="password"
          maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="edituserinfo">确认修改</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="修改头像" :visible.sync="editAvatarDialog" width="100%">
      <el-row type="flex" justify="center">
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
          ></vueCropper>
        </div>
        <div class="previewBox">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
          <el-row type="flex" justify="center">
            <el-upload
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="uploadImg"
            >
              <el-button size="mini" type="primary"> 更换头像 </el-button>
            </el-upload>
          </el-row>
          <br />
          <el-row>
            <el-button
              icon="el-icon-plus"
              circle
              size="mini"
              @click="changeScale(1)"
            ></el-button>
            <el-button
              icon="el-icon-minus"
              circle
              size="mini"
              @click="changeScale(-1)"
            ></el-button>
            <el-button
              icon="el-icon-download"
              circle
              size="mini"
              @click="down('blob')"
            ></el-button>
            <el-button
              icon="el-icon-refresh-left"
              circle
              size="mini"
              @click="rotateLeft"
            ></el-button>
            <el-button
              icon="el-icon-refresh-right"
              circle
              size="mini"
              @click="rotateRight"
            ></el-button>
          </el-row>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveEditAvatar">确认</el-button>
        <el-button @click="editAvatarDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <div class="big_block" v-show="show_err" @click="show_err = false">
      <div class="dialog">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VueCropper } from "vue-cropper";
import { v4 } from "uuid";
import { ipcRenderer } from "electron";
import drag from "../components/dragchild";

export default {
  components: { drag, VueCropper },
  data() {
    return {
      userId: "",
      list: {},
      list2: {},
      rules: {},
      editAvatarDialog: false,
      previews: {},
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: "png", // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true, // 截图框固定大小
      },
      show_err: false,
      msg: "",
    };
  },
  mounted() {
    console.log("vuex", this.$store);
    console.log(this.$store.state);
    var that = this;
    ipcRenderer.on("getUserid", function (event, data) {
      console.log("ipc", data);
      that.userId = data;
      that.getuser();
    });
    // this.userId = localStorage.getItem('userid')
  },
  methods: {
    getuser() {
      axios({
        url: "http://150.158.84.153/getUserinfo.php",
        method: "get",
        params: {
          userid: this.userId,
          // userid: 16,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.list = res.data.data[0];
          this.list2 = JSON.parse(JSON.stringify(res.data.data[0]));
        }
      });
    },
    editAvatar() {
      this.editAvatarDialog = true;
      this.option.img = this.list.usericon;
    },
    saveEditAvatar() {
      this.editAvatarDialog = false;
      this.finish("blob");
    },
    // 放大/缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 保存上传图片
    finish(type) {
      if (type === "blob") {
        this.$refs.cropper.getCropBlob((data) => {
          this.avatarURL = window.URL.createObjectURL(data);
          //访问接口保存到数据库写这儿!
          var pic = new Image();
          pic.src = this.avatarURL;
          var that = this;
          pic.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = pic.width;
            canvas.height = pic.height;
            canvas.getContext("2d").drawImage(pic, 0, 0);
            var src = canvas.toDataURL("image/webp");
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
            var ff = new File([theBlob], v4() + ".webp", {
              type: theBlob.type,
              lastModified: Date.now(),
            });
            const formData = new FormData();
            formData.append("file", ff);
            axios({
              method: "post",
              url: "http://150.158.84.153/fileupload.php",
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            })
              .then((res) => {
                console.log("upLoadFile======", res.data);
                that.list.usericon =
                  "http://150.158.84.153/upload/" + res.data.newname;
              })
              .catch((err) => {
                console.log(err);
              });
          };
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          //访问接口保存到数据库写这儿!
          var pic = new Image();
          pic.src = this.avatarURL;
          var that = this;
          pic.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = pic.width;
            canvas.height = pic.height;
            canvas.getContext("2d").drawImage(pic, 0, 0);
            var src = canvas.toDataURL("image/webp");
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
            var ff = new File([theBlob], v4() + ".webp", {
              type: theBlob.type,
              lastModified: Date.now(),
            });
            const formData = new FormData();
            formData.append("file", ff);
            axios({
              method: "post",
              url: "http://150.158.84.153/fileupload.php",
              data: formData,
              headers: { "Content-Type": "multipart/form-data" },
            })
              .then((res) => {
                console.log("upLoadFile======", res.data);
                that.list.usericon =
                  "http://150.158.84.153/upload/" + res.data.newname;
              })
              .catch((err) => {
                console.log(err);
              });
          };
        });
      }
    },

    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    // 下载图片
    down(type) {
      var aLink = document.createElement("a");
      aLink.download = "author-img";
      if (type === "blob") {
        this.$refs.cropper.getCropBlob((data) => {
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          aLink.href = data;
          aLink.click();
        });
      }
    },
    // 更换头像--上传本地图片
    uploadImg(file) {
      console.log(file);
      var _this = this;
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        _this.option.img = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file.raw)
      // 转化为blob
      reader.readAsArrayBuffer(file.raw);
    },

    edituserinfo() {
      console.log(this.list2.password);
      console.log(this.list.password);
      console.log(this.list.password.length < 8);
      if (Number(this.list.password.length) < Number(8)) {
        console.log("少于8位");
        this.msg = "密码最少为8位！";
        this.show_err = true;
        setTimeout(() => {
          this.show_err = false;
        }, 2000);
        return;
      } else {
        if (this.list.password == this.list2.password) {
          var data = {
            id: this.userId,
            // id: 16,
            nickname: this.list.nickname,
            usericon: this.list.usericon,
            phone: this.list.phone,
            slog: this.list.slog,
          };
        } else {
          var data = {
            id: this.userId,
            // id: 16,
            nickname: this.list.nickname,
            usericon: this.list.usericon,
            phone: this.list.phone,
            slog: this.list.slog,
            password: this.list.password,
          };
        }

        axios({
          url: "http://150.158.84.153/edituserinfo.php",
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          data,
        }).then((res) => {
          if (res.data.code == 200) {
            this.$Message({
              message: "修改成功",
              type: "success",
            });
            this.getuser();
            localStorage.setItem("haschange", 1);
            ipcRenderer.send("message", "Hello from renderer process!");
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.userinfobody {
  width: 100%;
  height: 100%;
  text-align: left;
  overflow: hidden;
}
.changeBtn {
  color: #409eff;
  cursor: pointer;
}
.previewBox {
  text-align: center;
  margin-left: 60px;
}

.preview {
  width: 150px;
  height: 150px;
  margin: 0px auto 20px auto;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #ccc;
  overflow: hidden;
}
.demo-ruleForm {
  margin-top: 60px;
}
.cropper {
  width: 260px;
  height: 260px;
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
.dialog {
  position: absolute;
  min-width: 180px;
  max-width: 220px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fe4c38;
  border-radius: 5px;
  height: 45px;
  color: #fff;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
}
</style>