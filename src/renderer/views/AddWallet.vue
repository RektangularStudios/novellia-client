<template>
  <div class="p-grid p-justify-start p-nogutter app">
    <div class="p-col popup-box-selection">
      <i class="pi pi-plus icon-formatting" />
      <p class="text-formatting">
        New Wallet
      </p>
    </div>

    <router-link
      class="p-col popup-box-selection"
      to="/sync/wallet-type"
    >
      <i class="pi pi-refresh icon-formatting" />
      <p class="text-formatting">
        Sync Wallet
      </p>
    </router-link>
  </div>
</template>

<style lang="scss">
.popup-box-selection {
  border-width: 1px;
  border-color: $pearl;
  border-radius: 40px;
  background-color: $darksilver;
  margin: 50px;
  text-align: center;
  height: 40%;
  padding: 50px;
  display: grid;
  align-items: center;
}

.popup-box-selection:hover {
  background-color: $emerald;
  transition: 0.3s;
}

.text-formatting {
  font-size: 1.3rem;
}
.icon-formatting {
  font-size: 2.5rem;
  color: white;
}
</style>
