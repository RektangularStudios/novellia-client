<template>
  <Toast />
  <div class="purchase">
    <div class="purchase__container">
      <h1> Total : </h1>
      <span
        v-for="item in total"
        :key="item.priceCurrencyId"
        class="purchase__item"
      >
        {{ item.priceAmount }} <Currency :currency-id="item.priceCurrencyId" />
      </span>
      <hr class="purchase__solid-line">
    </div>
    <span class="purchase__container">
      <label for="address">Your Public Address</label>
      <InputText
        id="address"
        v-model="address"
        type="text"
        class="purchase__input-text"
      />
    </span>
    <Checkbox
      name="checkWallet"
      text="This is not a wallet from an exchange."
      text-side="left"
      :initial-value="false"
      class="purchase__checkbox"
      @updateValue="checkBox"
    />
    <Checkbox
      name="checkExchange"
      text="I acknowledge that if this address is wrong, I will not receive the NFT."
      text-side="left"
      :initial-value="false"
      class="purchase__checkbox"
      @updateValue="checkBox"
    />
    <div class="purchase__container">
      <Button
        label="Submit Order"
        class="purchase__submit-button"
        @click="validateGoToNextPage"
      />
    </div>
  </div>
</template>

<script lang="js">
import router from "../../router";
import WAValidator from "multicoin-address-validator";
import Toast from "primevue/toast";
import Checkbox from "../Checkbox.vue";
import store from "../../store";
import Currency from "../Currency.vue";
export default {
  components : {Toast,Checkbox,Currency},
  props: {
    total : {
      type : Array,
      required : true
    },
    previousAddress : {
      type : String,
      required : false,
      default : ""
    }
  },
  data() {
    return {
      address : this.previousAddress,
      checkExchange : false,
      checkWallet : false,
    };
		
  },
  methods: {
    async validateGoToNextPage(){
      if(store.getters["ShoppingCart/getCart"].length <= -1){
        this.$toast.add({severity:"warn", summary: "Add items to cart", detail:"Please add something to your cart", life: 3000});
        return;
      }
      if(this.address == "" ){
        this.$toast.add({severity:"warn", summary: "Invalid Cardano address", detail:"Please fill out the address", life: 3000});
        return;
      }
      if(!this.checkWallet || !this.checkExchange){
        this.$toast.add({severity:"warn", summary: "Please check the buttons", detail:"Please check the buttons and verify your address is correct", life: 3000});
        return;
      }
      var valid = WAValidator.validate(this.address, "ada");
      if(!valid){
        this.$toast.add({severity:"warn", summary: "Invalid Cardano address", detail:"Please check that the address is a valid cardano address", life: 3000});
        return;
      }
      const status = store.dispatch("ShoppingCart/status");
      if(status.maintenance || status.status !== "UP"){
        const orderId = await store.dispatch("ShoppingCart/createOrder",{deliveryAddress : this.address, total : this.total}).catch(err => {console.log(err);});
        if(orderId){
          store.commit("ShoppingCart/updateOrderId",orderId.orderId);
          store.commit("ShoppingCart/resetCart");
          router.push("/order/orderid");
          return;
        }
      }
      this.$toast.add({severity:"warn", summary: "We are sorry", detail:"The order fulfillment service is down, please try again later", life: 10000});
      return;
    },
    checkBox(item){
      if(item.item === "checkWallet"){
        this.checkWallet = item.value;
      }
      if(item.item === "checkExchange"){
        this.checkExchange = item.value;
      }
    }
  }     
  
};
</script>
<style lang="scss" scoped>

.purchase{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  background-color : $primary-dark-2;
  padding : 20px;
  overflow-y : scroll;
  height:100%;
}
.purchase__container{
  flex: 1;
  color:$low-emphasis-text;
  padding: 0.5em;
}
hr.purchase__solid-line {
    border : 0px;
    border-top: 2px solid $low-emphasis-text;
    border-radius: 2px;
    width: 100%;
    margin : auto;
    padding: 0.5em;
}

.purchase__input-text{
  width:100%;
  padding: 1em;
  font-size: 1em;
  border-radius:10px;
  background:transparent;
  border-radius:10px;
  border: thin solid $primary-green-200;
  border-radius: 10px;
  outline : none;
  box-shadow: 0 0px 15px 5px $primary-dark-2;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
  background: none;
  color: $primary-green-200;
}
.purchase__submit-button{
  width:100%;
  padding: 1em;
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

 .purchase__submit:hover:focus{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }

 .purchase__line{
   display: relative;
 }

.purchase__item{
  display:fixed;
}

.purchase__checkbox{
  padding:0.5em;
}

</style>
