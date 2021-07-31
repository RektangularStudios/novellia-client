<template>
  <Loading
    :rendered="isRendered"
    class="items"
  >
    <div
      class="items__grid"
    >
      <div
        v-for="asset of assets"
        :key="asset.product.product.productId"
        class="items__card"
      >
        <router-link :to="{name: 'Product View',params:{id: asset.product.product.productId, name: asset.product.productName},}">
          <MarketCardPanel
            :product="asset.product"
            :image="asset.image"
          />
        </router-link>
      </div>
    </div>
  </Loading>
</template>

<script>
import { ref } from "vue";
import MarketCardPanel from "../../components/marketplace/MarketCardPanel.vue";
import store from "../../store";
import Loading from "../../components/Loading.vue";
export default {
  components: { MarketCardPanel,Loading },
  setup() {
    const assets = ref([]);
    const isRendered = ref(false);
    const startDate = ref("2021-05-17 22:00:00 +0000 UTC");
    async function getProductsAndImages(){
      const products = await store.dispatch("Products/getListProductsIDs");
      for(const product of products){
        const item = await store.dispatch("Products/getProductByproductId", product);
        const resource = await item.token.fetchCard(0);
        assets.value.push({product:item,image:resource});
      };
    }
    getProductsAndImages();
    isRendered.value = true;
    return{ assets, isRendered,startDate};
  }
};
</script>

<style lang="scss" scoped>

  .items {
    display: flex;
    height: inherit;
    flex-flow: column nowrap;
    border-top:thin solid $primary-dark-3;
    overflow: auto;
    margin-top: 10px;
  }

.items__grid {
  display: grid;
  width: 100%;
  grid-auto-flow: row;
}

.items__card {
  padding: 3rem;
  
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
  .items__grid {
    grid-template-columns: 1fr;
  }

  .items__card {
    padding: 1rem;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .items__grid {
    grid-template-columns: 1fr;
  }
  .items__card {
    padding: 1rem;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .items__grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .items__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media only screen and (min-width: 1400px) {
  .items__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media only screen and (min-width: 2200px) {
  .items__grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

</style>