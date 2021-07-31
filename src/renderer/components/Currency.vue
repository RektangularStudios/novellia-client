<template>
  <i
    v-if="currencyId === 'ada'"
    class="icon-ada currency-ada"
    div
  />
  <div v-else>
    {{ currencyId }}
  </div>
</template>
<script>
export default {
  name: "Currency",
  props: {
    currencyId: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="scss">
.currency-ada {
  font-size: 1rem;
  margin-top:4px;

}
</style>
