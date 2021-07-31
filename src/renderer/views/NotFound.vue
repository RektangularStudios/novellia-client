<template>
  <div>
    <div class="not-found-container">
      <div>
        <i class="icon-warning not-found-warning-icon" />
        <i class="icon-heart-broken not-found-heart-broken-icon" />
        <i class="icon-wrench not-found-wrench-icon" />
      </div>
      <div class="not-found-text">
        404 Page Not Found
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss">
.not-found-container {
  margin: 0 auto;
  margin-top: 200px;
  max-width: 400px;
}

.not-found-text {
  text-align: center;
  font-size: 2rem;
}

.not-found-warning-icon {
  color: $yellow;
}

.not-found-heart-broken-icon {
  color: $red;
}

.not-found-wrench-icon {
  color: $purplish-grey;
}

.not-found-icon,
.not-found-warning-icon,
.not-found-heart-broken-icon,
.not-found-wrench-icon {
  font-size: 6rem;
  padding: 10px;
}
</style>
