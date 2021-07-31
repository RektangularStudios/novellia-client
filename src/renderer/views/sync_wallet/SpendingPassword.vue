<template>
  <div>
    <p>Spending Password</p>
    <Button
      label="Back"
      icon="pi pi-angle-left"
      @click="prevPage()"
    />
  </div>
</template>

<script>
export default {
  emits: ["prev-page"],
  methods: {
    prevPage() {
      this.$emit("prev-page", { pageIndex: 2 });
    }
  }
};
</script>

<style lang="scss"></style>
