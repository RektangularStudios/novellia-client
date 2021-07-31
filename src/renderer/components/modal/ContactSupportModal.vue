<template>
  <div
    class="show"
    @click="showModal"
  >
    <slot />
  </div>

  <Modal
    v-show="isModalVisible"
    :x-button="false"
    :close-background="true"
    @close="closeModal"
  >
    <template #body>
      <div class="contact-support-modal">
        <div class="contact-support-modal__center">
          <h1>Contact Support</h1>
        </div>
        <hr class="contact-support-modal__solid-line">
        <span class="p-field">
          <label for="orderId">Order ID / NA</label>
          <InputText
            id="orderId"
            v-model="orderId"
            type="text"
            class="contact-support-modal__input-text"
          />
        </span>
        <span class="p-field">
          <label for="message">Message</label>
          <Textarea
            id="message"
            v-model="message"
            class="contact-support-modal__input-text"
            rows="5" 
            cols="30"
          />
        </span>
        <div class="contact-support-modal__center">
          <Button
            label="Submit"
            class="contact-support-modal__button"
            @click="submitMessage"
          />
        </div>
        <Socials class="contact-support-modal__full-width-container" />
      </div>
    </template>
  </Modal>
</template>

<script type="ts">
import Modal from "../modal/Modal";
import Socials from "../Socials";
import { ref } from "vue";
export default {
  components: { Modal, Socials},
  emits: ["close"],
  setup(){
    const email = ref("");
    const message = ref("");
    const orderId = ref("");
    const isModalVisible = ref("");
    const showModal = () => {
      isModalVisible.value = true;
    };
    const closeModal = () => {
      email.value = "";
      message.value = "";
      orderId.value = "";
      isModalVisible.value = false;
    };
    const submitMessage = () => {
      //const email = this.email;
      const body = message.value;
      const subject = "Support Ticket " + orderId.value;
      //var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      window.open(
        "mailto:contact@rektangularstudios.com?subject=" + subject  + "&body=" + body,
        "_blank" 
      );
      closeModal();
    };

    return {showModal,closeModal,submitMessage,email,orderId,message,isModalVisible};
  }
  
};
</script>

<style lang="scss" scoped>
.contact-support-modal {
  background: $primary-dark-3;
  padding:20px;
  width: 375px;
  max-width:90vw;
  border: thin solid $primary-dark-3;
  background: $primary-dark-1;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  transition: all 0.1s linear
}

.contact-support-modal__center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  color: $low-emphasis-text;
}

.contact-support-modal__button {
    padding : 10px;
    width: 75%;
    border: thin solid $primary-green-200;
    background: $primary-dark-2;
    border-radius: 10px;
    outline : none;
    box-shadow: 0 0px 15px 5px $primary-dark-2;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
    background: none;
    color: $primary-green-200;
    font-size: 1rem;
    cursor: pointer;
}
 .contact-support-modal__button:hover{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }
 .contact-support-modal__button:focus{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }


.contact-support-modal__input-text {
    width : 100%;
    padding:10px;
    border-radius:10px;
    background-color: $primary-dark-3 !important;
    color: $high-emphasis-text !important;
}

.contact-support-modal__input-text:active:hover:focus {
    width : 100%;
    padding:10px;
    border-radius:10px;
    background-color: $primary-dark-3 !important;
    color: $high-emphasis-text !important;
}

hr.contact-support-modal__solid-line {
    border : 0px;
    border-top: 2px solid $low-emphasis-text;
    border-radius: 2px;
    width: 100%;
    margin : auto;
    padding-bottom : 15px;

}
.contact-support-modal__full-width-container{
    display: flex;
    justify-content: center;
    align-items: center;
}

.show{
  margin : auto auto;
}
</style>
