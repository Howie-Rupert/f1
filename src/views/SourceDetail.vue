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
  mounted() {
    var data = localStorage.getItem("data");
    this.type = localStorage.getItem("type");
    if (this.type == "img") {
      this.url = [data];
    } else if (this.type == "video") {
      this.src = data;
    }
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