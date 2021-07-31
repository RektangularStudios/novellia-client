<template>
  <div>
    <Modal
      v-show="isModalVisible"
      :x-button="true"
      :close-background="false"
      class="wallet-modal"
      @close="closeModal()"
    >
      <template #body>
        <div class="wallet-modal__layout"> 
          <h1> Connect a Wallet </h1>
          <p> Please enter your wallet address below and press connect. </p>
          <div class="wallet-modal__form">
            <input
              v-model="address"
              type="text"
            >
            <p
              v-if="isError"
              class="wallet-modal__error"
            >
              Address provided is not a valid Cardano address. (Shelley era)
            </p>
            <ProgressSpinner v-if="isConnecting" />
            <button
              type="button"
              @click="connectWallet()"
            >
              Connect
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";
import { ref } from "vue";
import store from "../../store";
import isCardanoAddressOrStake from "../../helper_functions/isCardanoAddressOrStake";

export default {
  components: { Modal },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: [ "closeModal" ],
  setup(props, {emit}) {
    const address = ref("");
    const isConnecting = ref(false);
    const isError = ref(false);

    function closeModal() {
      isError.value = false;
      isConnecting.value = false;
      address.value = "";
      emit("closeModal");
    }
    async function connectWallet() {
      isConnecting.value = true;
      var valid = isCardanoAddressOrStake(this.address);
      if(!valid){
        isError.value = true;
        isConnecting.value = false;
        return;
      }
      isError.value = false;
      store.commit("Wallet/setSearchParameters", address.value);
      await store.dispatch("Wallet/updateTokenBySearchParameters");
      closeModal();
    }
    return { address, isConnecting, isError, closeModal, connectWallet };
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