<template>
  <div
    v-if="shouldThereBeName"
    :class="getClass()"
    @click="goto"
  >
    <i
      :class="getButtonClass()"
    />
    <slot />
 
    <div
      :class="getTextClass()"
    >
      {{ name }}
    </div>
  </div>
  <div v-else>
    <i
      v-if="icon !== ''"
      :class="getButtonClass()"
      @click="goto"
    />
    <slot />
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
export default {
  props:{
    notActive : {
      type : Boolean,
      required : false,
      default : false
    },
    to : {
      type : String,
      required : false,
      default : ""
    },
    icon : {
      type : String,
      required : false,
      default : ""
    },
    routeContains : {
      type : String,
      required : false,
      default : "",
    },
    name : {
      type : String,
      required : false,
      default : ""
    }
    
  },
  setup(props){
    const route = useRoute();
    const router = useRouter();

    function goto(){
      if(!props.notActive){
        router.push(props.to);
      }
    }

    function getClass(){
      if(props.notActive){
        return "navigation-button";
      }

      if(props.routeContains && props.routeContains !== "" && route.matched.some(item => item.path.includes(props.routeContains))){
        return "navigation-button navigation-button--active";
      }
      if(props.to && props.to !== "" && route.matched.some(item => item.path.includes(props.to))){
        return "navigation-button navigation-button--active";
      }    
      
      return "navigation-button navigation-button--inactive";
    }
    function getButtonClass(){
      if(props.notActive){
        return props.icon + " navigation-button__icon navigation-button__icon--disabled";
      }

      if(props.routeContains && props.routeContains !== "" && route.matched.some(item => item.path.includes(props.routeContains))){
        return props.icon + " navigation-button__icon navigation-button__icon--active";
      }
      if(props.to && props.to !== "" && route.matched.some(item => item.path.includes(props.to))){
        return props.icon + " navigation-button__icon navigation-button__icon--active";
      }    
      
      return props.icon + " navigation-button__icon navigation-button__icon--inactive";
    }

    function getTextClass(){
      if(props.notActive){
        return "navigation-button__text navigation-button__text--disabled";
      }

      if(props.routeContains && props.routeContains !== "" && route.matched.some(item => item.path.includes(props.routeContains))){
        return "navigation-button__text navigation-button__text--active";
      }
      if(props.to && props.to !== "" && route.matched.some(item => item.path.includes(props.to))){
        return "navigation-button__text navigation-button__text--active";
      }    
      
      return "navigation-button__text navigation-button__text--inactive";
    }

    function shouldThereBeName(){
      return props.name !== "";
    }
    return{getButtonClass,goto,shouldThereBeName,getTextClass,getClass};
  }
};

</script>

<style lang="scss" scoped>

.navigation-button {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  margin:auto;
}

.navigation-button--active{
  cursor:pointer !important;
}

.navigation-button--inactive{
  cursor:pointer !important;
}



.navigation-button__icon {
  font-size: 1.5rem;
  margin:0.5rem;

}

.navigation-button__text {
  font-size: 1.5rem;
  flex : 1;
  margin:0.5rem;
}

.navigation-button::-webkit-scrollbar {
  display: none;
}

.navigation-button__icon--disabled {
  color: $disabled-state;
}

.navigation-button__icon--inactive {
  color: $inactive-state;
}

.navigation-button__icon--active {
  color: $primary-green-200;
}

.navigation-button__text--disabled {
  color: $disabled-state;
}

.navigation-button__text--inactive {
  color: $inactive-state;
}

.navigation-button__text--active {
  color: $primary-green-200;
}

.navigation-button__socials{
    display: flex;
    justify-content: center;
    align-items: center;
}

@media only screen and (max-width: 768px) {
  .navigation-button__icon {
    font-size: 2rem;
    margin:0.3em;
  }

.navigation-button__text {
  font-size: 1.5rem;
  flex : 1;
  margin:0.3rem;
}

}

</style>
