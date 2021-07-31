<template>
  <div class="marketplace">
    <div class="marketplace__topbar">
      <p class="marketplace__link marketplace__link--inactive">
        Games
      </p>
      <router-link
        to="/marketplace/items"
        class="marketplace__link marketplace__link--inactive"
      >
        Items
      </router-link>
    </div>
    <transition>
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>


 
</script>

<style lang="scss" scoped>

  .marketplace {
    display: flex;
    flex-flow: column nowrap;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .marketplace__topbar {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    
  }
  .marketplace__link {
    margin-right: 2em;
  }
  
  .marketplace__link--inactive {
    color: $inactive-state;
  }
  
  a.router-link-active {
    color: $primary-green-200;
  } 

</style>
