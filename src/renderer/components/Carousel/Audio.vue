<template>
  <div id="audio-player-root">
    <div>
      <audio
        :id="playerid"
        ref="player"
        style="display:none"
      >
        <source
          :src="url"
          type="audio/mpeg"
        >
      </audio>
    </div>
            
    <div>
      <div
        id="player-row"
        class="inline-flex flex-wrap w-full max-w-5xl"
      >
        <div
          id="button-div"
          class="flex-initial pr-3"
        >
          <svg
            v-show="!isPlaying"
            class="play-button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            @click="toggleAudio()"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-show="isPlaying"
            class="play-button"
            xmlns="http://www.w3.org/2000/svg"                            
            viewBox="0 0 20 20"
            fill="currentColor"
            @click="toggleAudio()"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div
          id="progress-bar"
          class="flex-grow bg-white border"
        >
          <div class="overlay-container relative w-full h-full">
            <input
              id="position"
              v-model="playbackTime"
              type="range"
              min="0"
              :max="audioDuration"
              class="slider w-full h-full"
              name="position"
            >
            <div
              v-show="!audioLoaded"
              class="w-full absolute top-0 bottom-0 right-0 left-0 px-2 pointer-events-none"
              style="color: #94bcec"
            >
              Loading please wait...
            </div>
                            
            <div
              v-show="audioLoaded"
              class="flex w-full justify-between absolute top-0 bottom-0 right-0 left-0 px-2 pointer-events-none"
            >
              <span
                class="text-sm"
              > {{ elapsedTime() }} </span>
              /
              <span
                class="text-sm"
              > {{ totalTime() }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {

  props: {
    url : {
      type : String,
      required : true
    },
    playerid : {
      type : String,
      required : true
    }

  },
  setup() {
    const playbackTime = ref(0);
    const audioDuration = ref(100);
    const audioLoaded = ref(false);
    const isPlaying = ref(false);
    const player = ref(null);
    const listenerActive = ref(false);

    function initSlider() {
      var audio = player.value;
      if (audio) {
        audioDuration.value = Math.round(audio.duration);
      }
    }
    function convertTime(seconds){
      const format = val => `0${Math.floor(val)}`.slice(-2);
      //var hours = seconds / 3600;
      var minutes = (seconds % 3600) / 60;
      
      return [minutes, seconds % 60].map(format).join(":");
    }
    function totalTime() {
      var audio = player.value;
      if (audio) {
        var seconds = audio.duration;
        return convertTime(seconds);
      } else {
        return "00:00";
      }
    }
    function elapsedTime() {
      var audio = player.value;
      if (audio) {
        var seconds = audio.currentTime;
        return convertTime(seconds);
      } else {
        return "00:00";
      }
    }
    function playbackListener(e) {
      var audio = player.value;
      playbackTime.value = audio.currentTime;
      audio.addEventListener("ended", endListener);
      audio.addEventListener("pause", pauseListener);
    }
    function pauseListener() {
      isPlaying.value = false;
      listenerActive.value = false;
      cleanupListeners();
    }
    function endListener() {
      isPlaying.value = false;
      listenerActive.value = false;
      cleanupListeners();
    }
    function cleanupListeners() {
      var audio = player.value;
      audio.removeEventListener("timeupdate", playbackListener);
      audio.removeEventListener("ended", endListener);
      audio.removeEventListener("pause", pauseListener);
    }
    function toggleAudio() {
      var audio = player.value;
      if (audio.paused) {
        audio.play();
        isPlaying.value = true;
      } else {
        audio.pause();
        isPlaying.value = false;
      }
    }

    onMounted(()=>{   
      var audio=player.value;
      audio.addEventListener(
        "loadedmetadata",
        function(e) {
          initSlider();
        }.bind(this)
      );
      audio.addEventListener(
        "canplay",
        function(e) {
          audioLoaded.value=true;
        }.bind(this)
      );
    });

    watch(isPlaying, ()=> {
      if(isPlaying.value){
        var audio=player.value;
        initSlider();
       
        if(!listenerActive.value) {
          listenerActive.value=true;
          audio.addEventListener("timeupdate",playbackListener);
        }
      }
    });
    watch(playbackTime,()=>{
      var diff=Math.abs(playbackTime.value-player.value.currentTime);
      if(diff>0.01) {
        player.value.currentTime=playbackTime.value;
      }
    });

 
    return {player,playbackTime,audioDuration,audioLoaded,isPlaying,initSlider,convertTime,totalTime,
      elapsedTime,playbackListener,pauseListener,endListener,cleanupListeners,toggleAudio};
  }
};
</script>

<style lang="scss" scoped>

/* Play/Pause Button */
.play-button{
    height: 45px;
    color : $primary-green-300;
}

.play-button:hover{
    color:$primary-green-400;
    cursor:pointer
}
input[type="range"] {
    margin: auto;
    -webkit-appearance: none;
    position: relative;
    overflow: hidden;
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 0;
    background: transparent;
}
input[type="range"]:focus {
    outline: none;
}
::-webkit-slider-runnable-track {
    background: $primary-dark-3;
}

::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0; 
    height: 40px;
    background: $primary-dark-3;
    box-shadow: -100vw 0 0 100vw $primary-green-400; 
    border: none;
}
::-moz-range-track {
    height: 40px;
    background: $primary-dark-3;
}
::-moz-range-thumb {
    background: $primary-dark-3;
    height: 40px;
    width: 0; /* 20px; */
    border: none; /* 3px solid #999; */
    border-radius: 0 !important;
    box-shadow: -100vw 0 0 100vw $primary-green-400; 
    box-sizing: border-box;
}
::-ms-fill-lower {
    background: $primary-green-400;
}
::-ms-thumb {
    background: $primary-dark-3;
    border: 2px solid $primary-dark-3;
    height: 40px;
    width: 20px;
    box-sizing: border-box;
}
::-ms-ticks-after {
    display: none;
}
::-ms-ticks-before {
    display: none;
}
::-ms-track {
    background: $primary-dark-3;
    color: transparent;
    height: 40px;
    border: none;
}
::-ms-tooltip {
    display: none;
}
</style>
