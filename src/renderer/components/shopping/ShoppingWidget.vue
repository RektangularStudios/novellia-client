<template>
  <div v-if="buttonType == 'vertical'">
    <InputNumber
      v-model="value"
      mode="decimal"
      :min="0"
      :max="max"
      show-buttons
      button-layout="vertical"
      increment-button-class="shopping-widget__buttonClass"
      decrement-button-class="shopping-widget__buttonClass"
      increment-button-icon="icon-plus"
      decrement-button-icon="icon-minus"
      input-class="shopping-widget"
    />
  </div>
  <div v-else-if="buttonType == 'horizontal'">
    <InputNumber
      v-model="value"
      mode="decimal"
      :min="0"
      :max="max"
      show-buttons
      button-layout="horizontal"
      increment-button-class="shopping-widget__buttonClass"
      decrement-button-class="shopping-widget__buttonClass"
      increment-button-icon="icon-plus"
      decrement-button-icon="icon-minus"
      input-class="shopping-widget"
    />
  </div>
  <div v-else-if="buttonType == 'stacked'">
    <InputNumber
      v-model="value"
      mode="decimal"
      :min="0"
      :max="max"
      show-buttons
      input-class="shopping-widget"
    />
  </div>
  <div v-else-if="buttonType == 'button'">
    <Button
      v-model="value"
      label="Add to Cart"
      class="shopping-widget shopping-widget__button"
      @click="addToCart"
    />
  </div>
  <div v-else>
    <InputNumber
      v-model="value"
      mode="decimal"
      :min="0"
      :max="max"
      input-class="shopping-widget"
    />
  </div>
</template>

<script>
import store from "../../store";
export default {
  name: "ShoppingWidget",
  props: {
    id: {
      type: String,
      required: true
    },
    buttonType: {
      type: String,
      required: false,
      default:""
    },
    inputClass:{
      type: String,
      required: false,
      default: ""
    },
    max:{
      type: Number,
      required: false,
      default: 4
    }
  },
  data() {
    return {
      value:
        typeof store.getters["ShoppingCart/getItemFromCartById"](this.id) !== "undefined"
          ? store.getters["ShoppingCart/getItemFromCartById"](this.id).quantity
          : 0
    };
  },
  watch: {
    value: function() {
      store.commit("ShoppingCart/updateCart", { productId: this.id, quantity: this.value });
    }
  },
  methods: {
    addToCart(){
      if(this.value < this.max){
        this.value++;
      } 
    }
  },
};
</script>
<style lang="scss">
  .shopping-widget{
    position:relative;
    width:100%;
    height:auto;
    padding:2px;
    text-align:center;
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
  }

  .shopping-widget__button{
    padding:0.5rem;
  }

  .shopping-widget__buttonClass{
    padding:0.4em;
    background: $primary-dark-2;
    border-radius: 10px;
    color: $primary-green-200;
  }

  @media only screen and (max-width: 768px) {
    .shopping-widget{
      position:relative;
      width:100%;
      height:auto;
      padding:2px;
      text-align:center;
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
    }
    .shopping-widget__button{
      padding:0.5rem;
    }
  }

</style>
