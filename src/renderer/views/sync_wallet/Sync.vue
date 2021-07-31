<template>
  <br>
  <Steps
    :model="items"
    :readonly="true"
  />
  <router-view
    v-slot="{ Component }"
    :form-data="formObject"
    @prevPage="prevPage($event)"
    @nextPage="nextPage($event)"
  >
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          label: "Wallet Type",
          to: "/sync/wallet-type"
        },
        {
          label: "Menomic Phrase",
          to: "/sync/menomic"
        },
        {
          label: "Spending Password",
          to: "/sync/spending-password"
        }
      ],
      formObject: {}
    };
  },

  methods: {
    nextPage(event) {
      //for (let field in event.formData) {
      //    this.formObject[field] = event.formData[field];
      //}
      this.$router.push(this.items[event.pageIndex + 1].to);
    },
    prevPage(event) {
      this.$router.push(this.items[event.pageIndex - 1].to);
    }
  }
};
</script>

<style lang="scss">
::v-deep(b) {
  display: block;
}
</style>
