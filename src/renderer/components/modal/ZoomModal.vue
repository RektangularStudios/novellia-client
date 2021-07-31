<template>
  <div>
    <Modal
      v-show="isModalVisible"
      :x-button="false"
      class="zoom-modal"
      @click="closeModal()"
    >
      <template #body>
        <div class="image-wrapper">
          <img
            :src="imageSrc"
            alt="dsd"
            class="image"
            oncontextmenu="return false;"
          >
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";
export default {
  components: { Modal },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    imageSrc: {
      type: String,
      required: true
    }
  },
  emits: ["close"],
  setup(props, {emit}) {
    function closeModal() {
      emit("close");
    }
    return {closeModal};
  }
};
</script>

<style lang="scss" scoped>
.zoom-modal {
    display: flex;
    z-index: 99;
    cursor: pointer;
}
::v-deep(.zoom-modal) {

  .modal {
      padding: 0;
      height: 100%;
      width: 100%;
  }
  
  .modal .modal-header,
  .modal .modal-footer {
    padding:0;
  }
  .modal .modal-body {
      display: flex;
      justify-content: center;
      padding: 0;
  }
}
.image-wrapper {
  overflow-y: auto;
  display: flex;
  height: 100vh;
  padding: 5px 0;
  max-width:90vw;
}
.image {
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 100%;
}
</style>
