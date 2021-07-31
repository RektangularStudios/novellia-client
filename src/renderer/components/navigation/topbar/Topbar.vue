<template>
  <div class="topbar">
    <NavigationButton>
      <div class="topbar__wallet">
        <p
          v-if="walletConnected"
          @click="disconnectWallet()"
        >
          Disconnect
        </p>
        <p
          v-else
          @click="openWalletModal()"
        >
          Connect Wallet
        </p>
      </div>
    </NavigationButton>
    
    

    <NavigationButton
      :not-active="false"
      icon="icon-cart"
      :to="goto()"
      route-contains="order"
    >
      <span
        v-if="itemsInCart > 0"
        class="item-badge"
      > {{ itemsInCart }} 
      </span>
    </NavigationButton>

    <NavigationButton
      :not-active="true"
      icon="icon-cog"
    />
   
    <ContactSupport>
      <NavigationButton
        :not-active="false"
        icon="icon-question"
      />
    </ContactSupport>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "../../../store";
import ContactSupport from "../../modal/ContactSupportModal";
import NavigationButton from "../NavigationButton";
export default {
  components:{ContactSupport,NavigationButton},
  emits: [ "openWalletModal" ],
  setup(props, {emit}) {
    const itemsInCart = ref(0);
    const route = useRoute();
    const walletConnected = ref(store.getters["Wallet/getConnected"]);
    store.watch(
      (state, getters) => getters["Wallet/getConnected"],
      (newValue) => {
        walletConnected.value = newValue;
      }
    );

    store.watch(
      (state, getters) => getters["ShoppingCart/getTotalItemsInCart"],
      (newValue) => {
        itemsInCart.value = newValue;
      }
    );

    function openWalletModal() {
      emit("openWalletModal");
    }

    function disconnectWallet() {
      store.commit("Wallet/RESET");
    }
   
    function goto() {
      const orderId = store.getters["ShoppingCart/getOrderId"];
      if (orderId === "" || typeof orderId === "undefined") 
      {
        return "/order/faq";
      }
      return "/order/payment";
    }

    function checkIfRouteActive(r) {
      return route.matched.some(item => item.path.includes(r));
    }
    
    onMounted(()=>{
      const value = store.getters["ShoppingCart/getTotalItemsInCart"];
      if(value){
        itemsInCart.value = value;
      }
    });
    return { openWalletModal, goto, checkIfRouteActive, walletConnected, disconnectWallet, itemsInCart };
  },
};

</script>

<style lang="scss" scoped>

  .topbar {
    display: flex;
    align-items: flex-start;
    padding: 1em 1em;
  }
  .topbar__icon {
    margin: 0 15px;
    font-size: 1rem;
  }
  
  .topbar__icon--inactive {
    color: $inactive-state;
    cursor: pointer;
  }

  .topbar__icon--active {
    color: $primary-green-200;
    cursor: pointer;
  }

  .topbar__wallet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    margin : auto;
    border: thin solid $primary-green-200;
    padding: 3px;
    color: $primary-green-200;
    cursor: pointer;
  }
  .topbar__wallet:hover {
    transition: all 0.1s linear;
    box-shadow: 0 0px 5px 0.5px $primary-green-200;
    -moz-box-shadow: 0 0px 5px 0.5px $primary-green-200;
    -webkit-box-shadow: 0 0px 5px 0.5px $primary-green-200;
  }
  .topbar__wallet:active {
    transition: all 0.1s linear;
    box-shadow: 0 0px 10px 0.5px $primary-green-200;
    -moz-box-shadow: 0 0px 10px 0.5px $primary-green-200;
    -webkit-box-shadow: 0 0px 10px 0.5px $primary-green-200;
  }
  .item-badge{
    font-size: 0.8rem;
    color: $high-emphasis-text;
    margin-top:10%;

    border : 1px;
  }

  p {
    font-size: 0.9rem;
  }
  @media only screen and (max-width: 768px) {
  .item-badge {
    font-size: 1rem;
    color: $high-emphasis-text;
    margin-top:10%;
 
    border : 1px;
  }
  .topbar__wallet {
    padding: 1px;
  }

  .navigation-button__icon {
    font-size: 1.5rem;
    margin:0.7em;
  }

}

</style>