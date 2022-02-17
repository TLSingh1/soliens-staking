<template>
  <div class="static overflow-hidden p-5 shadow-2xl bg-gradient-to-tl from-teal-200 via-blue-500 to-deep-purple-accent-400 rounded-xl with-title mt-0">
          <div class="darken overflow-hidden absolute bg-black w-full h-24 inset-0 z-0 opacity-20"></div>
          <h2 class="title text-3xl font-bold tracking-tight p-3 text-white mb-10 z-10">
            Your 
            <span class="relative inline-block px-2">
            <div class="absolute inset-0 transform -skew-x-12 hrhighlightblur"></div>
            <div class="absolute inset-0 transform -skew-x-12 hrhighlight"></div>
            <span class="relative text-black">Staking Account</span>
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
    <hr class="solid border-black opacity-20"><div class="my-2 text-white font-light"><span class="font-semibold">Your identity:<br></span> {{ farmerAcc.identity.toBase58() }}</div>
    <hr class="solid border-black opacity-20"><div class="my-2 text-white font-light"><span class="font-semibold">Associated vault:<br></span> {{ farmerAcc.vault.toBase58() }}</div>
    <hr class="solid border-black opacity-20"><div class="my-2 text-white font-light"><span class="font-semibold">NFTs staked:<br></span> {{ farmerAcc.gemsStaked }}</div>
    <hr class="solid border-black opacity-20"><div class="my-2 text-white font-light">
      <span class="font-semibold">Min staking ends:</span> {{ parseDate(farmerAcc.minStakingEndsTs) }}
    </div>
    <hr class="solid border-black opacity-20"><div class="mb-5 text-white font-light">
      <span class="font-semibold">Cooldown ends:</span> {{ parseDate(farmerAcc.cooldownEndsTs) }}
    </div>

    <div class="flex mb-5">
      <div class="flex-1 mr-5 text-black font-bold ">
        <FarmerRewardDisplay
          :key="farmerAcc.rewardA"
          :farmReward="farmAcc.rewardA"
          :reward="farmerAcc.rewardA"
          title="Reward"
          class="border-0 bg-reward shadow-lg rounded-xl"
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
    <button class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-primary mb-5" @click="refreshFarmer">
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

<style>
.bg-reward {
  background-color: rgba(0, 0, 0, 0.2);
}
.hrhighlight {
    
    //width: 100%;
    //height: 50px;
    display: block;
    position: relative;
    left: 0px;
    top: 0px;

    //margin-bottom: 0em;
    //padding: 0;
    //border-style: solid;
    z-index: 0;    
}
.hrhighlight:after {
  content: "";
        position: absolute;

        width: 100%;
        left: 0px;
        top: -2px;
        height: 40px;

        transition: opacity 0.3s ease, animation 0.3s ease;

        background: linear-gradient(
            to right, 
            #62efab 15%,  
            #EB1AFA 50%, 
            #82fff4 75%, 
            #62efab 80%);

        background-size: 800%;
        background-position: 0%;
        animation: bar 12s linear infinite;

}

.hrhighlight:before {
  content: "";
        position: relative;

        width: 100%;
        //height: 30px;
        //bottom: 50%;
        left: -500px;
        background: linear-gradient( 45deg, #212121 0%);
        background-size: 15px;
        background-position: center;
}

.hrhighlightblur {
    
    //width: 100%;
    //height: 50px;
    display: block;
    position: relative;
    left: 0px;
    top: 0px;
    filter: blur(20px);


    //margin-bottom: 0em;
    //padding: 0;
    //border-style: solid;
    z-index: 0;    
}
.hrhighlightblur:after {
  content: "";
        position: absolute;

        width: 100%;
        left: 0px;
        top: -2px;
        height: 40px;

        transition: opacity 0.3s ease, animation 0.3s ease;

        background: linear-gradient(
            to right, 
            #62efab 15%,  
            #EB1AFA 50%, 
            #82fff4 75%, 
            #62efab 80%);

        background-size: 800%;
        background-position: 0%;
        animation: bar 12s linear infinite;

}

.hrhighlightblur:before {
  content: "";
        position: relative;

        width: 100%;
        //height: 30px;
        //bottom: 50%;
        left: -500px;
        background: linear-gradient( 45deg, #212121 0%);
        background-size: 15px;
        background-position: center;
}

@keyframes bar {
    0% { background-position: 0%; }
    100% { background-position: 800%; }
}
</style>
