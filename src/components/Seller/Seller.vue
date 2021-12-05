<template>
  <div class="seller">
    <div class="seller-wrapper" ref="sellerView">
      <Split></Split>
      <div class="seller-view">
        <div class="address-wrapper">
          <div class="address-left">
            {{ seller.address }}
          </div>
          <div class="address-right">
            <div class="content"></div>
          </div>
        </div>

        <!-- 一定要加 v-if= 判斷"seller.poi_env"存在，不然會報錯thumbnails_url_list is undefined-->
        <div class="pics-wrapper" v-if="seller.poi_env" ref="picsWrapperView">
          <ul class="pics-list" ref="picsList">
            <li
              class="pics-item"
              v-for="(imgUrl, index) in seller.poi_env.thumbnails_url_list"
              :key="index"
              ref="picsItem"
            >
              <img :src="imgUrl" />
            </li>
          </ul>
        </div>
        <div class="safety-wrapper">
          查看食品安全檔案
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
      <Split></Split>
      <div class="tip-wrapper">
        <div class="delivery-wrapper">
          配送服務: {{ seller.app_delivery_tip }}
        </div>
        <div class="shipping-wrapper">配送時間: {{ seller.shipping_time }}</div>
      </div>
      <Split></Split>
      <div class="other-wrapper">
				<div class="server-wrapper">
					商家服務
					<div class="poi-server" v-for="(item,index) in seller.poi_service" :key="index">
						<img :src="item.icon" /> {{item.content}}
					</div>
				</div>
				<div class="discounts-wrapper">
					<div class="discounts-item" v-for="(item,index) in seller.discounts2" :key="index">
						<div class="icon">
							<img :src="item.icon_url" />
						</div>
						<div class="text">
							{{item.info}}
						</div>
					</div>
				</div>
			</div>

    </div>
  </div>
</template>

<script>
import Split from "components/Split/Split";
import BScroll from "@better-scroll/core";

export default {
  data() {
    return {
      seller: {}
    };
  },
  created() {
    let that = this;

    //發起async 數據請求
    this.$axios
      .get("/api/seller")
      .then(res => {
        const dataSourse = res.data;
        if (dataSourse.code === 0) {
          that.seller = dataSourse.data;
          console.log(that.seller);

          that.$nextTick(() => {
            if (that.seller.poi_env.thumbnails_url_list) {
              let imgWidth = that.$refs.picsItem[0].clientWidth;
              let mariginRight = 11;
              let picsWrapperWidth =
                (imgWidth + mariginRight) *
                that.seller.poi_env.thumbnails_url_list.length;

              that.$refs.picsList.style.width = picsWrapperWidth + "px";

              this.picsWrapperScroll = new BScroll(that.$refs.picsWrapperView, {
                scrollX: true
              });
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  components: {
    Split,
    BScroll
  }
};
</script>

<style scoped>
@import url("./../../common/style/icon.css");
.seller {
  position: absolute;
  left: 0;
  top: 191px;
  bottom: 0px;
  width: 100%;
  background: #f4f4f4;
  overflow: hidden;
}

.seller .seller-wrapper {
  background: white;
}

.seller .seller-wrapper .seller-view {
  padding-left: 15px;
}

.seller .seller-wrapper .seller-view .address-wrapper {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .seller-view .address-wrapper .address-left {
  flex: 1;
  background: url(address.png) no-repeat left center;
  padding-left: 26px;
  padding-right: 31px;
  background-size: 14px 16px;
  font-size: 14px;
  line-height: 19px;
}

.seller .seller-wrapper .seller-view .address-wrapper .address-right {
  flex: 0 0 60px;
  background: url(line.png) no-repeat left center;
  background-size: 1px 15px;
}

.seller .seller-wrapper .seller-view .address-wrapper .address-right .content {
  width: 100%;
  height: 100%;
  background: url(phone.png) no-repeat center center;
  background-size: 18px 18px;
}

.seller .seller-wrapper .seller-view .pics-wrapper {
  padding: 10px 0;
  overflow: hidden;
  border-bottom: 1px solid #f4f4f4;
  white-space: nowrap;
}

/* .seller .seller-wrapper .seller-view .pics-wrapper .pics-list{
  display: flex;
} */

.seller .seller-wrapper .seller-view .pics-wrapper .pics-list .pics-item {
  display: inline-block;
  margin-right: 11px;
  width: 93px;
  height: 75px;
}

.seller .seller-wrapper .seller-view .pics-wrapper .pics-list .pics-item img {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

.seller .seller-wrapper .seller-view .safety-wrapper {
  padding: 15px 14px 15px 25px;
  background: url(safety.png) no-repeat left center;
  background-size: 14px 16px;
  font-size: 14px;
}

.seller .seller-wrapper .seller-view .safety-wrapper span {
  float: right;
  font-size: 14px;
}

.seller .seller-wrapper .tip-wrapper {
  padding-left: 15px;
}

.seller .seller-wrapper .tip-wrapper .delivery-wrapper {
  background: url(delivery.png) no-repeat left center;
  background-size: 14px 16px;
  padding: 15px 0 15px 25px;
  font-size: 14px;
  border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .tip-wrapper .shipping-wrapper {
  background: url(time.png) no-repeat left center;
  padding: 15px 17px 15px 25px;
  background-size: 15px 15px;
  font-size: 14px;
  line-height: 18px;
}

.seller .seller-wrapper .other-wrapper {
  padding-left: 15px;
}

.seller .seller-wrapper .other-wrapper .server-wrapper {
  background: url(server.png) no-repeat left center;
  background-size: 15px 15px;
  padding: 15px 0 17px 25px;
  font-size: 14px;
  border-bottom: 1px solid #f4f4f4;
}

.seller .seller-wrapper .other-wrapper .server-wrapper .poi-server {
  display: inline-block;
  margin-left: 17px;
}

.seller .seller-wrapper .other-wrapper .server-wrapper .poi-server img {
  width: 15px;
  height: 15px;
  margin-right: 6px;
  vertical-align: middle;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper {
  padding: 17px 24px 19px 0;
}

.seller .seller-wrapper .other-wrapper .discounts-wrapper .discounts-item {
  display: flex;
}

.seller
  .seller-wrapper
  .other-wrapper
  .discounts-wrapper
  .discounts-item
  .icon {
  flex: 0 0 25px;
}

.seller
  .seller-wrapper
  .other-wrapper
  .discounts-wrapper
  .discounts-item
  .icon
  img {
  width: 15px;
  height: 15px;
}

.seller
  .seller-wrapper
  .other-wrapper
  .discounts-wrapper
  .discounts-item
  .text {
  flex: 1;
  font-size: 14px;
}
</style>
