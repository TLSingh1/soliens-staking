<template>
  <div class="footer pt-1 pb-1">
    <p class="px-3">Built with</p>
    <img class="pb-3" src="../../assets/heart.png">
    <p class="px-3">
      by
      <a
        class="nes-text is-primary"
        href="https://twitter.com/SoliensNFT"
        target="_blank"
        >@SoliensNFT</a
      >
      | powered by
      <a
        class="nes-text is-primary"
        href="https://github.com/gemworks/gem-farm"
        target="_blank"
        >GemFarms</a
      >
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.footer {
  @apply w-full flex justify-center align-middle text-center;
  position: absolute;
  bottom: 0px;
  height: 40px;
  color: white;
}
</style>
