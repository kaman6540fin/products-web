<template>
  <div class="nav">
    <!-- <div class="goods  nav-item">
      點餐
    </div>
    <div class="ratings nav-item">
      評價
    </div>
    <div class="seller nav-item">
      店家
    </div> -->

    <router-link to="/goods" class="nav-item">
      點餐
      <i class="line"></i>
    </router-link>
    <router-link to="/ratings" class="nav-item">
      評價({{commentNum}})
      <i class="line"></i>
    </router-link>
    <router-link to="/seller" class="nav-item">
      店家
      <i class="line"></i>
    </router-link>
  </div>
</template>
<script>
export default {
  props:{
    commentNum:{
      type:Number,
      default:0
    }
  }
};
</script>
<style scoped>
.nav {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e4e4e4;
}

.nav .nav-item {
  flex: 1;
  text-align: center;
  font-size: 13px;
  text-decoration: none;
  color: #666666;
  position: relative;
}

/* 选中后的样式*/
.nav .active {
  color: #ffbb22;
}
.nav .active .line {
  width: 20px;
  height: 2px;
  background: #ffbb22;
  display: inline-block;
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-left: -10px;
}
</style>
