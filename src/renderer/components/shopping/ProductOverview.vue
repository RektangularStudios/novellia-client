<template>
  <div
    ref="container"
    class="product-overview product-overview__row"
  >
    <ShoppingWidget
      :id="productId"
      :max="max"
      button-type="vertical"
      class="product-overview__container-center"
    />
    <img
      v-if="showImage"
      :src="image"
      :alt="name" 
      class="product-overview__card-image product-overview__container"
    >
    <div class="product-overview__container-3">
      <h2> {{ name }} </h2> <br>
      <div class="product-overview__row">
        <h3> {{ price }}</h3><Currency
          :currency-id="coin"
          class="product-overview__currency-symbol"
        />
      </div>
    </div>
    <div class="product-overview__container product-overview__row">
      <Button
        class="product-overview__exit-button"
        @click="close"
      >
        X
      </Button>
    </div>
  </div>
</template>

<script>
import ShoppingWidget from "./ShoppingWidget.vue";
import Currency from "../Currency.vue";
import {ref, onMounted} from "vue";
export default {
  components: { ShoppingWidget,Currency},
  props: {
    name : {
      type : String,
      required : true,
    },
    image : {
      type : String,
      required : true,
    },
    max : {
      type : Number,
      required : true,
    },
    price : {
      type : Number,
      required : true,
    },
    coin : {
      type : String,
      required : true,
    },
    productId : {
      type : String,
      required : true,
    },
  },
  emits: ["close"],
  setup(props, {emit}){
    const container = ref(null);
    const showImage = ref(true);
    
    const close = () =>{
      emit("close",props.productId);
    };

    function screenCheck(){    
      let item = container.value.clientWidth;
      if(item){
        return item > 400;
      }
      return true;
    }

    onMounted(()=> {showImage.value = screenCheck();});
    

    return{close, container, showImage};
  }
};
</script>
<style lang="scss" scoped>
.product-overview{
  background-color : $primary-dark-3;
  margin:10px;
  border-radius:20px;
  padding: 10px;
  height:100px;
}

.product-overview__row{
  display: flex;
  flex-flow: row nowrap;
}

.product-overview__card-image{
  max-height:100px;
  max-width:auto;
  object-position: center;
  object-fit:contain;
}

.product-overview__container{
  flex:1;
  padding-right : 0.5rem;
}

.product-overview__container-center{
  flex:1;
  justify-content: center;
  padding-right : 0.5rem;
}

.product-overview__container-3{
  flex:3;
  min-width: 0;
  vertical-align: top;
  h2 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color:$high-emphasis-text;
  }
  h3 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color:$high-emphasis-text;
  }
}
.product-overview__row{
  display:relative;
}
.product-overview__currency-symbol{
  color:$high-emphasis-text;
  padding-top:4px;
}

.product-overview__exit-button{
  border: none;
  font-size: 1rem;
  padding: 5px;
  cursor: pointer;
  font-weight: bold;
  color: $low-emphasis-text;
  background: transparent;
  outline:none;
  margin-top: -50%;
  margin-left: auto;
}

@media only screen and (max-width: 768px) {
.product-overview__exit-button{
  font-size: 2rem;
}
}
</style>

