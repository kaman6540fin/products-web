<template>
  <div class="ratings" ref="ratingsView">
    <div class="ratings-wrapper">
      <div class="overview">
        <div class="overview-left">
          <div class="comment-score">
            <p class="score">{{ ratings.comment_num }}</p>
            <p class="text">商家評分</p>
          </div>
          <div class="other-score">
            <div class="quality-score item">
              <span class="text">口味</span>
              <Star :score="ratings.quality_score" class="star"></Star>
              <span class="score">{{ ratings.quality_score }}</span>
            </div>
            <div class="pack-score item">
              <span class="text">包裝</span>
              <Star :score="ratings.pack_score" class="star"></Star>
              <span class="score">{{ ratings.pack_score }}</span>
            </div>
          </div>
        </div>
        <div class="overview-right">
          <div class="delivery-score">
            <p class="score">{{ ratings.delivery_score }}</p>
            <p class="text">配送評分</p>
          </div>
        </div>
      </div>

      <Split></Split>

      <div class="content">
        <div class="rating-select" v-if="ratings.tab">
          <!-- 當點擊觸發selectedFn，將參數0賦給selected，透過selected來判斷active的元素-->
          <span
            class="item"
            @click="selectedFn(0)"
            :class="{ active: selected === 0 }"
          >
            {{ ratings.tab[0].comment_score_title }}
          </span>
          <span
            class="item"
            @click="selectedFn(1)"
            :class="{ active: selected === 1 }"
          >
            {{ ratings.tab[1].comment_score_title }}
          </span>
          <span
            class="item"
            @click="selectedFn(2)"
            :class="{ active: selected === 2 }"
          >
            <img src="./icon_sub_tab_dp_normal@2x.png" v-if="selected !== 2" />
            <img
              src="./icon_sub_tab_dp_highlighted@2x.png"
              v-if="selected === 2"
            />
            {{ ratings.tab[2].comment_score_title }}
          </span>
        </div>
        <div class="labels-view">
          <span
            class="item"
            v-for="(label, index) in ratings.labels"
            :key="index"
          >
            {{ label.content }}{{ label.label_count }}
          </span>
        </div>

        <div class="rating-list">
          <ul class="rating-content">
            <li
              class="comment-item"
              v-for="(comment, index) in selectedComments"
              :key="index"
            >
              <div class="comment-header">
                <img :src="comment.user_pic_url" v-if="comment.user_pic_url" />
                <img src="./anonymity.png" v-if="!comment.user_pic_url" />
              </div>
              <div class="comment-main">
                <div class="user">{{ comment.user_name }}</div>
                <div class="time">{{ fotmatDate(comment.comment_time) }}</div>
                <div class="star-wrapper">
                  <span class="text">評分</span>
                  <Star
                    :score="comment.order_comment_score"
                    class="star"
                  ></Star>
                </div>
                <div class="c_content" v-html="highlightStr(comment.comment)"></div>
                <div class="img-wrapper" v-if="comment.comment_pics.length">
                  <img v-for="(pic,index) in comment.comment_pics" :src="pic.thumbnail_url" :key="index">
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Star from "components/Star/Star";
import Split from "components/Split/Split";
import BScroll from "@better-scroll/core";

// 設置選中的狀態
const ALL = 0;
const WITHPICS = 1;
const COMMENT = 2;

export default {
  data() {
    return {
      ratings: {},
      selected: ALL
    };
  },
  created() {
    let that = this;

    this.$axios
      .get("/api/ratings")
      .then(res => {
        // console.log(res);
        const dataSourse = res.data;
        if (dataSourse.code === 0) {
          that.ratings = dataSourse.data;
          console.log(that.ratings);

          //在數據渲染到dom之後，再進行操作
          that.$nextTick(() => {
            if (!this.ratingsViewScroll) {
              this.ratingsViewScroll = new BScroll(that.$refs.ratingsView, {
                click: true
              });
            } else {
              this.ratingsViewScroll.refresh();
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    selectedFn(selectedType) {
      this.selected = selectedType;

      // 刷新操作!!!不加在選擇comment分類時,滾動高度會有問題
				this.$nextTick(() => {
					this.ratingsViewScroll.refresh();
				});
    },
    fotmatDate(time) {
      let date = new Date(time * 1000);

      // 有空回來看2021.12.04
      // 时间格式
      let fmt = "yyyy.MM.dd";

      if (/(y+)/.test(fmt)) {
        // 年
        let year = date.getFullYear().toString();
        fmt = fmt.replace(RegExp.$1, year);
      }
      if (/(M+)/.test(fmt)) {
        // 月
        let mouth = date.getMonth() + 1;
        if (mouth < 10) {
          mouth = "0" + mouth;
        }
        fmt = fmt.replace(RegExp.$1, mouth);
      }
      if (/(d+)/.test(fmt)) {
        // 日
        let mydate = date.getDate();
        if (mydate < 10) {
          mydate = "0" + mydate;
        }
        fmt = fmt.replace(RegExp.$1, mydate);
      }

      return fmt;
    },
    highlightStr(content) {

      // 有空回來看2021.12.04
      let rel = /#[^#]+#/g;

      return content.replace(rel, "<i style='color:#576b95;'>$&</i>");
    }
  },
  computed: {
    selectedComments() {
      if (this.selected === ALL) {
        return this.ratings.comments;
      } else if (this.selected === WITHPICS) {
        let withPicsArray = [];

        this.ratings.comments.forEach((comment) => {
          if (comment.comment_pics.length) {
            withPicsArray.push(comment);
          }
        });
         return withPicsArray;
      } else if (this.selected === COMMENT) {
        return this.ratings.comments_dp.comments;
      }
    }
  },
  components: {
    Star,
    Split,
    BScroll
  }
};
</script>
<style scoped>
.ratings {
  position: absolute;
  left: 0;
  top: 191px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.ratings .ratings-wrapper .overview {
  padding: 20px 0 18px 0;
  display: flex;
}

.ratings .ratings-wrapper .overview .overview-left {
  flex: 1;
  padding-left: 26px;
}

.ratings .ratings-wrapper .overview .overview-left .comment-score {
  float: left;
  width: 48px;
  text-align: center;
  margin-right: 26px;
}

.ratings .ratings-wrapper .overview .overview-left .comment-score .score {
  font-size: 23px;
  font-weight: 800;
  color: #ffb000;
  margin-bottom: 9px;
}

.ratings .ratings-wrapper .overview .overview-left .comment-score .text {
  font-size: 11px;
  color: #666666;
}

.ratings .ratings-wrapper .overview .overview-left .other-score {
  float: left;
  margin-top: 3px;
}

.ratings .ratings-wrapper .overview .overview-left .other-score .item {
  height: 11px;
}

.ratings .ratings-wrapper .overview .overview-left .other-score .item .text {
  font-size: 11px;
  color: #666666;
  margin-right: 11px;
  float: left;
}

.ratings .ratings-wrapper .overview .overview-left .other-score .item .star {
  float: left;
  margin-right: 11px;
}

.ratings .ratings-wrapper .overview .overview-left .other-score .item .score {
  font-size: 11px;
  color: #ffb000;
  float: left;
}

.ratings .ratings-wrapper .overview .overview-left .other-score .quality-score {
  margin-bottom: 14px;
}

.ratings .ratings-wrapper .overview .overview-right {
  flex: 0 0 100px;
  text-align: center;
  border-left: 1px solid #9d9d9d;
}

.ratings .ratings-wrapper .overview .overview-right .delivery-score .score {
  font-size: 19px;
  font-weight: 500;
  color: #999999;
  margin-bottom: 10px;
  margin-top: 3px;
}

.ratings .ratings-wrapper .overview .overview-right .delivery-score .text {
  font-size: 11px;
  color: #999999;
}

.ratings .ratings-wrapper .content {
  padding: 16px;
}

.ratings .ratings-wrapper .content .rating-select {
  width: 100%;
  box-sizing: border-box;
  font-size: 0;
  border: 1px solid #ffb000;
  border-right: 0;
  margin-bottom: 11px;
  border-radius: 3px;
}

.ratings .ratings-wrapper .content .rating-select .item {
  width: 33.3%;
  display: inline-block;
  height: 33px;
  line-height: 33px;
  font-size: 14px;
  text-align: center;
  border-right: 1px solid #ffb000;
  box-sizing: border-box;
  color: #ffb000;
}

.ratings .ratings-wrapper .content .rating-select .item:last-child img {
  height: 14px;
  vertical-align: middle;
}

.ratings .ratings-wrapper .content .rating-select .item.active {
  background: #ffb000;
  color: black;
}

.ratings .ratings-wrapper .content .labels-view .item {
  display: inline-block;
  height: 27px;
  line-height: 27px;
  padding: 0 10px;
  font-size: 12px;
  background: #f4f4f4;
  margin-right: 6px;
  margin-bottom: 6px;
  border-radius: 3px;
  color: #999999;
}

.ratings .ratings-wrapper .content .labels-view .item.highligh {
  color: #656565;
}

.ratings .ratings-wrapper .content .rating-list .comment-item {
  padding: 16px 16px 16px 0;
  border-bottom: 1px solid #f4f4f4;
  width: 100%;
  box-sizing: border-box;
  display: flex;
}

.ratings .ratings-wrapper .content .rating-list .comment-item .comment-header {
  flex: 0 0 35px;
  margin-right: 11px;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-header
  img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main {
  flex: 1;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .user {
  width: 50%;
  float: left;
  font-size: 11px;
  color: #333333;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .time {
  width: 50%;
  float: right;
  text-align: right;
  font-size: 9px;
  color: #666666;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .star-wrapper {
  float: left;
  margin-top: 12px;
  margin-bottom: 15px;
  width: 100%;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .star-wrapper
  .text {
  color: #999999;
  font-size: 11px;
  float: left;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .star-wrapper
  .star {
  float: left;
  margin-left: 7px;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .c_content {
  font-size: 13px;
  line-height: 19px;
  float: left;
  width: 100%;

}

/* .ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .c_content.span {
  color: #576b95;
} */

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .img-wrapper {
  margin-top: 9px;
  float: left;
}

.ratings
  .ratings-wrapper
  .content
  .rating-list
  .comment-item
  .comment-main
  .img-wrapper
  img {
  width: 175px;
}
</style>
