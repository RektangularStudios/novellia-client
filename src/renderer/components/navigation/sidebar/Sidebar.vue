<template>
  <div
    ref="sidebarContainer"
    class="sidebar"
    @mousedown="mouseDown" 
    @mousemove="mouseMove" 
    @mouseup="mouseUp" 
    @mouseleave="mouseUp"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
    @touchcancel="touchEnd"
  >
    <img
      class="sidebar__logo"
      src="../../../assets/images/logo/novellia_logo_fitted.svg"
    >
    <NavigationButton
      :not-active="true"
      icon="icon-home"
      name="Home"
    />
    <NavigationButton
      :not-active="false"
      icon="icon-price-tags"
      to="/marketplace"
      name="Store"
    />
    <NavigationButton
      :not-active="false"
      icon="icon-books"
      to="/tokenviewer"
      name="Token Viewer"
    />
    <NavigationButton
      :not-active="true"
      icon="icon-users"
      name="Users"
    />    
    <NavigationButton
      :not-active="true"
      icon="icon-library"
      name="Games"
    />
    <CopyrightAndPrivacy />
    <Socials class="sidebar__socials" />
  </div>
</template>

<script>
import CopyrightAndPrivacy from "../../CopyrightAndPrivacy";
import Socials from "../../Socials";
import NavigationButton from "../NavigationButton";
import {ref} from "vue";
export default {
  components:{CopyrightAndPrivacy,Socials, NavigationButton},
  setup(){
    let position = {y:0,scrollable:false};
    const sidebarContainer = ref(null);
    function touchStart(event){
      position.y = event.touches[0].clientY;
      position.scrollable = true;
      
      sidebarContainer.value.style.cursor = "grabbing";
      sidebarContainer.value.style.userSelect = "none";
    }
    
    function touchMove(event){
      if(position.scrollable){
        const dy = event.touches[0].clientY - position.y;
        sidebarContainer.value.scrollTop = position.y - dy;
      }
    }

    function touchEnd(event){
      position.scrollable = false;
      sidebarContainer.value.style.cursor = "grab";
      sidebarContainer.value.style.removeProperty("user-select");
    }

    function mouseDown(event){
      position.y = event.clientY;
      position.scrollable = true;
      sidebarContainer.value.style.cursor = "grabbing";
      sidebarContainer.value.style.userSelect = "none";
      
    }
        
    function mouseMove(event){
      if(position.scrollable){
        const dy = event.clientY - position.y;
        sidebarContainer.value.scrollTop = position.y - dy;
      }
    }
        
    function mouseUp(event){
      position.scrollable = false;
      sidebarContainer.value.style.cursor = "grab";
      sidebarContainer.value.style.removeProperty("user-select");
    }

    return{sidebarContainer,mouseDown,mouseMove,mouseUp,touchStart,touchMove,touchEnd};
  }
};

</script>

<style lang="scss" scoped>

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow:scroll;
   overflow-y: scroll; 
  overflow-x: hidden; 
  transition: 0.5s; 
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sidebar::-webkit-scrollbar {
  display: none;
}

.sidebar__logo {
  display: block;
  margin: 0 auto;
  width: 60%;
  height: auto;
  padding: 15px 0;
}

.sidebar__socials{
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
