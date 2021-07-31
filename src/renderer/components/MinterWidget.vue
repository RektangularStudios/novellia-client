<template>
  <Card class="widget-container">
    <template #title>
      Mint New Token
    </template>
    <template #content>
      <form @submit.prevent="mintToken">
        <div class="p-fluid p-formgrid p-grid p-jc-evenly">
          <div class="p-field p-col-5 p-md-5">
            <label for="tokenname">Token name</label>
            <InputText
              id="tokenname"
              v-model="tokenName"
              v-tooltip.top="'Name for your token'"
              type="text"
            />
          </div>
          <div class="p-field p-col-4 p-md-4">
            <label for="amount">Amount</label>
            <InputNumber
              id="amount"
              v-model="amount"
              v-tooltip.top="'Token amount to mint'"
              type="text"
            />
          </div>
          <div class="p-field p-col-3 p-md-3">
            <label for="symbol">Symbol</label>
            <InputText
              id="symbol"
              v-model="symbol"
              v-tooltip.top="'Symbol for your token'"
              @keyup="symbol = symbol.toUpperCase()"
            />
          </div>
          <div class="p-field p-col-12 p-md-12">
            <label for="address">Wallet Address</label>
            <InputText
              id="address"
              v-model="walletAddress"
              v-tooltip.top="
                'Cardano Wallet address for receiving the minted tokens'
              "
            />
          </div>
          <div class="p-field p-col-12 p-md-12">
            <label for="policyid">Policy ID</label>
            <InputText
              id="policyid"
              v-model="policyId"
              v-tooltip.top="'Policy ID for your token'"
            />
          </div>
          <div class="p-field p-col-12 p-md-12">
            <Button
              label="Mint Token"
              type="submit"
            />
          </div>
        </div>
      </form>
    </template>
  </Card>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const tokenName = ref("");
    const amount = ref(0);
    const symbol = ref("");
    const walletAddress = ref("");
    const policyId = ref("");

    function mintToken() {
      console.log(tokenName.value);
    }

    return { tokenName, amount, symbol, walletAddress, policyId, mintToken };
  }
};
</script>

<style lang="scss">
.widget-container {
  width: 25%;
}
</style>
