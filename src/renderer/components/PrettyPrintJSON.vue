<template>
  <pre class="container">{{ jsonItem }}</pre>
</template>

<script>

export default {

  props:{
    json:{
      required : true,
      type : String
    }
  },
  setup(props){
    const jsonItem = JSON.stringify(JSON.parse(props.json), null, 2);
    return {jsonItem};
  }
};
</script>

<style lang="scss" scoped>
.container{
    overflow-x : auto;

}

</style>