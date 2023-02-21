<template>
  <div class="messagebody">
    <div class="list_content" v-for="(item, index) in messagelist" :key="index">
      <img class="message_icon" :src="item.img" alt="" />
      <div class="name_message">
        <div>
          {{ item.name }}
        </div>
        <div class="message">
          {{ item.message }}
        </div>
      </div>
      <div class="time_read">
        <div class="sendtime">
          {{ item.time }}
        </div>
        <div class="isread">
          {{ item.isread }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import img1 from "../../static/images/userimg.png";
export default {
  data() {
    return {
      messagelist: [
        {
          img: img1,
          name: "USERNAME",
          message: "message",
          message_type: 0,
          time: "12:17",
          isread: "1",
        },
        {
          img: img1,
          name: "USERNAME",
          message: "message",
          message_type: 0,
          time: "12:17",
          isread: "1",
        },
      ],
    };
  },
};
</script>

<style scoped>
.messagebody {
  width: 100%;
  height: 100%;
}
.list_content {
  display: flex;
  position: relative;
  padding: 10px;
}
.name_message {
  margin-left: 10px;
  text-align: left;
  padding-top: 10px;
}
.message_icon {
  width: 50px;
  height: 50px;
}
.message {
  font-size: 15px;
  color: #b8b7b7;
}
.time_read {
  position: absolute;
  padding-top: 10px;
  right: 10px;
}
.sendtime {
  font-size: 12px;
  color: #b8b7b7;
}
.isread {
  border-radius: 50px;
  background-color: #ff3b30;
  color: #fff;
  width: 20px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  float: right;
  margin-top: 5px;
}
</style>