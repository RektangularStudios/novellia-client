<template>
  <div
    ref="element"
    class="app-img"
  >
    <div
      v-if="dataUrl"
      :style="{ background }"
      class="app-img__placeholder"
    >
      <img
        :src="placeholder || dataUrl"
        alt=""
        v-bind="$attrs"
      >
    </div>
    <img
      :src="dataUrl"
      :alt="$attrs.alt || ''"
      v-bind="$attrs"
      class="app-img__img"
    >
  </div>
</template>

<script>
import {ref, onUnmounted, onMounted} from "vue";
export default {
  inheritAttrs: false,

  props: {
    src: {
      type: String,
      required: true,
    },
    placeholder: {
      type : String,
      required : false,
      default: "",
    },
    background: {
      type : String,
      required : false,
      default : ""
    },
    alt: {
      type: String,
      required: false,
      default: ""
    },
    shouldEmit: {
      type: Boolean,
      required : false,
      default: false
    }
  },
  emits:["loaded"],
  setup(props, {emit}){
    const element = ref(null);
    const timeOut = ref(null);
    const observer = ref(null);
    function dataUrl() {
      const { width, height } = this.$attrs;
      if (!width || !height) return "";

      // create a tiny png with matching aspect ratio as img
      const w = 100;
      const canvas = document.createElement("canvas");
      canvas.height = w;
      canvas.height = (width/height) * w;

      return canvas.toDataURL();
    }
  

    onMounted(()=>{
      observer.value = new IntersectionObserver(([entry]) => {
        const img = element.value.querySelector(".app-img__img");
        const placeholder = element.value.querySelector(".app-img__placeholder");
        let srcset;

        img.onload = function() {
          delete img.onload;
          element.value.classList.add("app-img--loaded");
          if (placeholder) {
            timeOut.value = setTimeout(() => {
              placeholder.remove();
            }, 300);
          }
        };
        if (entry.isIntersecting) {
          if(props.shouldEmit){
            emit("loaded");
          }
          if (!!srcset) {
            img.srcset = srcset;
          }
          img.src = props.src;
          observer.value.disconnect();
        }
      });
      observer.value.observe(element.value);
    });

    onUnmounted(() => {
      if(observer.value){
        observer.value.disconnect();
      }
      
      if (timeOut.value) {
        clearTimeout(timeOut.value);
      }
    });
    return {dataUrl,timeOut,element};
  }
};
</script>

<style type="scss" scoped>
.app-img {
  width:100%;
  height:100%;
}

.app-img__placeholder {
  position: absolute;
  overflow: hidden;
}

.app-img__placeholder img {
  transform: scale(1.05);
  filter: blur(10px);
}

.app-img__img {
  opacity: 0;
  transition: opacity 300ms ease;
  object-fit: scale-down;
  object-position: center;
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.app-img--loaded .app-img__img {
  opacity: 1;
  object-fit: scale-down;
  object-position: center;
  max-width:100%;
  max-height:100%;
  display:block;
  margin:auto;
}
</style>