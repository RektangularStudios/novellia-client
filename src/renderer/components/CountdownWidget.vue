<template>
  <div class="countdown">
    <p class="countdown__days--number">
      {{ days }}
    </p>
    <p class="countdown__days--text">
      Days
    </p>
    <p class="countdown__hours--number">
      {{ hours }}
    </p>
    <p class="countdown__hours--text">
      Hours
    </p>
    <p class="countdown__mins--number">
      {{ minutes }}
    </p>
    <p class="countdown__mins--text">
      Mins
    </p>
    <p class="countdown__sec--number">
      {{ seconds }}
    </p>
    <p class="countdown__sec--text">
      Sec.
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import moment from "moment";

export default {
  props: {
    eventTime: {
      type: String,
      required: true
    }
  },
  emits: ["countdownEnd"],
  setup(props, {emit}) {
    const startTime = ref("");
    const days = ref("");
    const hours = ref("");
    const minutes = ref("");
    const seconds = ref("");

    function timerCount(startTime) {
      const now = moment().unix();
      const diff = startTime - now;
      if (diff < 0) {
        return true;
      }
      const duration = moment.duration(diff * 1000, "milliseconds");
      days.value = duration
        .asDays()
        .toString()
        .split(".")[0];
      hours.value = duration.hours().toString();
      minutes.value = duration.minutes().toString();
      seconds.value = duration.seconds().toString();

      return false;
    }
    onMounted(() => {
      startTime.value = moment(props.eventTime).unix();
      const interval = 1000;
      let completed = false;
      timerCount(startTime.value);
      setInterval(() => {
        completed = timerCount(startTime.value);
        if (completed) {
          emit("countdownEnd");
          clearInterval();
        }
      }, interval);
    });
    return { startTime, days, hours, minutes, seconds };
  },
  computed: {
    moment: () => moment
  }
};
</script>

<style lang="scss">

.countdown {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 
    "days-num hours-num min-num sec-num"
    "days-text hours-text min-text sec-text";
  text-align: center;
  column-gap: 5px;
}
.countdown__days--number {
  grid-area: days-num;
}
.countdown__days--text {
  grid-area: days-text;
}
.countdown__hours--number {
  grid-area: hours-num;
}
.countdown__hours--text {
  grid-area: hours-text;
}
.countdown__mins--number {
  grid-area: min-num;
}
.countdown__mins--text {
  grid-area: min-text;
}
.countdown__sec--number {
  grid-area: sec-num;
}
.countdown__sec--text {
  grid-area: sec-text;
}
</style>
