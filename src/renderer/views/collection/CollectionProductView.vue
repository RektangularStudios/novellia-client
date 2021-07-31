<template>
  <Loading
    :rendered="isReady"
    class="product"
  >
    <meta
      property="og:url"
      content="https://app.rektangularstudios.com"
    >
    <meta
      property="og:type"
      content="website"
    >
    <meta
      property="og:title"
      content="Rektangularstudios"
    >
    <meta
      property="og:description"
      content="productName"
    >
    <meta
      property="og:image"
      content="firstImage"
    >

    <!-- Twitter Meta Tags -->
    <meta
      name="twitter:card"
      content="summary_large_image"
    >
    <meta
      property="twitter:domain"
      content="app.rektangularstudios.com"
    >
    <meta
      property="twitter:url"
      content="https://app.rektangularstudios.com"
    >
    <meta
      name="twitter:title"
      content="Rektangularstudios"
    >
    <meta
      name="twitter:description"
      content="productName"
    >
    <meta
      name="twitter:image"
      content="firstImage"
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
        @click="goto()"
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
          :holographic="false"
          @primaryImageClicked="showZoomModal($event)"
        />
      </div>
      <div class="product__information">
        <div class="product-name">
          {{ productName }}
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../store";
import Accordion from "../../components/Accordion/Accordion.vue";
import Carousel from "../../components/Carousel/Carousel.vue";
import Loading from "../../components/Loading.vue";
import ZoomModal from "../../components/modal/ZoomModal.vue";

export default {
  components: { Accordion,  Carousel, Loading, ZoomModal},
  props: {
    nativeTokenID: {
      type: String,
      required: true
    },
    address:{
      type : String,
      required: false,
      default : ""
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const asset = ref();
    const accordionItems = ref();
    const tokenPolicyId = ref();
    const isReady = ref(false);
    const product = ref();
    const productName =ref();
    const galleryData = ref();
    const zoomImage = ref();
    const firstImage = ref();
    const zoomModalIsActive = ref(false);
    const walletString = route.params.address ? route.params.address === "" || typeof route.params.address === "undefined" ? "Wallet" : "TempWallet" : "Wallet";

    async function getResources(){
      if(walletString === "TempWallet"){
        store.commit(walletString + "/setSearchParameters", route.params.address);
      }
      const product = await store.dispatch(walletString + "/getProcessedTokenByNativeTokenId",route.params.nativeTokenID);
      if(route.params.address == "random" && product?.token?.token == ""){
        let nativeToken : string = typeof route.params.nativeTokenID == "string" ? route.params.nativeTokenID : route.params.nativeTokenID[0];
        let searchParameter = nativeToken.split(".")[0];
        store.commit(walletString + "/RESET");
        store.commit(walletString + "/setSearchParameters",searchParameter);
        await store.dispatch(walletString + "/getProcessedTokenByNativeTokenId",route.params.nativeTokenID);
        router.replace({name: "Token Viewer - Tokens",params:{nativeTokenID: nativeToken,address: searchParameter}});
      }
      else{
        tokenPolicyId.value = product.token.getPolicyId();
        product.value = product;
        firstImage.value = await product.token.loadDefaultResource();
        
        productName.value = product.productName;
      
        accordionItems.value = await product.getAccordianData();
        galleryData.value = await product.token.loadCarousel();
        isReady.value = true;
      }
    }

    function showZoomModal(event) {
      zoomModalIsActive.value = true;
      zoomImage.value = event;
    }
    function closeZoomModal() {
      zoomModalIsActive.value = false;
    }

    function goto(){
      if(walletString === "TempWallet"){
        const address = route.params.address;
        router.push({name: "Token Viewer",params:{address: address}});
        return;
      }
      router.push({name: "Token Viewer",});
      return;
    }

    onMounted(() => {
      getResources(); 
    });

    onUnmounted(() => {
      if(route.fullPath.indexOf("random") == -1){
        store.commit(walletString + "/RESET");
      }
    });

    //watch(() => route.params.address, getResources);
      

    return {
      product,
      isReady,
      asset,
      tokenPolicyId,
      galleryData,
      accordionItems,
      productName,
      zoomImage,
      zoomModalIsActive,
      showZoomModal,
      closeZoomModal,
      firstImage,
      goto
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

    .product-gallery {
      width:100%;
      min-width:100%;
    }
    .product__information{
      overflow-y:revert;
      margin:auto;
    }

    .product__view{
         flex-direction: column;
    }

  .product__gallery {
    width: 100%;
    min-width:100%;
    display: block;
    height: 100%;
    padding: 0 10px;
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
    .product__information{
      max-width:70vw;
      margin-top:20px;
      margin:auto;
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
