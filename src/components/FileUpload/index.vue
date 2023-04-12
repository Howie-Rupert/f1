<template>
  <div class="video-upload-com">
    <el-upload
      :action="uploadUrl"
      :before-upload="beforeAvatarUpload"
      :file-list="mediaList"
      :on-success="handleSuccess"
      :show-file-list="false"
      :on-exceed="exceedTips"
      :limit="999999999"
      :on-remove="handleRemove"
    >
      <i class="iconfont icon-wj-wjj" title="文件"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  componentName: "FileUpload",
  data() {
    return {
      mediaUrl: null,
      mediaList: [],
      uploadUrl: null,
      playTime: 0,
      videoSize: 0,
      videoWidth: 0,
      videoHeight: 0,
    };
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    tips: {
      type: String,
      default: "仅支持上传mp4或者MP4文件（限制50M以内）",
    },
    limitSize: {
      type: Number,
      default: 120,
    },
    busiType: {
      type: Number,
      default: 2,
    },
  },
  components: {},
  created() {
    this.uploadUrl = this.baseUrl + `fileupload.php`; // 上传接口url地址
    if (this.value) {
      this.mediaList = this.value;
    }
  },
  watch: {
    value(val) {
      this.mediaList = this.value;
    },
  },
  mounted() {},
  methods: {
    exceedTips(file, fileList) {
      this.$message(`最多上传${fileList.length}个文件！`);
    },
    // 移除分享图片
    handleRemove(file, fileList) {
      this.mediaList = [];
      this.$emit("input", []);
    },
    handleSuccess(res, file, fileList) {
      console.log(res);
      if (res.code == 200) {
        this.$emit("input", [
          {
            name: res.newname,
          },
        ]);
      } else {
      }
    },
    beforeAvatarUpload(file) {
      // var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      // const extension =
      //   testmsg === "mp4" || testmsg === "MP4" || testmsg === "png";
      // const size = file.size / 1024 / 1024;
      // this.videoSize = size;
      // const isLimitM = size < this.limitSize;
      // if (!extension) {
      //   this.$message.error("视频格式不正确，仅支持 mp4");
      // }
      // if (!isLimitM) {
      //   this.$message.error(`上传视频大小不能超过${this.limitSize}MB!`);
      // }
      // if (extension && isLimitM) {
      //   // 获取视频时长
      //   const videoUrl = URL.createObjectURL(file);
      //   const videoObj = document.createElement("video");
      //   videoObj.onloadedmetadata = () => {
      //     URL.revokeObjectURL(videoUrl);
      //     // console.log('当前视频长度', videoObj.duration, videoObj.videoWidth, videoObj.videoHeight)
      //     this.playTime = videoObj.duration; // 视频时长
      //     this.videoWidth = videoObj.videoWidth; // 视频宽度
      //     this.videoHeight = videoObj.videoHeight; // 视频高度
      //     // 执行上传的方法，获取外网路径，上传进度等
      //     // resolve(videoObj)
      //   };
      //   videoObj.src = videoUrl;
      //   videoObj.load();
      // }
      // // 获取文件大小
      // return isLimitM && extension;
    },
  },
};
</script>

<style lang='less'>
.video-upload-com {
  .video .el-upload-list {
    width: 326px;
    padding-left: 157px;
  }
  .el-upload-list__item {
    margin: 0 8px 0 0;
  }
  .el-upload-list__item-status-label {
    right: -24px;
    line-height: 0px;
    // text-align: left;
    i {
      position: relative;
      top: 0px;
      left: -6px;
    }
  }
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