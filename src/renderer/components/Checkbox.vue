<template>
  <div class="checkbox">
    <label
      v-if="textSide==='left' || textSide===''"
      class="checkbox__button__text"
    > {{ text }}</label>
    <div class="checkbox__button-container">
      <div
        v-if="value"
        class="checkbox__button checkbox__container"
        @click="updateValue"
      >
        <i
          class="icon-checkmark checkbox__icon"
        />
      </div>
      <div
        v-else
        class="checkbox__button-not-selected checkbox__container"
        @click="updateValue"
      />
    </div>
    <label
      v-if="textSide==='right'"
      class="checkbox__text"
    > {{ text }}</label>
  </div>
</template>

<script lang = "ts">
import { ref } from "vue";
export default {
  props:{
    name:{
      type:String,
      required:true,
      default:"",
    },
    text:{
      type:String,
      required:false,
      default:"",
    },
    textSide:{
      type:String,
      required:false,
      default:"",
    },
    initialValue:{
      type:Boolean,
      required:false,
      default:false,
    }
  },
    
  emits: ["updateValue"],
  setup(props, {emit}){
    const value = ref<Boolean>(props.initialValue);
    const updateValue = () =>{
      value.value = !value.value;
      emit("updateValue",{item: props.name, value : value.value});
    };
    return{updateValue,value};
  }
};

</script>

<style lang="scss" scoped>
.checkbox{
  display:flex;
  flex-direction: row;
  flex:1;
}

.checkbox__button-text{
  flex:4;
  height: 100%;
  margin-right:20px;
  font-size:1em;
}
.checkbox__container{
  flex:1;
  margin-top:0px;
  margin-left:auto;
  margin-right:0px;
  width:100%;

}

.checkbox__icon{
  color:$primary-green-300;
  size:10px;
}

.checkbox__button-container{
  height:100%;
  flex:1;
}

.checkbox__button{
  height:1.1em;
  width:1.1em;
  min-height: 1.1em;
  min-width: 1.1em;
  max-width: 1.1em;
  max-height:1.1em;
  background-color:transparent;
  border: 2px solid $primary-green-600;
  border-radius : 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox__button-not-selected{
  height:1.1em;
  width:1.1em;
  min-height:1.1em;
  min-width:1.1em;
  max-width:1.1em;
  max-height:1.1em;
  background-color:none;
  border: 2px solid $primary-green-300;
  border-radius : 5px;
}

@media only screen and (max-width: 768px) {
  .checkbox__button{
  height:3em;
  width:3em;
  min-height: 3em;
  min-width: 3em;
  max-width: 3em;
  max-height:3em;
  background-color:transparent;
  border: 2px solid $primary-green-600;
  border-radius : 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox__button-not-selected{
  height:3em;
  width:3em;
  min-height:3em;
  min-width:3em;
  max-width:3em;
  max-height:3em;
  background-color:none;
  border: 2px solid $primary-green-300;
  border-radius : 5px;
}
}

</style>
