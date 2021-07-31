<template>
  <div>Wallet Balance: {{ tokens }}</div>
</template>

<script>

export default {
  data() {
    return {
      tokens: []
    };
  },
  computed: {
    propertyComputed() {
      return this.tokens;
    }
  },
  created() {
    // TODO: use Novellia service
  }
};
</script>

<style lang="scss"></style>
