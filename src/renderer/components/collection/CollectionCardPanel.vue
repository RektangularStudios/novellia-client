<template>
  <div class="card">
    <div class="card__image-container">
      <AsyncImageComponent 
        v-if="isRendered"
        :src="defaultImage"
        :alt="'No Image'"
        class="card__image"
        :should-emit="true"
        @loaded="emitPosition"
      />
    </div>
    <div class="card__info-container">
      <p class="card__market">
        {{ policyName }}
      </p>
      <div class="card__name">
        <p class="card__name--float-left">
          {{ name }} 
        </p>
        <p
          v-if="tokenQuantity !== 0"
          class="card__name--float-right"
        >
          {{ tokenQuantity }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import AsyncImageComponent from "../AsyncImageComponent";
import {ref} from "vue";
export default {
  components: { AsyncImageComponent },
  props: {
    product: {
      type: Object,
      required: true
    },
    shouldEmit: {
      type : Boolean,
      required : false,
      default : false
      
    },
    position: {
      type : Number,
      required : false,
      default : 0
    }
  },
  emits: ["loads"],
  setup(props,{emit}) {
    const name = props.product.token.getName();
    const policyName = props.product.token.getPolicyId();
    const isRendered = ref(false);
    const defaultImage = ref("");
    const tokenQuantity = ref(0);

    function emitPosition(){
      emit("loads",props.position);
   
    }

    async function getDefaultImage(){
      defaultImage.value = await props.product.token.loadDefaultResource();
      tokenQuantity.value = props.product.getTokenQuantity();
      isRendered.value = true;
    }
    getDefaultImage();

    return {name,policyName,defaultImage,isRendered,tokenQuantity,emitPosition};
  }
};
</script>

<style lang="scss" scoped>
.card {
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    height:500px;
    background: $primary-dark-2;
    box-shadow: 0 0px 15px 5px $primary-dark-2;
    -moz-box-shadow: 0 0px 15px 5px $primary-dark-2;
    -webkit-box-shadow: 0 0px 15px 5px $primary-dark-2;
    transition: all 0.5s linear; 
    margin:auto;
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
  height: 80%;
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
  height: 20%;
  padding: 16px;
}
.card__market {
  font-size: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  font-weight: 800;
  color: $low-emphasis-text;
}
.card__name {
  padding: 15px 0;
  display: flex;
  flex-direction: row;
  width : 100%;
}

.card__name--float-left{
  flex: 2;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 1.2rem;
  font-weight: 800;
  color: $high-emphasis-text;
}
.card__name--float-right{
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.2rem;
  font-weight: 800;
  color: $high-emphasis-text;
  text-align: right;
  

}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {

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



</style>
