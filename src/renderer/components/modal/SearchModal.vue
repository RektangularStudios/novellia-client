<template>
  <div>
    <slot />
    <Modal
      v-show="isModalVisible"
      :x-button="true"
      :close-background="true"
      class="wallet-modal"
      @close="closeModal"
    >
      <template #body>
        <div class="wallet-modal__layout"> 
          <SearchAddress @submit="closeModal" />
        </div>   
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";
import { ref } from "vue";
import SearchAddress from "../SearchAddress.vue";

export default {
  components: { Modal, SearchAddress },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: [ "closeModal" ],
  setup(props,{emit}) {
    const address = ref("");
    const isConnecting = ref(false);


    function closeModal(address) {
     
      emit("closeModal",address);
      isConnecting.value = false;
    }
   
    return { address, isConnecting, closeModal };
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.wallet-modal) {
    .modal {
        max-width:90vw;
        border: thin solid $primary-dark-3;
        background: $primary-dark-1;
        border-radius: 5px;
        text-align: center;
        box-shadow: 0 0px 15px 5px $primary-dark-3;
        -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
        -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
        transition: all 0.1s linear;
    }
    .modal .modal-body {
        display: flex;
        justify-content: center;
    }
}

.wallet-modal__layout {
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.wallet-modal__form {
  display: flex;
  flex-flow: column nowrap;
}

.wallet-modal__error {
  padding-bottom: 20px;
  color: $red;
}

h1 {
    display:inline-flex;
    margin-bottom: 15px;
    color: $primary-green-200;
}

p {
    color: $high-emphasis-text;
}

input[type=text] {
  align-self: center;
  color: $high-emphasis-text;
  width: 80%;
  padding: 8px 20px;
  margin: 40px 0;
  background: $primary-dark-2;
  outline: none;
  border: thin solid $primary-dark-3;
  border-radius: 10px;
  box-shadow: 0 0px 15px 5px $primary-dark-2;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
}
input[type=text]:focus, input[type=text]:hover {
  box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
}

button {
  align-self: center;
  width: 40%;
  background: none;
  border: thin solid $primary-green-200;
  border-radius: 10px;
  padding: 10px 0;
  color: $primary-green-200;
  font-size: 20px;
  cursor: pointer;
}

button:hover {
  transition: all 0.1s linear;
  box-shadow: 0 0px 5px 0.5px $primary-green-200;
  -moz-box-shadow: 0 0px 5px 0.5px $primary-green-200;
  -webkit-box-shadow: 0 0px 5px 0.5px $primary-green-200;
}
button:active {
  transition: all 0.1s linear;
  box-shadow: 0 0px 10px 0.5px $primary-green-200;
  -moz-box-shadow: 0 0px 10px 0.5px $primary-green-200;
  -webkit-box-shadow: 0 0px 10px 0.5px $primary-green-200;
}
</style>