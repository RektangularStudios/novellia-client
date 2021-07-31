<template>
  <Loading
    :rendered="isRendered"
    class="cart"
  >
    <div class="cart__products">
      <h1> Cart </h1>
      
      <div v-if="assets.length > 0">
        <div
          v-for="asset in assets"
          :key="asset.productId"
        >
          <ProductOverview
            :name="asset.name"
            :image="asset.resource"
            :max="asset.max"
            :price="asset.priceAmount"
            :coin="asset.priceCurrencyId"
            :product-id="asset.productId"
            @close="removeProductOverview"
          />
        </div>
      </div>
    </div>
    <div class="cart__purchase">
      <Purchase
        :total="total"
        :previous-address="address"
      />
    </div>
  </Loading>
</template>

<script lang="ts">
import ProductOverview from "../../components/shopping/ProductOverview.vue";
import Purchase from "../../components/shopping/Purchase.vue";
import store from "../../store";
import router from "../../router";
import Loading from "../../components/Loading.vue";
import { onBeforeMount, ref, watch } from "vue";
interface asset {productId : String, name : String, max : number, priceAmount : number, priceCurrencyId : String, resource : String}
export default {
  components: { ProductOverview, Purchase, Loading},
  setup() {
    const assets = ref<asset[]>([]);
    const isRendered = ref(false);
    const total = ref<{priceCurrencyId : String, priceAmount : number}[]>([]);
    const address = store.getters["Wallet/getSearchParameters"];

    onBeforeMount(()=>{
      const cart = store.getters["ShoppingCart/getCart"];
      if(cart.length <= -1 || typeof cart === "undefined" || typeof cart[0] === "undefined"){
        router.push("/order/faq");
      }
    });

    const removeProductOverview = async productId => {
      if(isRendered.value){
        const index = assets.value.findIndex(product => product.productId == productId);
        if(index > -1){
          await store.commit("ShoppingCart/updateCart",{productId : productId, quantity : 0});
          assets.value.splice(index,1);
        }
      }
    };

    watch(assets.value, async () => {
      await updateTotal();
    });
    watch(store.getters["ShoppingCart/getCart"], async()=>{
      await updateTotal();
    });

    async function updateTotal(){
      total.value = [];
      const products = store.getters["ShoppingCart/getCart"];
      await products.forEach(product => {
        const index = assets.value.findIndex(asset => asset.productId == product.productId);
        if(index > -1){
          const totalCostIndex = total.value.findIndex(total => total.priceCurrencyId === assets.value[index].priceCurrencyId);
          const productValue : number = assets.value[index].priceAmount * product.quantity;
          if(totalCostIndex > -1){
            total.value[totalCostIndex].priceAmount = total.value[totalCostIndex].priceAmount + productValue;
          }
          else(
            total.value.push({priceCurrencyId : assets.value[index].priceCurrencyId, priceAmount : productValue})
          );
        }
      });
    }
 
    async function getData(){
      const products = store.getters["ShoppingCart/getCart"];
      
      if(products){
        await products.forEach(async product =>{
          if(typeof product.productId !== "undefined"){
            const value = await store.dispatch("Products/getProductByproductId",product.productId);
            const max : number = Number(value.pricing.maxOrderSize);
            const priceAmount : number = Number(value.pricing.priceUnitAmount);
            const priceCurrencyId : string = value.pricing.priceCurrencyId;
            const name : string = value.token.token.name;
            const resource : string  = await value.token.loadDefaultResource();
            const asset : asset = {productId : product.productId, name : name, max : max, priceAmount : priceAmount, priceCurrencyId : priceCurrencyId, resource : resource};
            assets.value.push(asset);
          }
        });
        await updateTotal();
      }
      console.log(assets);
      isRendered.value = true;
    }
    getData();

    return {assets,isRendered, total, removeProductOverview,address};
  },
};
</script>
<style lang="scss" scoped>
  .cart__purchase {
    padding : 10px;
    margin : 10px;
    margin-left:5px;
    border-radius: 10px;
    flex:1;
    background-color:$primary-dark-2;
  }

  .cart__products { 
    padding : 10px;
    margin : 10px;
    margin-right:5px;
    border-radius: 10px;
    flex: 2;
    background-color:$primary-dark-2;
    overflow:hidden;
    overflow-y:auto;
    h1{
      color:$high-emphasis-text;
    }
  }

  .cart {
    display: flex;
    flex-direction: row;
  }

  
  @media only screen and (max-width: 768px) {
    .cart{
       flex-direction: column-reverse;
       overflow-y : scroll;
     }
     .cart__products { 
      overflow : revert;
    }
    .cart__purchase {
      overflow : revert;
    }
    
  }
</style>
