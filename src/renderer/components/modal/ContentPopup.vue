<template>
  <div>
    <div
      class="click"
      @click="showModal"
    >
      <slot />
    </div>

    <Modal
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template #header />

      <template #body />

      <template #footer />
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "App",
  components: {
    Modal
  },

  data() {
    return {
      isModalVisible: false
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  }
};
</script>

<style scoped>
.click {
  display: block;
  width: 100%;
  overflow: hidden;
}
</style>
