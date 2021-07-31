<template>
  <div
    v-for="att in attribution"
    :key="att.authorName"
    class="artist-detail"
  >
    <p>{{ att.authorName }} | {{ att.workAttributed }}</p>
    <div
      v-for="url in att.url"
      :key="url"
    >
      <p>
        <a
          :href="url"
          class="artist-detail__url"
        > {{ url }} </a>
      </p>
    </div>
  </div>
</template>

<script lang = "ts">
export default {
  props:{
    attribution:{
      type:Array,
      required:true,
    },
  },
};
</script>

<style lang="scss" scoped>
.artist-detail__url{
    color:$low-emphasis-text;
    p{
      padding:3px;
      font-size: 1rem;
    }
}
.artist-detail{
    padding-bottom:5px;
}
</style>
