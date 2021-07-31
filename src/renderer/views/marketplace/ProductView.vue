<template>
  <Loading
    :rendered="isReady"
    class="product"
  >
    <ZoomModal
      :is-modal-visible="zoomModalIsActive"
      :image-src="zoomImage"
      @close="closeZoomModal()"
    />
    <div
      class="product__topbar"
    >
      <i
        class="icon-arrow-left2 product__topbar"
        @click="$router.go(-1)"
      />
    </div>
    <div class="product__view">
      <div
        v-if="galleryData.length > 0"
        class="product__gallery"
      >
        <Carousel
          id="product__carousel"
          :media="galleryData"
          :zoom-mode="true"
          :holographic="shouldCardBeHolographic"
          @primaryImageClicked="showZoomModal($event)"
        />
      </div>
      <div class="product__information">
        <div class="product-name">
          {{ productName }}
        </div>
        <div
          v-if="countdown"
          class="product-price-container"
        > 
          <div
            v-if="isDateAvailabeValid"
            class="date-text"
          > 
            Available on {{ dateString }} {{ timeString }} {{ zoneString }}
          </div>
        </div>
        <div
          v-else
          class="product-price-container"
        >
          <div
            v-if="
              productPrice &&
                productPrice > 0
            "
            class="product-price"
          >
            {{ productPrice }}
            <Currency :currency-id="productCurrency" />
          </div>
          <div class="shopping-container">
            <ShoppingWidget
              :id="productId"
              :max="productMaxUnits"
              button-type="button"
            />
          </div>
        </div>
        <Accordion
          :items="accordionItems"
          class="accordion"    
        />
      </div>
    </div>
  </Loading>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import moment from "moment";
import Currency from "../../components/Currency.vue";
import ShoppingWidget from "../../components/shopping/ShoppingWidget.vue";
import store from "../../store";
import Accordion from "../../components/Accordion/Accordion.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import Loading from "../../components/Loading.vue";
import ZoomModal from "../../components/modal/ZoomModal.vue";

export default {
  components: { Accordion, Currency, ShoppingWidget, Carousel, Loading, ZoomModal},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const asset = ref();
    const dateString = ref();
    const timeString = ref();
    const zoneString = ref();
    const accordionItems = ref();
    const tokenPolicyId = ref();
    const countdown = ref(true);
    const resourceType = ref();
    const activeIndex = ref(0);
    const isReady = ref(false);
    const assetDescription = ref();
    const product = ref();
    const productName =ref();
    const galleryData = ref();
    const zoomImage = ref();
    const zoomModalIsActive = ref(false);
    const productPrice = ref(0);
    const productCurrency = ref();
    const productId = ref();
    const productMaxUnits = ref(0);
    const isDateAvailabeValid = ref(false);
    const shouldCardBeHolographic = ref(false);

    async function getResources(){
      const product = await store.dispatch("Products/getProductByproductId",route.params.id);
      tokenPolicyId.value = product.token.getPolicyId();
      product.value = product;
      productPrice.value = product.pricing.priceUnitAmount;
      productCurrency.value = product.pricing.priceCurrencyId;
      productId.value = product.product.productId;
      productMaxUnits.value = product.pricing.maxOrderSize;
      productName.value = product.productName;
      const resource = await product.token.fetchOccultaNovelliaCharacter().catch(() => {return;});
      if(typeof resource !== "undefined"){
        resourceType.value = resource.type;
        asset.value = resource.asset;
        if(resource.asset.card.rarity == "Rare"){
          shouldCardBeHolographic.value = true;
        }
      } //figure out how to abstract this out, the only used value is shouldCardBeHolographic

      let momentObj = moment(product.metadata.dateAvailable);
      if(momentObj.year() > 1970){isDateAvailabeValid.value = true;}
      if(momentObj.isBefore(moment()) && isDateAvailabeValid.value){
        countdown.value = false;
      }
      dateString.value = momentObj.format("MMMM Do YYYY");
      timeString.value = momentObj.format("HH:mm");

      accordionItems.value = await product.getAccordianData();
      galleryData.value = await product.token.loadCarousel();
      isReady.value = true;
    }

    function showZoomModal(event) {
      zoomModalIsActive.value = true;
      zoomImage.value = event;
    }
    function closeZoomModal() {
      zoomModalIsActive.value = false;
    }
   
    getResources();    
    return {
      resourceType,
      product,
      assetDescription,
      isReady,
      asset,
      tokenPolicyId,
      galleryData,
      activeIndex,
      countdown,
      accordionItems,
      dateString,
      timeString,
      zoneString,
      productName,
      zoomImage,
      zoomModalIsActive,
      showZoomModal,
      closeZoomModal,
      productPrice,
      productCurrency,
      productId,
      productMaxUnits,
      isDateAvailabeValid,
      shouldCardBeHolographic
    };
 
  }
};
</script>

<style lang="scss" scoped>

  .product {
    height: 100%;
    width: 100%;
    overflow-x:hidden;
    overflow-y: auto;
  }

  .product__topbar {
    height: 10%;
    color: $low-emphasis-text;
    font-size: 1.2rem;
    padding: 10px;
  }
  .product__topbar i:hover {
    cursor: pointer;
  }
  
  .product__view {
    width: inherit;
    height:90%;
    padding: 0 10px 10px 10px;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .product__gallery {
    width: 50%;
    min-width:50%;
    display: block;
    height: 100%;
    padding: 0 10px;
  }

  .product__information {
    box-sizing: border-box;
    padding: 0 10px;
    width: auto;
    overflow-y: scroll;
    background: $primary-dark-2;
    border-radius: 5px;
  }
  .product-price-container {
    box-sizing: border-box;
    padding: 10px;
    color: $low-emphasis-text;
    display: flex;
    justify-content: space-between;
  }
  .shopping-container {
    display: flex;
  }
  .shopping-container__icon{
    font-size:1.21rem;
    padding-left:20px;
    margin:auto;
  }
  .product-price {
    display: flex;
    font-size: 1.2rem;
  }

  .product-name {
    box-sizing: border-box;
    padding: 10px;
	  font-weight: 800;
    color: $low-emphasis-text;
  }
  ::v-deep(.accordion) {
     h1 {
      font-size: 1.2rem;
      color: $low-emphasis-text;
      border-bottom: thin solid $inactive-state;
      box-sizing: border-box;
      padding-bottom: 5px;
      margin-bottom: 10px;
      margin-top: 5px;
     }
     p {
       box-sizing: border-box;
       color: $high-emphasis-text;
       line-height: 24px;
     }
  }
  
  .buy-button {
    width: 15vw;
    height: 3vw;
    background: $emerald;
    color: $pearl;
    border-radius: 5px 5px 5px 5px;
  }

  /* Extra small devices (phones, 600px and down)  */
  @media only screen and (max-width: 600px) {
    .product-name {
      font-size: 1.2rem;
    }

    .product__gallery {
      width:100%;
      min-width:100%;
      margin:auto;
    }

    .product__information{
      overflow-y:revert;
      margin:auto;
    }


    .product__view{
      flex-direction: column;
    }

    ::v-deep(.accordion) {
      .header-text-wrapper {
        font-size: 1rem;
      }
      .content-text-wrapper {
        font-size: 1rem;
      }
    }
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (max-width: 600px) {
    .product-name {
      font-size: 1.2rem;
    }

    ::v-deep(.accordion) {
      .header-text-wrapper {
        font-size: 1rem;
      }
      .content-text-wrapper {
        font-size: 1rem;
      }
    }
    .product__gallery{
      margin:auto;
    }
    .product__information{
      max-width:70vw;
      margin-top:20px;
    }

    
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    .product-name {
      font-size: 1.2rem;
    }

    ::v-deep(.accordion) {
      .header-text-wrapper {
        font-size: 1rem;
      }
      .content-text-wrapper {
        font-size: 1rem;
      }
    }
  }

  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    .product-name {
      font-size: 1.8rem;
    }
    
    ::v-deep(.accordion) {
      .header-text-wrapper {
        font-size: 1rem;
      }
      .content-text-wrapper {
        font-size: 1rem;
      }
    }
  }

  @media only screen and (min-width: 1200px) {
    .product-name {
      font-size: 2.1rem;
    }

    ::v-deep(.accordion) {
      .header-text-wrapper {
        font-size: 1.2rem;
      }
      .content-text-wrapper {
        font-size: 1rem;
      }
    }
  }
</style>
