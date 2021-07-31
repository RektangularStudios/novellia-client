<template>
  <div class="container">
    {{ yml }}
  </div>
</template>

<script>
import YAML from "json-to-pretty-yaml";
export default {
  props:{
    json:{
      required : true,
      type : String
    }
  },
  setup(props){
    const jsonItem = JSON.parse(props.json);
    const yml = YAML.stringify(jsonItem).replaceAll("\"","");
    
    return {yml};
  }
};
</script>

<style lang="scss" scoped>
.container{
    padding : 5px;
    white-space: pre;
    .h3{
    color : $primary-green-300;
    font-weight: 900;
    }

}
</style>