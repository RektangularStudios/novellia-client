<template>
  <video
    v-if="disabled === 'true'"
    class="video--disabled"
  >
    <source
      :src="src"
      type="video/mp4"
    >
    Your browser does not support the video tag.
  </video>
  <video
    v-else
    class="video"
    controls
    controlsList="nodownload"
  >
    <source
      :src="src"
      type="video/mp4"
    >
    Your browser does not support the video tag.
  </video>
</template>

<script>
export default {
  name: "Video",
  props: {
    src: {
      type: String,
      required: true
    },
    disabled: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
  .video {
    width: 100%;
    height: 100%;
  }
  .video--disabled {
    width: 100%;
    height: 100%;
  }
</style>
