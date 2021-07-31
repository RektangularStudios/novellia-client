<template>
  <Modal
    v-show="isModalVisible"
    :x-button="false"
  >
    <template #body>
      <div class="privacy-modal">
        <div class="privacy-modal__center">
          <h1>Privacy Policy</h1>
        </div>
        <p>This website uses cookies in order to provide you the best possible user experience. We do not collect your data to sell to third parties, or for advertising purposes. </p>
        <a
  
          href="https://www.privacypolicies.com/live/4e6056d1-060e-4835-8207-3647375d47c6/"
          target="_blank"
          rel="noopener noreferrer"
          class="privacy-modal__a--text"
        >See our privacy policy here.</a>
        <Button
          type="button"
          label="I agree to the privacy policy"
          class="privacy-modal__close-button"
          @click="closeModal"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import store from "../../store";
export default {
  components: { Modal },
  data() {
    return {
      isModalVisible: !store.getters["AcceptCookies/acceptedPrivacyPolicy"]
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      store.commit("AcceptCookies/submitPrivacyPolicy");
    }
  }
};
</script>

<style lang="scss" scoped>
.privacy-modal {
  height: 100%;
  width: 480px;
  max-width:90vw;
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  border: thin solid $primary-dark-3;
  background: $primary-dark-1;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  transition: all 0.1s linear;
  h1{
    color : $low-emphasis-text;
  }
  p{
    color : $high-emphasis-text;
  }
  a{
    color : $high-emphasis-text;
  }
}
.privacy-modal__close-button {
  margin-top: 20px;
  padding: 15px;
  width: 100%;
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
.privacy-modal__close-button:hover:focus{
  .contact-support-modal__button:hover{
   box-shadow: 0 0px 15px 5px $primary-dark-3;
  -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
  -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
  outline: none;
 }
}
.privacy-modal__center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.privacy-modal__a--text {
  text-decoration: underline;
}








</style>
