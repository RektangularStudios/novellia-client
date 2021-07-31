<template>
  <div class="socials-container">
    <div class="socials p-grid">
      <!--
        these rel="..." are necessary due to a security vulnerability
        https://stackoverflow.com/a/17711167
      -->
      <a
        class="p-col"
        :href="discord"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="icon-discord socials-icon" />
      </a>
      <a
        class="p-col"
        :href="twitter"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="icon-twitter socials-icon" />
      </a>
      <a
        class="p-col"
        :href="reddit"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="icon-reddit socials-icon" />
      </a>
      <a
        class="p-col"
        :href="website"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="icon-earth socials-icon" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Socials",
  data: function() {
    return {
      discord: "https://rektangularstudios.com/discordinvite",
      twitter: "https://twitter.com/NftPool",
      reddit: "https://www.reddit.com/r/OccultaNovellia",
      website: "https://rektangularstudios.com"
    };
  }
};
</script>

<style lang="scss">
.socials-container {
  width: 100%;
  text-align: center;
  margin:0.7em;
  
}

.socials {
  width: 80%;
}

.socials-icon {
  font-size: 1.5rem;
  color: $discord-purple;
}

.socials-icon:hover {
  color: $white !important;
  text-shadow: 0px 0px 5px $white;
}
@media only screen and (max-width: 768px) {
  .socials-icon {
    font-size: 2rem;
    color: $discord-purple;
  }
  .social-container{
      width: 100%;
      text-align: center;
      margin:0.5em;
  }

}
</style>
