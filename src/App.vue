<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style>
@import "./assets/iconfont/iconfont.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  outline: none;
  font-size: 20px;
  color: #333;
}
.el-container {
  overflow: hidden !important;
}
</style>
