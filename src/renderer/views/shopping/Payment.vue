<template>
  <Loading
    :rendered="isRendered"
    class="payment"
  >
    <div @click="exit">
      <i class="icon-cross exit-button" />
    </div>
    <div class="payment">
      <div>
        <div class="payment__column">
          <h2 class="payment__container wrap-text">
            Order Number : {{ orderId }}
          </h2>
          <h2 class="payment__container payment__container-last-itemText wrap-text">
            Status : {{ orderStatus }} <br>
            Payment Status : {{ paymentStatus }}
          </h2>
        </div>
        <hr class="payment__solid-line">
      </div>
      <h3 class="payment__container payment__center-text payment__container-text">
        Please send exactly <mark class="payment__container-highlight-text"> {{ priceAmount }} <Currency :currency-id="priceCurrencyId" /></mark> to the following address to complete payment.
      </h3>

      <h3 class="payment__container payment__center-text payment__container-text ">
        Please verify this is your wallet address <mark class="payment__container-highlight-text wrap-text"> {{ orderAddress }} </mark>. If this is not your address please exit the order now. We are not held responsible for tokens sent to the wrong address.
      </h3>
      <canvas
        id="canvas"
        ref="canvas"
        class="payment__container payment__center payment__canvas"
      />
      <h3 class="payment__container wrap-text payment__center-text">
        Payment Address : {{ paymentAddress }}
      </h3>
      <div class="payment__container">
        <hr class="payment__solid-line">
        <div
          v-if="isReserved"
          class="payment__column payment__column-container"
        >
          <h3 class="payment__container">
            Product reserved :
          </h3><CountdownWidget
            :event-time="reservedUntil"
            class="payment__container2"
            @countdownEnd="notReserved"
          />
        </div>
        <div
          v-if="isPaymentValid"
          class="payment__column payment__column-container"
        >
          <h3 class="payment__container">
            Time left to pay :
          </h3><CountdownWidget
            :event-time="paymentValidUntil"
            class="payment__container2"
            @countdownEnd="paymentNotValid"
          />
        </div>
      </div>
    </div>
  </Loading> 
</template>
<script lang="ts">
import QrCode from "qrcode";
import {onMounted, onUnmounted, ref} from "vue";
import Loading from "../../components/Loading.vue";
import CountdownWidget from "../../components/CountdownWidget.vue";
import store from "../../store";
import moment from "moment";
import Currency from "../../components/Currency.vue";
import router from "../../router";
export default {
  components:  {Loading, CountdownWidget,Currency},
  setup(){
    const paymentAddress = ref<String>("");
    const isRendered = ref(false);
    const orderId = ref<string>("");
    const orderStatus = ref<string>("");
    const paymentStatus = ref<string>("");
    const priceAmount = ref<number>(0);
    const priceCurrencyId = ref<String>("");
    const reservedUntil = ref<string>("");
    const paymentValidUntil = ref<string>("");
    const isReserved = ref<Boolean>(false); //todo update to true again when we use this
    const isPaymentValid = ref<Boolean>(true); 
    const orderAddress = ref<string>("");

    function watcher(){
      store.dispatch("ShoppingCart/getOrder").then((order) => {
        if(typeof order !== "undefined"){
          if(orderAddress.value !== order.customer.deliveryAddress){orderAddress.value = order.customer.deliveryAddress;}
          if(orderId.value !== order.orderId){orderId.value = order.orderId;}
          if(orderStatus.value !== replaceUnderscoreNormalizeCase(order.orderStatus)){orderStatus.value = replaceUnderscoreNormalizeCase(order.orderStatus);}
          if(priceAmount.value !== order.payment.priceAmount){priceAmount.value = order.payment.priceAmount;}
          if(priceCurrencyId.value !== order.payment.priceCurrencyId){priceCurrencyId.value = order.payment.priceCurrencyId;}
          if(paymentStatus.value !== replaceUnderscoreNormalizeCase(order.payment.paymentStatus)){paymentStatus.value = replaceUnderscoreNormalizeCase(order.payment.paymentStatus);}
          if(paymentAddress.value !== order.payment.paymentAddress){
            paymentAddress.value = order.payment.paymentAddress;
            var canvas = document.getElementById("canvas");
            QrCode.toCanvas(canvas, paymentAddress.value, function (error) {
              if (error) {return;}
            });       
          }
          if(moment().isAfter(tenMinAfterOrderCreated)){notReserved();}
          if(moment().isAfter(oneDayAfterOrderCreated)){paymentNotValid();}   
        }
      }).catch((err) => {
        console.error(err);
      });
    }

    function exit(){
      store.commit("ShoppingCart/RESET");
      const address : string = orderAddress.value ? orderAddress.value : "";
  
      router.push({name: "Token Viewer",params:{address : address}});
    }

 

    function resetCartPayment(){
      store.commit("ShoppingCart/RESET");
    }

    function replaceUnderscoreNormalizeCase(value : string){
      return value.replace("_", " ").toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
    }


    const notReserved = () => {isReserved.value = false;};
    const paymentNotValid = () => {isPaymentValid.value = false;};

    const timeOrderCreated = store.getters["ShoppingCart/getOrderTime"];
    if(timeOrderCreated === ""){
      notReserved();
      paymentNotValid();
    }

    const tenMinAfterOrderCreated = moment(timeOrderCreated).add(10, "m");
    const oneDayAfterOrderCreated = moment(timeOrderCreated).add(1, "d");

    if(typeof timeOrderCreated !== "undefined" && timeOrderCreated !== ""){
      reservedUntil.value = tenMinAfterOrderCreated.toISOString();
      paymentValidUntil.value = oneDayAfterOrderCreated.toISOString();
    }
    
    const watch = setInterval(watcher,60000);
    onMounted(()=>watcher());
    onUnmounted(()=> clearInterval(watch));

    isRendered.value = true;
    

    return {paymentAddress, isRendered, orderId,orderStatus,priceAmount,priceCurrencyId,reservedUntil,paymentValidUntil,paymentStatus,
      notReserved,paymentNotValid,isReserved,isPaymentValid,resetCartPayment, orderAddress, exit};
  },

};
</script>

<style lang="scss" scoped>
.exit-button{
  padding:20px;
  cursor: pointer;
}

.payment{
  display:flex;
  flex-direction: column;
  width:90%;
  margin-left: 5%;
  margin-right: 5%;
  padding:20px;
  border-radius:20px;
  background-color:$primary-dark-2;
  height:90%;
  overflow:hidden;
  overflow-y:scroll;

  h1{
    color:$low-emphasis-text;
  }
  h2{
    color:$low-emphasis-text;
  }
  h3{
    color:$high-emphasis-text;
  }
}

.payment__container-highlight-text{
  color : $primary-green-300;
  background : transparent;
  font-size:1rem;
}

.payment__container-text{
  padding:10px;
}

.payment__column-container{
  padding:10px;
}

.payment__container{
  flex:1;
}
.payment__container2{
  flex:2;
}
.payment__center{
  display:block;
  margin-left:auto;
  margin-right:auto;
}

.payment__center-text{
  text-align: center;
  padding:20px;


}

.payment__container-last-itemText{
  text-align: right;
}
.wrap-text{
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.payment__column{
  display:flex;
  flex-direction: row;
  height:100%;
}

.payment__canvas{
  width:300px;
  height:300px;
}

.hr.payment__solid-payment__solid-line{
  border : 0px;
  border-top: 2px solid $white;
  border-radius: 2px;
  width: 100%;
  margin : auto;
  padding-bottom : 15px;
}

  @media only screen and (max-width: 1200px) {
    .payment__column{
       flex-direction: column;
     }
     .payment__container-last-itemText{
       text-align:left;
     }
  }


</style>