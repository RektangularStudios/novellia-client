<template>
  <div class="faq">
    <Toast />
    <div class="faq__columns faq__columns-padding">
      <Button
        label="Shopping Cart"
        class="faq__button"
        @click="currentOrder"
      />
      <br>
      <PreviousOrderModal @badOrderId="errorOrderId">
        <Button 
          label="Reservation / Restore"
          class="faq__button"
        />
      </PreviousOrderModal>
    </div>

    <div
      v-for="question in faq"
      :key="question.header"
      class="faq__questions"
    >
      <h2> {{ question.header }}</h2>
      <p> {{ question.text }} </p>
    </div>
  </div>
</template>

<script lang="ts">
import router from "../../router";
import store from "../../store";
import PreviousOrderModal from "../../components/shopping/PreviousOrderModal.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default {
  components:{PreviousOrderModal,Toast},
  setup(){
    const toast = useToast();
    const currentOrder = (): void => {
      const cart = store.getters["ShoppingCart/getCart"];
      if(cart.length > -1 && typeof cart !== "undefined" && typeof cart[0] !== "undefined"){
        router.push("/order/cart");
      }
      toast.add({severity:"warn", summary: "Please add items to your shopping cart", life: 3000});
    };

    const errorOrderId = (orderId : string) : void => {
      toast.add({severity:"warn", summary: "Please use a valid Order ID", life: 3000});
    };

    const previousOrderModalVisible = false;
    const faq = [
      {
        header : "What wallet can I use?",
        text : "Only use Daedalus, Yoroi, or Adalite. DO NOT use a wallet from an exchange. Your product will be lost forever."
      },
      {
        header : "What happens if I send the wrong amount?",
        text : "If you sent an insufficient amount of ADA, you can send the remaining amount as a separate transaction. If the amount sent surpasses the required amount, please contact Support by clicking on the question mark symbol at the top of the page."
      },
      {
        header : "Why I am I seeing 5 extra ADA included in the cart?",
        text : "The 5 ADA included in the total is comprised of a 1 ADA (non-refundable) processing fee in addition to a 4 ADA transaction fee (partially refundable), which is required to send NFTs on the Cardano ledger."
      },
      {
        header : "Why does it take a long time to receive my NFTs?",
        text : "With our current payment system, processing takes approximately 5-15 min to complete an order. However, the processing time will reduce once smart contracts are available. If you are experiencing longer than expected waiting times, please contact Support by clicking on the question mark in the top of the page."
      },
      {
        header : "Is the 24hr timer correct?",
        text : "The timer is correct for most products. However, if you are redeeming a pre-order, the 24-hr timer began at 9 AM PST on May 22, 2021."
      },

    ];

    return {currentOrder,previousOrderModalVisible,faq,errorOrderId};
  },
 
};

</script>
<style lang="scss">
.faq {
  padding : 20px;
  overflow-y:scroll;
 }
.faq__columns-padding{
  padding-top:20px;
}

 .faq__button {
    padding : 10px;
    width : 150px;
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
 .faq__button:hover:focus{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }

 .faq__columns {
     display : flex;
     flex-direction : row;
     justify-content: space-around;
     width: 100%;
 }

 .faq__questions{
   padding :15px;

   h2{
     padding:2px;
     color: $low-emphasis-text;
     font-weight: bold;
   }
   p{
     padding:2px;
     color: $high-emphasis-text;
   }
 }

 @media only screen and (max-width: 768px) {
   .faq__button {
    padding : 1em;
    margin : 1em;
    width : 100%;
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
    font-size: 1.5rem;
    cursor: pointer;
 }

  .faq__columns {
     display : flex;
     flex-direction : column;
     justify-content: space-around;
     width: 100%;
 }
}

</style>
