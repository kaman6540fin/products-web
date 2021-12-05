<template>
  <div class="goods">
    <!-- 分類列表 -->
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <!-- 專場 -->
        <li
          class="menu-item"
          :class="{ current: currentIndex === 0 }"
          @click="selectMenu(0)"
        >
          <p class="text">
            <img
              :src="container.tag_icon"
              v-if="container.tag_icon"
              class="icon"
            />
            {{ container.tag_name }}
          </p>
        </li>
        <!-- 商品分類 -->
        <li
          class="menu-item"
          v-for="(item, index) in goods"
          :key="index"
          :class="{ current: currentIndex === index + 1 }"
          @click="selectMenu(index + 1)"
        >
          <p class="text">
            <img :src="item.icon" v-if="item.icon" class="icon" />
            {{ item.name }}
          </p>
          <i class="num" v-show="calculateCount(item.spus)" >{{calculateCount(item.spus)}}</i>
        </li>
      </ul>
    </div>
    <!-- 商品列表 -->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!--專場-->
        <li class="container-list food-list-hook">
          <div
            v-for="(item, index) in container.operation_source_list"
            :key="index"
          >
            <img :src="item.pic_url" />
          </div>
        </li>

        <!-- 具體分類 -->
        <li
          class="food-list food-list-hook"
          v-for="(item, index) in goods"
          :key="index"
        >
          <h3 class="title">{{ item.name }}</h3>
          <!-- 具體商品列表 -->
          <ul>
            <li class="food-item" v-for="(food, key) in item.spus" :key="key" @click="showFoodDetail(food)">
              <div class="icon" :style="head_bg(food.picture)"></div>

              <div class="content">
                <h3 class="name">{{ food.name }}</h3>
                <p class="desc" v-if="food.status_description">
                  {{ food.status_description }}
                </p>
                <div class="extra">
                  <span class="saled">{{ food.month_saled_content }}</span>
                  <span class="praise">{{ food.praise_content }}</span>
                </div>
                <img
                  class="product"
                  :src="food.product_label_picture"
                  v-if="food.product_label_picture"
                />
                <!-- v-show為false => display:none; / v-if為false => 整個DOM消失 -->
                <p class="price">
                  <span class="text">${{ food.min_price }}</span>
                  <span class="unit">/{{ food.unit }}</span>
                </p>

                <!-- Cartcontrol -->
                <div class="cartcontrol-wrapper">
                  <!-- 在這裡把food傳給了Cartcontrol-->
                  <Cartcontrol :food="food" ></Cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 在這裏，我們把 selectFoods傳給Shopcart-->
    <Shopcart
      :poiInfo="poiInfo"
      :selectFoods="selectFoods"
    ></Shopcart>

    <Food :food="selectedFood" ref="foodView"></Food>

  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import Shopcart from "components/Shopcart/Shopcart";
import Cartcontrol from "components/Cartcontrol/Cartcontrol";
import Food from "components/Food/Food";

export default {
  data() {
    return {
      container: {},
      goods: [],
      poiInfo: {},
      listHeight: [],
      scrollY: 0,
      menuScroll: {},
      foodScroll: {},
      selectedFood:{}
    };
  },
  created() {
    let that = this;

    //發起async 數據請求
    this.$axios
      .get("/api/goods")
      .then(res => {
        const dataSourse = res.data;
        if (dataSourse.code === 0) {
          (that.container = dataSourse.data.container_operation_source),
            (that.goods = dataSourse.data.food_spu_tags);
          that.poiInfo = dataSourse.data.poi_info;
          console.log(that.container, that.goods, that.poiInfo);

          // 调用滚动的初始化方法
          // that.initScroll();
          // 开始时，DOM元素没有渲染，即高度是问题
          // 在获取到数据后，并DOM已经被渲染，表示列表高度是没问题的
          // nextTick
          that.$nextTick(() => {
            // DOM已经更新
            that.initScroll();
            // 計算分類區間高度
            that.calculateHeight();
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    head_bg(imgName) {
      return "background-image: url(" + imgName + ");";
    },
    initScroll() {
      // ref属性就是用来绑定某个dom元素或某个组件，然后在this.$refs里面
      this.menuScroll = new BScroll(this.$refs.menuScroll, {
        click: true //BetterScroll會默認取消click點擊事件
      });
      this.foodScroll = new BScroll(this.$refs.foodScroll, {
        probeType: 3,
        click: true
      });

      // 添加滾動監聽事件
      this.foodScroll.on("scroll", pos => {
        // Math.abs去絕對值，Math.round 去掉小數
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    calculateHeight() {
      // 通過$refs抓到對應元素
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );

      // 添加陣列區間 0~216 ,217~1243
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodlist.length; i++) {
        let item = foodlist[i];

        // 累加
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index) {
      // 先通過$refs抓到元素
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );

      // 將點到的元素指定給el
      let el = foodlist[index];

      //使用BsScroll的api scrollToElement(el,300) 將foodScroll滾到對應位置
      this.foodScroll.scrollToElement(el, 300);
    },
    calculateCount(spus) {
      let count = 0;

      spus.forEach(food => {
        if (food.count) {
          count += food.count;
        }
      });
      return count;
    },
    showFoodDetail(food){
      this.selectedFood = food

      //   父組件可以調用子組件的方法，先用refs抓到food組件，然後調用裡面的方法
      //   處理事件冒泡，點擊新增商品，會觸發showView()方法，在Cartcontrol裡面stop事件冒泡
      this.$refs.foodView.showView()
    }
  },
  computed: {
    //計算屬性，不能傳遞參數
    currentIndex() {
      //根據滾動位置，決定對應的menu
      for (let i = 0; i < this.listHeight.length; i++) {
        //獲取商品區間的範圍
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];

        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          //返回i，表示滑動在上一個區間至下一個區間中
          // console.log(i);
          return i;
        }
      }
      // 都不在區間中，就表示在最上面的區間
      return 0;
    },
    selectFoods() {
      let selectFoods = [];

      // 我們在Cartcontrol把food設置了count值,在這裏吧他forEach出來，然後push到selectFoods陣列中,並回傳
      this.goods.forEach(good => {
        good.spus.forEach(food => {
          if (food.count > 0) {
            selectFoods.push(food);
          }
        });
      });

      return selectFoods;
    }
  },
  components: {
    Shopcart,
    BScroll,
    Cartcontrol,
    Food
  }
};
</script>

<style scoped>
.goods {
  display: flex;

  /* 通过该方式确定高度*/
  position: absolute;
  top: 190px;
  bottom: 51px;

  overflow: hidden;
  width: 100%;
}

/*
 flex: flex-grow | flex-shrink | flex-basis;
 // flex-grow必选，其余可选
 默认: flex 0 1 auto;
 flex-grow: 定义放大比例，默认是0，如果存在剩余空间，也不放大；
 flex-shrink: 定义缩小比例，默认1，如果空间不足，该项目将会被缩小，flex-shrink属性为0时，其他项目为1，则空间不足时，前者不缩小；
 flex-basis: 定义了在分配多余空间之前，项目占据主轴空间。浏览器根据这个属性，计算占据是否有多余空间。
 			 默认值是auto，即项目的本来大小，设为跟width或height属性值一样，则项目占据固定空间;
 */

.goods .menu-wrapper {
  flex: 0 0 85px;
  background: #f4f4f4;
}
.goods .menu-wrapper .menu-item {
  padding: 16px 23px 15px 10px;
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}
.goods .menu-wrapper .menu-item.current {
  background: white;
  font-weight: bold;
  margin-top: -1px;
}
.goods .menu-wrapper .menu-item:first-child.current {
  margin-top: 1px;
}
.goods .menu-wrapper .menu-item .text {
  font-size: 13px;
  color: #333333;
  line-height: 17px;
  vertical-align: middle;

  /* 多行显示省略号，使用WebKit的CSS扩展属性，适用方位Webkit浏览器以及移动端*/

  /* 用来显示一个块元素显示的文本行数*/
  -webkit-line-clamp: 2;
  /* 必须，将对象作为弹性伸缩盒子模型显示*/
  display: -webkit-box;
  /* 必须，设置或检索伸缩盒子的子元素排列方式*/
  -webkit-box-orient: vertical;

  overflow: hidden;
}
.goods .menu-wrapper .menu-item .text .icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}
.goods .menu-wrapper .menu-item .num {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  color: white;
  background: red;
  text-align: center;
  font-size: 7px;
  line-height: 13px;
}

.goods .foods-wrapper {
  flex: 1;
  /*background: blue;*/
}

.goods .foods-wrapper .container-list {
  padding: 11px 11px 0 11px;
  border-bottom: 1px solid #e4e4e4;
}
.goods .foods-wrapper .container-list img {
  width: 100%;
  margin-bottom: 11px;
  border-radius: 5px;
}

.goods .foods-wrapper .food-list {
  padding: 11px;
}
.goods .foods-wrapper .food-list .title {
  height: 13px;
  font-size: 13px;
  background: url(btn_yellow_highlighted@2x.png) no-repeat left center;
  background-size: 2px 10px;
  padding-left: 7px;
  margin-bottom: 12px;
}

.goods .foods-wrapper .food-list .food-item {
  display: flex;
  margin-bottom: 25px;
  position: relative;
}
.goods .foods-wrapper .food-list .food-item .icon {
  flex: 0 0 63px;
  background-position: center;
  background-size: 120% 100%;
  background-repeat: no-repeat;
  margin-right: 11px;
  height: 75px;
}
.goods .foods-wrapper .food-list .food-item .content {
  flex: 1;
}
.goods .foods-wrapper .food-list .food-item .content .name {
  font-size: 16px;
  line-height: 21px;
  color: #333333;
  margin-bottom: 10px;
  padding-right: 27px;
}
.goods .foods-wrapper .food-list .food-item .content .desc {
  font-size: 10px;
  line-height: 19px;
  color: #bfbfbf;
  margin-bottom: 8px;

  /* 超出部分显示省略号*/
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods .foods-wrapper .food-list .food-item .content .extra {
  font-size: 10px;
  color: #bfbfbf;
  margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled {
  margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product {
  height: 15px;
  margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price {
  font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text {
  font-size: 14px;
  color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit {
  font-size: 12px;
  color: #bfbfbf;
}

.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
