<template>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
  <Loading
    :rendered="isLoaded"
    :class="getApp()"
  >
    <title>Novellia</title>

    <div
      v-if="!isIframe"
      class="app__topbar"
    >
      <Topbar
        @openWalletModal="openWalletModal()"
      />
    </div>
    <IFrameHeader v-else />
    <div
      v-if="!isIframe"
      class="app__sidebar-hamburger-menu"
    >
      <div
        ref="sidebarButton"
        class="app__sidebar-hamburger-menu-button"
        @click="toggle"
      >
        &#9776;
      </div>
    </div>
    <div
      v-if="!isIframe"
      ref="sidebarContainer"
      class="app__sidebar"
    >
      <Sidebar />
    </div>
    
    <router-view
      :key="$route.fullPath"
      class="app__view"
    />
    <PrivacyModal v-if="!isIframe" />
    <WalletModal
      v-if="!isIframe"
      :is-modal-visible="walletModalVisible"
      @closeModal="walletModalVisible=false"
    />
  </Loading>
</template>

<script >
import Sidebar from "./components/navigation/sidebar/Sidebar";
import Topbar from "./components/navigation/topbar/Topbar";
import PrivacyModal from "./components/modal/PrivacyModal";
import WalletModal from "./components/modal/WalletModal";
import { ref } from "vue";
import Loading from "./components/Loading";
import ResetStoreBasedOnConfig from "./store/helper_functions/ResetStoreOnCondition";
import store from "./store";
import IFrameHeader from "./components/IFrameHeader";
import isIframe from "./helper_functions/isRenderedInIframeBool";

export default {
  components: { Topbar, Sidebar, PrivacyModal, WalletModal, Loading, IFrameHeader },
  setup(){
    const walletModalVisible = ref(false);
    const isLoaded = ref(false);
    const sidebarContainer = ref(null);
    const sidebarButton = ref(null);
    if(!isIframe){
      if(store.getters["AcceptCookies/acceptedPrivacyPolicy"]){
        let plausibleScript = document.createElement("script");
        plausibleScript.type = "text/javascript";
        plausibleScript.setAttribute("src", "https://plausible.io/js/plausible.js");
        plausibleScript.defer = true;
        plausibleScript.setAttribute("data-domain", "app.rektangularstudios.com");
        document.head.appendChild(plausibleScript);
      }
    }

    function openWalletModal() {
      walletModalVisible.value = true;
    }

    function toggle(){   
      sidebarContainer.value.classList.toggle("collapsed");
      sidebarButton.value.classList.toggle("collapsed");
    }
  
    if(!isIframe){
      ResetStoreBasedOnConfig();
    }
    
    isLoaded.value = true;

    function getApp(){
      if(!isIframe){
        return "app";
      }
      return "iframeApp";
    }

    return { walletModalVisible, openWalletModal,toggle, sidebarContainer, sidebarButton, isLoaded,getApp, isIframe};

  },
};
</script>

<style lang="scss" scoped>
.app {
  display: grid;
  max-width: 100vw;
  grid-template-columns: 1fr 9fr;
  grid-template-rows: 7% 93%;
  grid-template-areas: 
    "hamburger topbar"
    "sidebar view";
  background: $primary-dark-1;
  height: inherit;
}

.iframeApp{
  max-width: 100vw;
  width: 100%;
  overflow-y : scroll;
  display : block;
  display: relative;
  background: $primary-dark-1;
  height: inherit;
}

.app__topbar {
  grid-area: topbar;
  justify-self: flex-end;
  align-self: center;
}

.app__sidebar {
  grid-area: sidebar;
  background: $primary-dark-2;
}

.app__sidebar-hambuger-menu {
  grid-area: hamburger;
}

.app__sidebar-hamburger-menu-button{
  background: $primary-dark-2;
  color: $opaque;
  font-size: 2rem;
  width : 100%;
  height : 100%;
  text-align : center;
}

.app__view {
  grid-area: view;
  background: $primary-dark-1;
  
}

@media only screen and (max-width: 768px) {
  .app__sidebar {
    left: -100%;
    width: 0px;
    position: relative;
  }
  
  .app__sidebar.collapsed {
    left: 0;
    width:100%;

  }

  .app__sidebar-hamburger-menu-button{
    background: $opaque;
    color: $primary-green-200;
    font-size: 2rem;
    width : 100%;
    height : 100%;
    text-align : center;
  }

  .app__sidebar-hamburger-menu-button.collapsed{
    background: $primary-dark-2;
    color: $primary-green-200;
    font-size: 2rem;
    width : 100%;
    height : 100%;
    text-align : center;
  }

}
/* Extra small devices (phones, 600px and down)  */
@media only screen and (max-width: 600px) {
  .app {
    grid-template-columns: fit-content(2fr) 8fr;
  }
  .app-view {
    overflow-y:scroll;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .app {
    grid-template-columns: min-content fit-content(3fr) 17fr;
}

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .app {
    grid-template-columns: fit-content(1fr) 9fr;   
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .app {
    grid-template-columns: fit-content(1fr) 9fr;
  }
  
}

@media only screen and (min-width: 1200px) {
  .app {
    grid-template-columns: fit-content(1fr) 9fr;   
  }
}


</style>
