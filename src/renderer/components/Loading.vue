<template>
  <div v-if="rendered === true">
    <slot />
  </div>
  <div
    v-else
    class="loading-container"
  >
    <ProgressSpinner />
    <div>  Loading </div>
  </div>
</template>
<script lang="ts">
export default {
  props:{
    rendered : {
      type : Boolean,
      required : true,
    }
  }

};
</script>

<style lang="scss">
  .loading-container {
    height: 100%;
    width: 100%;
    overflow: hidden !important;
    display:flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }

</style>
