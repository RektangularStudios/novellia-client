<template>
  <div class="collection">
    <div class="collection__topbar">
      <p class="collection__link">
        Token Viewer
      </p>
      <div class="collection__click">
        <SearchModal
          :is-modal-visible="isSearchOpen"
          @closeModal="closeModal"
        >
          <i
            class="icon-search collection__sync" 
            @click="openModal"
          />
        </SearchModal>
      
        <!--<i
          class="icon-loop2 collection__sync"
          @click="click"
        />-->
      </div>
    </div>
    <CollectionItems :address="address" />
  </div>
</template>

<script>
import CollectionItems from "./collection/CollectionItems";
import SearchModal from "../components/modal/SearchModal.vue";
import store from "../store";
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
export default {
  components: {CollectionItems,SearchModal},
  setup(){
    const route = useRoute();
    const isSearchOpen = ref(false);
    const address = route.params.address ? route.params.address : "";
    const walletString = address === "" ? "Wallet" : "TempWallet";
    
    async function click(){
      await store.dispatch(walletString + "/syncTokens");
      router.go();
    }

    function openModal(){
      isSearchOpen.value = true;
    }

    function closeModal(address){
      isSearchOpen.value = false;
      store.commit("TempWallet/setSearchParameters","");
      router.replace({name: "Token Viewer",params:{address : address,}}); 
    }

    

    return {click,address,closeModal,isSearchOpen,openModal};
  }
};
</script>

<style lang="scss" scoped>

  .collection {
    display: flex;
    flex-flow: column nowrap;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .collection__click {
    display: flex;
    flex-flow :row nowrap;
    justify-content: flex-end;
    width:100%;

  }

  .collection__sync {
    display : flex;
    order : 2;
    font-size:1.5rem;
    padding:1rem;
    color : $inactive-state;
    cursor : pointer;
  }

  .collection__topbar {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .collection__link {
    margin-right: 2em;
    color: $primary-green-200;
    cursor: pointer;
  }
</style>