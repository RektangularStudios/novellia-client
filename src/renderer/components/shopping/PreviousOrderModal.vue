<template>
  <div @click="showModal">
    <slot />
  </div>

  <Modal
    v-show="isModalVisible"
    :x-button="false"
    :close-background="true"
    @close="closeModal"
  >
    <template #body>
      <div class="previous-order-modal">
        <div class="previous-order-modal__center">
          <h1>Reservation / Restore ID</h1>
        </div>
        <hr class="previous-order-modal__solid-line">
        <div class="p-field">
          <InputText
            id="previousPurchaseId"
            v-model="value"
            type="text"
            class="previous-order-modal__input-text"
          />
        </div>
        <div class="previous-order-modal__center">
          <Button
            label="Submit"
            class="previous-order-modal__button"
            @click="updateOrderId"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script type="ts">
import store from "../../store";
import Modal from "../modal/Modal";
import router from "../../router";
export default {
  components: { Modal },
  emits: ["badOrderId"],
  data() {
    return {
      value : "",
      isModalVisible: false,
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async updateOrderId(){
      const orderId = this.value;
      store.dispatch("ShoppingCart/getOrderByOrderId",orderId).then(()=>{
        store.commit("ShoppingCart/updateOrderId",orderId);
        this.isModalVisible = false;
        router.push("/order/payment");
      }).catch(() => {
        this.$emit("badOrderId");
        return;
      });
     
     
    
    }
  }
};
</script>

<style lang="scss" scoped>
.previous-order-modal {
  background: $primary-dark-3;
  padding:20px;
  width: 375px;
  max-width:90vw;
  border: thin solid $primary-dark-3;
  background: $primary-dark-1;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  transition: all 0.1s linear
}

.previous-order-modal__center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  color: $low-emphasis-text;
}

.previous-order-modal__button {
    padding : 10px;
    width: 75%;
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
 .previous-order-modal__button:hover{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }
 .previous-order-modal__button:focus{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }


.previous-order-modal__input-text {
    width : 100%;
    padding:10px;
    border-radius:10px;
    background-color: $primary-dark-3 !important;
    color: $high-emphasis-text !important;
}

.previous-order-modal__input-text:active:hover:focus {
    width : 100%;
    padding:10px;
    border-radius:10px;
    background-color: $primary-dark-3 !important;
    color: $high-emphasis-text !important;
}

hr.previous-order-modal__solid-line {
    border : 0px;
    border-top: 2px solid $low-emphasis-text;
    border-radius: 2px;
    width: 100%;
    margin : auto;
    padding-bottom : 15px;

}
</style>
