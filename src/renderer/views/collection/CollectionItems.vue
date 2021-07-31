<template>
  <div v-if="walletConnected===false">
    No Wallet Connected
  </div>
  <Loading
    v-else
    :rendered="isRendered"
    class="items"
  >
    <div
      v-if="tokenParse.length > 1"
      class="items__grid"
    >
      <div
        v-for="(token,index) in tokenParse"
        :key="token.nativeTokenId"
        class="items__card"
      >
        <CollectionCardPanel
          :product="token"
          :position="index"
          :should-emit="true"
          @click="goto(token.getNativeTokenID())"
          @loads="loaded"
        />
      </div>
    </div>

    <div
      v-else
      class="items__not_connected"
    >
      Wallet Not Connected
      <SearchAddress @submit="submit" />
      <Button
        class="items__button"
        label="Random Tokens"
        @click="goto('random')"
      />
    </div>
  </Loading>
</template>

<script>
import {ref, onUnmounted, onMounted} from "vue";

import store from "../../store";
import Loading from "../../components/Loading.vue";
import CollectionCardPanel from "../../components/collection/CollectionCardPanel";
import { useRoute, useRouter } from "vue-router";
import SearchAddress from "../../components/SearchAddress.vue";


export default {
  components:{Loading, CollectionCardPanel, SearchAddress},
  props: {
    address:{
      type : String,
      required: false,
      default : ""
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const isRendered = ref(false);
    const tokenParse = ref([]);
    const walletConnected = ref(store.getters[walletString + "/getConnected"]);
    let amount = 0;
    const scaleBy = screen.width < 768 ? 10 : 20;
    const scrollComponent = ref(null);
    const walletString =  props.address === "" ? "Wallet" : "TempWallet";

    function submit(address){
      store.commit(walletString + "/setSearchParameters","");
      router.replace({name: "Token Viewer",params:{address : address,}}); 
    }

    function goto(nativeTokenID){
      if(nativeTokenID == "random"){
        router.replace({name: "Token Viewer",params:{address : nativeTokenID,}}); 
        return;
      }
      if(props.address !== "" && typeof props.address !== "undefined" && props.address !== null){
        router.push({name: "Token Viewer - Tokens",params:{nativeTokenID: nativeTokenID,address: props.address,}});
        return;
      }
      router.push({name: "Token Viewer - Tokens",params:{nativeTokenID: nativeTokenID}});
    }

    store.watch(
      (state, getters) => getters[walletString + "/getConnected"],
      (newValue) => {
        walletConnected.value = newValue;   
        if(walletString === "Wallet"){
          router.go();
        }
      }
    );
    async function getTokens(){
      if(walletString === "TempWallet"){
        store.commit(walletString + "/setSearchParameters", props.address);
      }
      await loadMore();
      isRendered.value = true;
    }
    onMounted(() => {
      getTokens(); 
    });

    async function loadMore(){
      const newTokens = await store.dispatch(walletString + "/getProcessedTokens",{amount : amount,scaleBy : scaleBy});
      if (!newTokens) {
        return;
      }

      newTokens.forEach(newToken => {
        const idx = tokenParse.value.findIndex(existingToken =>
          existingToken.getNativeTokenID() === newToken.getNativeTokenID()
        );
        if (idx === -1) {
          // if not, add it
          tokenParse.value = tokenParse.value.concat(newToken);
        } else {
          // if it exists, assume this is an update
          tokenParse.value[idx] = newToken;
        }
      });

      amount = tokenParse.value.length - 1;
    };
    
    function loaded(position){
      if(position > amount - 0.1 *scaleBy){
        loadMore();
      }
    }

    onUnmounted(() => {
      if(route.fullPath.indexOf("random") == -1){
        store.commit(walletString + "/RESET");
      }
    });

    return{isRendered,tokenParse,walletConnected,scrollComponent,loaded,goto,submit};

  }
};
</script>

<style lang="scss" scoped>
.items {
  display: flex;
  height: 100%;
  flex-flow: column nowrap;
  border-top:thin solid $primary-dark-3;
  margin-top: 10px;
  overflow-y:scroll;
}
.items__grid {
  display: grid;
  width: 100%;
  grid-auto-flow: row;
  overflow-y : scroll;
  overflow-x : none;
}
.items__button{
  display:flex;
  width:28%;
  align-self: center;
  background: none;
  border: thin solid $primary-green-200;
  border-radius: 10px;
  padding: 10px 0px;
  color: $primary-green-200;
  font-size: 20px;
  margin:auto;
  margin-top:20px;
  cursor: pointer;
}

.items__button:hover {
  transition: all 0.1s linear;
  box-shadow: 0 0px 5px 0.5px $primary-green-200;
  -moz-box-shadow: 0 0px 5px 0.5px $primary-green-200;
  -webkit-box-shadow: 0 0px 5px 0.5px $primary-green-200;
}
.items__button:active {
  transition: all 0.1s linear;
  box-shadow: 0 0px 10px 0.5px $primary-green-200;
  -moz-box-shadow: 0 0px 10px 0.5px $primary-green-200;
  -webkit-box-shadow: 0 0px 10px 0.5px $primary-green-200;
}

.items__not_connected {
  width : 100%;
}

.items__card {
  padding: 3rem;
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
  .items__grid {
    grid-template-columns: 1fr;
  }

  .items__card {
    padding: 1rem;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .items__grid {
    grid-template-columns: 1fr;
  }
  .items__card {
    padding: 1rem;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 1048px) {
  .items__grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .items__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media only screen and (min-width: 1400px) {
  .items__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media only screen and (min-width: 2200px) {
  .items__grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>