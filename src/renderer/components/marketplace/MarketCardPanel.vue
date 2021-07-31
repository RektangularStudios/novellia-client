<template>
  <div class="card">
    <div class="card__image-container">
      <AsyncImageComponent
        v-if="image"
        :src="image"
        :alt="product.productName" 
        class="card__image" 
      />
    </div>
    <div class="card__info-container">
      <p class="card__market">
        {{ product.market.name }}
      </p>
      <p class="card__name">
        {{ product.productName }}
      </p>
      <!-- TODO: hide prices for now -->
      <div class="card__price-container">
        <div
          v-if="!countdownFinished"
          class="card__price--left"
        >
          Coming Soon
        </div>
        <div
          v-if="!countdownFinished"
          class="card__counter"
        > 
          <CountdownWidget
            :event-time="product.metadata.dateAvailable"
            @countdownEnd="countdownFinished=true;"
          />
        </div>
        <div
          v-if="
            countdownFinished &&
              product.pricing.priceUnitAmount &&
              product.pricing.priceUnitAmount > 0
          "
          class="card__price--left"
        >
          <ShoppingWidget
            :id="product.product.productId"
            :max="product.pricing.maxOrderSize"
            button-type="button"
            @click.prevent
          />
        </div>
        <div
          v-if="
            countdownFinished &&
              product.pricing.priceUnitAmount &&
              product.pricing.priceUnitAmount > 0
          "
          class="card__price--right"
        >
          <span class="p-d-flex">
            {{ product.pricing.priceUnitAmount }} 
            <Currency :currency-id="product.pricing.priceCurrencyId" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Currency from "../Currency.vue";
import CountdownWidget from "../../components/CountdownWidget.vue";
import AsyncImageComponent from "../../components/AsyncImageComponent";
import ShoppingWidget from "../shopping/ShoppingWidget.vue";
import { ref } from "vue";
export default {
  components: { Currency, CountdownWidget, AsyncImageComponent,ShoppingWidget},
  props: {
    product: {
      type: Object,
      required: true
    },
    image: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const countdownFinished = ref(false);
    return { countdownFinished };
  }
};
</script>

<style lang="scss" scoped>
.card {
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    height:600px;
    background: $primary-dark-2;
    box-shadow: 0 0px 15px 5px $primary-dark-2;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
    transition: all 0.5s linear; 
}
.card:hover {
    transition: all 0.5s linear;
    background: $primary-dark-3;
    box-shadow: 0 0px 15px 5px $primary-dark-3;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-3;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-3;
}

.card__image-container{
  border-radius: 10px;
  height: 70%;
  overflow:hidden;
  background: $primary-dark-1;
  justify-content: center;
}

.card__image{
  border-radius: 10px;
  object-fit: scale-down;
  object-position: center;
  height: 100%;
  width: 100%;
}

.card__image--loading {
  display: flex;
  height: inherit;
  align-self: center;
  justify-self: center;
}

.card__info-container {
  display: flex;
  flex-direction: column;
  height: 30%;
  padding: 16px;
}
.card__market {
  font-size: 0.8rem;
  font-weight: 800;
  color: $low-emphasis-text;
}
.card__name {
  flex: 1;
  width: 20ch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.2rem;
  font-weight: 800;
  color: $high-emphasis-text;
  padding: 15px 0;
}
.card__price-container {
  display: flex;
  align-content: flex-end;
  justify-content: space-between;
  border-top: thin solid $inactive-state;
  width: 100%;
  flex:1;
}
.card__price--left {
  display: flex;
  font-size: 1rem;
  padding-top: 20px;
  color: $low-emphasis-text;
  align-self: center;
}
.card__price--right {
  display: flex;
  flex-flow: column wrap;
  font-size: 1.2rem;
  padding-top:10px;
  color: $high-emphasis-text;
  align-self: flex-end;
}
.card__counter {
  display: flex;
  flex-flow: column wrap;
  font-size: 1rem;
  padding-top:10px;
  color: $high-emphasis-text;
  align-self: flex-end;
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
  .card__name {
    width: 15ch;
  }
  .card {
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    max-width:60vw;
    height:300px;
    background: $primary-dark-2;
    box-shadow: 0 0px 15px 5px $primary-dark-2;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
    transition: all 0.5s linear; 
    overflow: hidden;
  }
  .card__image-container{
    border-radius: 10px;
    padding: 10px 0;
    overflow:hidden;
    height:50%;
    background: $primary-dark-1;
    justify-content: center;
  }
  .card__info-container {
    display: flex;
    flex-direction: column;
    padding: 16px;
    height:50%;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .card__name {
    width: 25ch;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .card__name {
    width: 20ch;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .card__name {
    width: 25ch;
  }
}

@media only screen and (min-width: 1400px) {
  .card__name {
    width: 20ch;
  }
}

@media only screen and (min-width: 1720px) {
  .card__name {
    width: 25ch;
  }
}

@media only screen and (min-width: 1920px) {
  .card__name {
    width: 25ch;
  }
}

@media only screen and (min-width: 2000px) {
  .items__grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

</style>
