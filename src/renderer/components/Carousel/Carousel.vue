<template>
  <div
    v-if="activeMedia !== undefined"
    class="carousel"
  >
    <div class="carousel__primary">
      <div  
        v-if="zoomMode && activeMedia.mediaType === 'image'"
        class="carousel__zoom "
        @click="primaryImageClicked(activeMedia.mediaSrc)"
      > 
        <p> Click to enlarge image </p>
      </div>
      <HolographicImage
        v-if="activeMedia.mediaType === 'image'"
        id="carousel__primary-image"
        class="carousel__media"
        :show="activeMedia.title == 'Card' && holographic === true"
        :src="activeMedia.mediaSrc"
        oncontextmenu="return false;"
        @click="primaryImageClicked(activeMedia.mediaSrc)"
      />
      <Video
        v-else-if="activeMedia.mediaType === 'video'"
        class="carousel__media"
        :src="activeMedia.mediaSrc"
        disabled="false"
        oncontextmenu="return false;"
      />
      <iframe
        v-if="activeMedia.mediaType === 'text/html'" 
        :src="activeMedia.mediaSrc" 
        allowtransparency="true" 
        class="carousel__media"
        sandbox="allow-forms allow-modals allow-scripts"
      />
      <model-viewer
        v-else-if="activeMedia.mediaType.indexOf('model') > -1"
        :src="activeMedia.mediaSrc"
        ar
        environment-image="neutral"
        auto-rotate
        camera-controls
        ar-status="not-presenting"
        class="carousel__media"
      />
      <Audio 
        v-else-if="activeMedia.mediaType === 'audio'"  
        class="carousel__media"
        :url="activeMedia.mediaSrc"
        playerid="audio-player"    
      />
    </div>
    <div class="carousel__thumbnails">
      <div
        v-for="cmedia in carouselMedia"
        :key="cmedia"
        :class="cmedia === activeMedia ? 'carousel__thumbnail--selected' : 'carousel__thumbnail'"
        @click="activeMedia = cmedia"
      >
        <img
          v-if="cmedia.mediaType === 'image'"
          class="carousel__media"
          :src="cmedia.thumbnailSrc"
          oncontextmenu="return false;"
        >
        <Video
          v-else-if="cmedia.mediaType === 'video'"
          class="carousel__media"
          :src="cmedia.thumbnailSrc"
          disabled="true"
          oncontextmenu="return false;"
        />
        <div
          v-else-if="activeMedia.mediaType === 'text/html'"
          class="carousel__media-text"
        >
          Interactive
        </div>
        <div
          v-else-if="activeMedia.mediaType.indexOf('model') > -1"
          class="carousel__media-text"
        >
          3D Model
        </div>
        <div
          v-else-if="activeMedia.mediaType === 'audio'"
          class="carousel__media-text"
        >
          Audio
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRef } from "vue";
import Video from "./Video.vue";
import HolographicImage from "./HolographicImage.vue";
import "@google/model-viewer";
import Audio from "./Audio.vue";


export default {
  components: { Video, HolographicImage,Audio},
  props: {
    media: {
      type: Array,
      required: true
    },
    zoomMode: {
      type: Boolean,
      required: true
    },
    holographic: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["primaryImageClicked"],
  setup(props, {emit}) {
    const carouselMedia = toRef(props, "media");
    const activeMedia = ref(carouselMedia.value[0]);
    function primaryImageClicked(img) {
      emit("primaryImageClicked", img);
    }

    return { carouselMedia, activeMedia, primaryImageClicked};
  }
};
</script>

<style lang="scss" scoped>

    .carousel {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }

    .carousel__primary {
        display: flex;
        position: relative;
        width: inherit;
        height: 85%;
        padding: 15px;
        cursor: pointer;
    }

    .carousel__media {
        object-fit: contain;
        object-position: center;
        width: 100%;
        height: 100%;
        border:none;
        overflow:hidden;

    }

    .carousel__media-text{
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .carousel__thumbnails {
        display: flex;
        height: 15%;
        width: 100%;
        overflow: auto;
    }


    .carousel__thumbnail {
        display: flex;
        flex-basis: 25%;
        height: 100%;
        width: 25%;
        padding: 5px 0;
        margin: 0 5px;
        opacity: 0.5;
        cursor: pointer;
        border-radius: 5px;
        cursor: pointer;
        border: thin solid $gray;
    }
    .carousel__thumbnail:hover:not(.carousel__thumbnail--selected) {
        background: $primary-dark-3;
    }

    .carousel__thumbnail--selected {
        display: flex;
        flex-basis: 25%;
        height: 100%;
        width: 25%;
        padding: 5px 0;
        margin: 0 5px;
        background: $primary-dark-2;
        border-radius: 5px;
        border: thin solid $gray;
    }
    
    .carousel__zoom {
      opacity: 0;
      position: absolute;
      color: $high-emphasis-text;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .carousel__zoom:hover {
      opacity: 1;
    }
    .carousel__zoom p {
      position: absolute;
      font-size: 2rem;
      width: 100%;
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }

</style>
