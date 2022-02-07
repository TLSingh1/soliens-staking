<template>
  <div class="static p-5 shadow-2xl bg-gradient-to-tl from-teal-200 via-blue-500 to-deep-purple-accent-400 rounded-lg with-title mt-0">
          <h2 class="title text-3xl font-bold tracking-tight p-3 text-white mb-10">
            Your 
            <span class="relative inline-block px-2">
            <div class="absolute inset-0 transform -skew-x-12 bg-teal-accent-400"></div>
            <span class="relative text-teal-900">Staking Account</span>
            </span>
            <!--<span class="relative inline-block">
              Staking Account
            <div class="w-full h-3 -mt-3 bg-teal-200"></div>
          </span>-->
          </h2>
    <div class="mb-2 text-white font-semibold">
      state:
      <p class="inline-block text-black bg-teal-200">
        {{ parseFarmerState(farmerAcc) }}
      </p>
    </div>
    <div class="mb-2 text-white font-light"><span class="font-semibold">Your identity:</span> {{ farmerAcc.identity.toBase58() }}</div>
    <div class="mb-2 text-white font-light"><span class="font-semibold">Associated vault:</span> {{ farmerAcc.vault.toBase58() }}</div>
    <div class="mb-2 text-white font-light"><span class="font-semibold">Gems staked:</span> {{ farmerAcc.gemsStaked }}</div>
    <div class="mb-2 text-white font-light">
      <span class="font-semibold">Min staking ends:</span> {{ parseDate(farmerAcc.minStakingEndsTs) }}
    </div>
    <div class="mb-5 text-white font-light">
      <span class="font-semibold">Cooldown ends:</span> {{ parseDate(farmerAcc.cooldownEndsTs) }}
    </div>

    <div class="flex mb-5">
      <div class="flex-1 mr-5 text-black font-bold">
        <FarmerRewardDisplay
          :key="farmerAcc.rewardA"
          :farmReward="farmAcc.rewardA"
          :reward="farmerAcc.rewardA"
          title="REWARD"
          class="border-black rounded-lg"
        />
      </div>
      <!--<div class="flex-1">
        <FarmerRewardDisplay
          :key="farmerAcc.rewardB"
          :farmReward="farmAcc.rewardB"
          :reward="farmerAcc.rewardB"
          title="Reward B"
        />
      </div>-->
    </div>
    <button class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded shadow-md md:w-auto hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-primary mb-5" @click="refreshFarmer">
      Refresh account
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import FarmerRewardDisplay from '@/components/gem-farm/FarmerRewardDisplay.vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import { parseDate } from '@/common/util';

export default defineComponent({
  components: { FarmerRewardDisplay },
  props: {
    farm: String,
    farmAcc: Object,
    farmer: String,
    farmerAcc: Object,
  },
  emits: ['refresh-farmer'],
  setup(props, ctx) {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      gf = await initGemFarm(getConnection(), getWallet()!);
    });

    //need an onmounted hook because this component isn't yet mounted when wallet/cluster are set
    onMounted(async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
      }
    });

    // --------------------------------------- display farmer
    // todo ideally should be using one from client, but n/a during render
    const parseFarmerState = (farmer: any): string => {
      return Object.keys(farmer.state)[0];
    };

    const refreshFarmer = async () => {
      await gf.refreshFarmerWallet(
        new PublicKey(props.farm!),
        new PublicKey(props.farmer!)
      );
      ctx.emit('refresh-farmer');
    };

    return {
      refreshFarmer,
      parseFarmerState,
      parseDate,
    };
  },
});
</script>

<style scoped></style>
