<template>
  <div class="demo-image__preview">
    <el-image-viewer
      class="sources"
      v-if="showViewer && type == 'img'"
      :url-list="url"
    />
    <video class="sources" v-if="type == 'video'" :src="src" controls></video>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      url: [],
      showViewer: true,
      type: "",
      src: "",
    };
  },

  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
  },
  beforeMount() {
    var that = this;
    ipcRenderer.on("infomation", function (e, data) {
      var da1 = JSON.parse(data);
      console.log(da1);
      if (da1.type == "img") {
        that.url = [da1.data];
        that.type = da1.type;
        console.log("img", that.url);
      } else if (da1.type == "video") {
        that.type = da1.type;
        that.src = da1.data;
        console.log("b", that.src);
      }
    });
  },
  methods: {},
};
</script>

<style scoped>
.demo-image__preview {
  background-color: black;
}
/deep/.el-image-viewer__close {
  display: none !important;
}
.sources {
  max-height: calc(100vh - 20px);
}
</style>