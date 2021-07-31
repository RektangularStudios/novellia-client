<template>
  <div>
    <p>Mnemonic</p>
    <Button
      label="Back"
      icon="pi pi-angle-left"
      @click="prevPage()"
    />
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
  emits: ["next-page", "prev-page"],
  methods: {
    nextPage() {
      this.$emit("next-page", { formData: {}, pageIndex: 1 });
    },
    prevPage() {
      this.$emit("prev-page", { pageIndex: 1 });
    }
  }
};
</script>

<style lang="scss"></style>
