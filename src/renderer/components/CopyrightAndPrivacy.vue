<template>
  <div class="copyright-container">
    <div class="copyright">
      &#169;REKTANGULAR<br>STUDIOS INC. {{ year }}
    </div>
    <div class="privacy">
      <a
        href="https://www.privacypolicies.com/live/4e6056d1-060e-4835-8207-3647375d47c6/"
        target="_blank"
        rel="noopener noreferrer"
        class="privacy"
      >Privacy Policy</a>
    </div>
    <span class="version-number-text">{{ version.version }} - {{ version.date }}</span>
  </div>
</template>
<script>
import config from "../config";
export default {
  name: "Copyright",
  setup(){
    const year = new Date().getFullYear();
    let version = {
      version: config.version.version,
      date: config.version.date,
    };
 
    return {year,version};
  }
};
</script>
<style lang="scss">
.copyright-container {
  width: 100%;
}
.copyright {
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  width: 100%;
}
.privacy {
  padding-top: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.version-number-text {
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
