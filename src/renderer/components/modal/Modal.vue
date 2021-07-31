<template>
  <transition name="modal-fade">
    <div
      id="modal-backdrop"
      class="modal-backdrop"
      @click="closeBackdrop"
      @touchdown="closeBackdrop"
    >
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          id="modalTitle"
          class="modal-header"
        >
          <slot name="header" />
          <div v-if="xButton">
            <button
              type="button"
              class="btn-close"
              aria-label="Close modal"
              @click="close"
            >
              x
            </button>
          </div>
        </header>

        <section
          id="modalDescription"
          class="modal-body"
        >
          <slot name="body" />
        </section>

        <footer class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    xButton: {
      type : Boolean,
      default : false,
      required : false
    },
    closeBackground : {
      type : Boolean,
      default : false,
      required : false,
    }
  },
  emits: ["close"],
  setup(props, {emit}){
    function close() {
      emit("close");
    }
    function closeBackdrop(event) {

      if (event.target.id == "modal-backdrop" && props.closeBackground) {
        this.close();
      }
    }

    return {close,closeBackdrop};
  }
  
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: $opaque;
  z-index:100000;
}

.modal {
  background: $opaque;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
  color: white;
}

.modal-header {
  position: relative;
  justify-content: space-between;
}

.modal-footer {
  flex-direction: column;
  color: white;
}

.modal-body {
  position: relative;
  padding: 20px 20px;
  color: $white;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 1rem;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: $darksilver;
  background: transparent;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
