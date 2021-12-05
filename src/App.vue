<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <HelloWorld/> -->

    <!-- header -->
    <Header :poiInfo="poiInfo" />
    <!-- nav -->
    <Nav :commentNum="commentNum" />
    <!-- content -->

    <!-- 失活的组件将会被缓存！,避免多次發request & 重新create-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import Header from "./components/Header/Header";
import Nav from "./components/Nav/Nav";

export default {
  name: "App",
  components: {
    // HelloWorld
    Header,
    Nav
  },
  data() {
    return {
      poiInfo: {},
      commentNum: 0
    };
  },
  created() {
    let that = this;

    //發起async 數據請求
    this.$axios
      .get("/api/goods")
      .then(res => {
        // console.log(res);
        const dataSourse = res.data;
        if (dataSourse.code === 0) {
          that.poiInfo = dataSourse.data.poi_info;

          // console.log(dataSourse.data.poi_info);
        }
      })
      .catch(error => {
        console.log(error);
      });

    //發起async 數據請求
    this.$axios
      .get("/api/ratings")
      .then(res => {
        // console.log(res);
        const dataSourse = res.data;
        if (dataSourse.code === 0) {
          that.commentNum = dataSourse.data.comment_num;
          //console.log(that.commentNum)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style>
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
