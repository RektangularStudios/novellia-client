<template>
  <div>
    <p>Wallet-Type</p>
    <router-link to="/add-wallet">
      <Button label="Return" />
    </router-link>
    <Button
      label="Next"
      icon="pi pi-angle-right"
      icon-pos="right"
      @click="nextPage()"
    />
  </div>
</template>

<script>
export default {
  emits: ["next-page"],
  methods: {
    nextPage() {
      this.$emit("next-page", { formData: {}, pageIndex: 0 });
    }
  }
};
</script>

<style lang="scss">
.p-steps-current {
  font-weight: 1000;
  text-decoration: underline;
}
</style>
