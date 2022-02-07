<template>
  <div class="relative h-full min-h-screen bg-gray-back">
    <!--<TheNavBar />-->
    <div class="pt-10 px-10 flex justify-center align-middle">
      <p class="text-4xl pt-3 px-1 mt-1 text-white font-bold tracking-widest">SOLIEN</p>
      <img :width="50" :height="50" src="./assets/400x600.gif" />
      <p class="text-4xl pt-3 px-2 mt-1 text-white font-bold tracking-widest">STAKING</p>
    </div>
    <div class="italic mt-5 text-center text-white">powered by Gemworks</div>

    <div class="p-10">
      <router-view />
    </div>

    <div class="pt-10"></div>
    <TheFooter />
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar';
import TheFooter from '@/components/gem-farm/TheFooter';
import TheCat from '@/components/gem-farm/TheCat';
export default {
  components: {TheCat, TheFooter, TheNavBar },
};
</script>

<style>
* {
  font-family: 'Montserrat', sans-serif;
}
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
