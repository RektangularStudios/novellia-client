<template>
  <Loading
    :rendered="rendered"
    class="orderContainer"
  >
    <div class="orderContainer order-id__scroll">
      <h2 class="order-id__break">
        Order ID : {{ orderId }}
      </h2>
      <div>
        <br>
        <br>
        <h3> Please copy the order id to your clipboard. This will be necessary to receive support. </h3>
        <br>
        <Button
          class="order-id__button"
          @click="copyToClipboard(orderId)"
        >
          Copy
        </Button>
      </div>

      <Button
        class="order-id__button"
        @click="nextPage"
      >
        I have copied the order id which is necessary for support.
      </Button>
    </div>
  </Loading> 
</template>

<script lang="ts">
import {ref} from "vue";
import Loading from "../../components/Loading.vue";
import store from "../../store";
import router from "../../router";
export default {
  components:  {Loading},
  setup(){
    const rendered = ref<Boolean>(false);
    const orderId = ref<String>("");
    async function getOrder(){
      const order = await store.dispatch("ShoppingCart/getOrder");
      orderId.value = order.orderId;
      rendered.value = true;
    }
    getOrder();

    function nextPage(){
      router.push("/order/payment");
    }
    function copyToClipboard(copyText : string){
      navigator.clipboard.writeText(copyText);
    }
    
    return {orderId,rendered,copyToClipboard,nextPage};
  },

};
</script>

<style lang="scss" scoped>
.orderContainer{
  padding:1rem;
  margin:1rem;
  border-radius:1rem;
  overflow : hidden;
  text-align: center;
  background:$primary-dark-2;
  color:$high-emphasis-text;
  overflow:hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;

  .h2{
    padding:20px;
    margin: 20px;
  }
  .h3{
    padding:20px;
    margin:20px;
  }
}

.order-id__scroll{
  overflow-y : scroll;
}

.order-id__break{
  overflow:hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}

 .order-id__button {
    padding : 10px;
    margin : 10px;
    border-radius:10px;
    border: thin solid $primary-green-200;
    background: $primary-dark-2;
    border-radius: 10px;
    outline : none;
    box-shadow: 0 0px 15px 5px $primary-dark-2;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
    background: none;
    color: $primary-green-200;
    font-size: 1rem;
    cursor: pointer;
 }
 .order-id__button:hover:focus{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }


</style>