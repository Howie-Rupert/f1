<template>
  <div class="component-upload-image">
    <el-upload
      multiple
      action=""
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"

      ref="imageUpload"
      :on-remove="handleDelete"
      :http-request="uploadeImage"
      :show-file-list="false"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{ hide: this.fileList.length >= this.limit }"
      accept=".JPG, .PNG, .JPEG,.jpg, .png, .jpeg"
    >
      <i class="iconfont icon-picture" title="图片"></i>
    </el-upload>
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 999999,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["JPG", "PNG", "JPEG","jpg", "png", "jpeg"],
    },
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: this.baseUrl + "fileupload.php", // 上传的图片服务器地址
      fileList: [],
      headers: { "Content-Type": "multipart/form-data" },
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(",");
          // 然后将数组转为对象数组
          this.fileList = list.map((item) => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {},
    uploadeImage(file) {
      console.log(file);
      let isImg = false;
      if (this.fileType.length) {
        let fileExtension = "";
        if (file.file.name.lastIndexOf(".") > -1) {
          fileExtension = file.file.name.slice(
            file.file.name.lastIndexOf(".") + 1
          );
        }
        isImg = this.fileType.some((type) => {
          if (file.file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.file.type.indexOf("image") > -1;
      }

      if (!isImg) {
        // this.$modal.msgError(
        //   `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`
        // );
        return false;
      }
      if (this.fileSize) {
        const isLt = file.file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          //   this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      //   this.$modal.loading("正在上传图片，请稍候...");
      var reader = new FileReader();
      reader.readAsDataURL(file.file);
      let that = this;
      reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
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
          console.log(file);
          var ff = new File([theBlob], file.file.name.split(".")[0] + ".webp", {
            type: theBlob.type,
            lastModified: Date.now(),
          });
          file.file = ff;
          that.getfile(file);
        };
      };

      this.number++;
    },
    getfile(file) {
      this.fileList = []
      console.log("上传接口", file);
      const formData = new FormData();
      if (Array.isArray(file.file)) {
        file.forEach((item) => {
          console.log(item);
          formData.append("file", item);
        });
        console.log(formData);
      } else {
        console.log("fff", file.file);
        formData.append("file", file.file);
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
          this.handleUploadSuccess(res.data, file.file);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 文件个数超出
    handleExceed() {
      //   this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === "200") {
        this.uploadList.push({ name: res.newname, url: res.newname });

        this.uploadedSuccessfully();
      } else {
        this.number--;
        // this.$modal.closeLoading();
        // this.$modal.msgError(res.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file) {
      const findex = this.fileList.map((f) => f.name).indexOf(file.name);
      if (findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("input", this.listToString(this.fileList));
      }
    },
    // 上传失败
    handleUploadError() {
      //   this.$modal.msgError("上传图片失败，请重试");
      //   this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        // this.$modal.closeLoading();
      }
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, "") + separator;
        }
      }
      return strs != "" ? strs.substr(0, strs.length - 1) : "";
    },
  },
};
</script>
  <style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
.iconfont {
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
</style>
  
  