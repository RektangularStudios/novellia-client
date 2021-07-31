<template>
  <div class="wallet-modal__layout"> 
    <div class="wallet-modal__form">
      <label
        v-if="validateCardanoAddress"
        for="searchParameters"
      > Please enter a wallet address to search. </label>
      <label
        v-else
        for="searchParameters"
      > Please enter an address, stake key, or policy id to search. </label>
      <input
        id="searchParameters"
        v-model="searchParameters"
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
        @click="connect()"
      >
        Connect
      </button>
    </div>
  </div>   
</template>

<script>
import { ref } from "vue";

import isCardanoAddressOrStake from "../helper_functions/isCardanoAddressOrStake";
export default {
  props: {
    validateCardanoAddress: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: [ "submit" ],
  setup(props,{emit}) {
    const searchParameters = ref("");
    const isConnecting = ref(false);
    const isError = ref(false);

    function closeModal() {
     
      emit("submit",searchParameters.value);
      isError.value = false;
      isConnecting.value = false;
      searchParameters.value = "";
      
    }
    async function connect() {
      isConnecting.value = true;
      var valid = props.validateCardanoAddress ? isCardanoAddressOrStake(this.searchParameters) : true;
      if(!valid){
        isError.value = true;
        isConnecting.value = false;
        return;
      }
      isError.value = false;
      closeModal();
    }
    return { searchParameters, isConnecting, isError, closeModal, connect };
  }
};
</script>


<style lang="scss" scoped>

.wallet-modal__layout {
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;

}

.wallet-modal__form {
  display: flex;
  flex-flow: column nowrap;
  width:70%;
  margin : auto;
  padding-top : 30px;
  justify-content: center;
  align-items: center;

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
  width: 100%;
  padding: 8px 20px;
  margin: 20px 0;
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