<template>
<!--<canvas class="webgl"></canvas>-->
<div class="hr"></div>
<div class="hrblur"></div>
  <ConfigPane />
  <div v-if="!wallet" class="text-center font-bold text-white">Connect Wallet</div>
  <div v-else>
    <!--farm address-->
    <div class="relative ">
    <!--<div class="absolute inset-x-0 bottom-0">
      <svg viewBox="0 0 224 12" fill="currentColor" class="w-full -mb-1 text-gray-back" preserveAspectRatio="none">
        <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z"></path>
      </svg>
    </div>-->
    <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div class="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
        <!--<h2 class="mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
          Enter
          <span class="relative inline-block px-2">
            <div class="absolute inset-0 transform -skew-x-12 bg-teal-accent-400"></div>
            <span class="relative text-teal-900">Farm ID</span>
          </span>
        </h2>
        <form class="flex flex-col items-center w-full mb-4 md:flex-row md:px-16">
          <input
            id="farm"
            placeholder="Farm ID"
            required=""
            type="text"
            class="flex-grow w-full h-12 px-4 mb-5 text-white transition duration-200 border-2 border-transparent rounded-xl appearance-none md:mr-2 md:mb-0 bg-deep-purple-900 focus:border-teal-accent-700 focus:outline-none focus:shadow-outline"
            v-model="farm"
          />
        </form>-->

        <div v-if="farmerAcc">
      <FarmerDisplay
        :key="farmerAcc"
        :farm="farm"
        :farmAcc="farmAcc"
        :farmer="farmer"
        :farmerAcc="farmerAcc"
        class="mb-10"
        @refresh-farmer="handleRefreshFarmer"
      />
      <Vault
        :key="farmerAcc"
        class="mb-10"
        :vault="farmerAcc.vault.toBase58()"
        @selected-wallet-nft="handleNewSelectedNFT"
      >
        <button
          v-if="farmerState === 'staked' && selectedNFTs.length > 0"
          class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-primary mr-5"
          @click="addGems"
        >
          Add Gems (resets staking)
        </button>
        <button
          v-if="farmerState === 'unstaked'"
          class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-success mr-5"
          @click="beginStaking"
        >
          Begin staking
        </button>
        <button
          v-if="farmerState === 'staked'"
          class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-error mr-5"
          @click="endStaking"
        >
          End staking
        </button>
        <button
          v-if="farmerState === 'pendingCooldown'"
          class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-error mr-5"
          @click="endStaking"
        >
          End cooldown
        </button>
        <button class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-warning" @click="claim">
          Claim {{ availableA }} Reward
        </button>
      </Vault>
    </div>
    <div v-else>
      <div class="w-full text-center text-white mb-5">
        Farmer account not found :( Create a new one?
      </div>
      <div class="w-full text-center">
        <button class="w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-black bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary" @click="initFarmer">
          New Farmer
        </button>
      </div>
    </div>
  </div>

        
      </div>

    </div>
  </div>

</template>



<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import ConfigPane from '@/components/ConfigPane.vue';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { INFT } from '@/common/web3/NFTget';
import { stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';

export default defineComponent({
  components: { Vault, FarmerDisplay, ConfigPane },
  setup() {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      await freshStart();
    });

    //needed in case we switch in from another window
    onMounted(async () => {
      await freshStart();
    });

    // --------------------------------------- farmer details
    const farm = ref<string>();
    const farmAcc = ref<any>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const availableB = ref<string>();

    //auto loading for when farm changes
    watch(farm, async () => {
      await freshStart();
    });

    const updateAvailableRewards = async () => {
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();
    };
    const solienFarm = "28JPaxN9f6rw2hHS8Ast1EgDh6cK5uQwHzfWfjsAtrPD"
    const fetchFarn = async () => {
      farm.value = solienFarm
      farmAcc.value = await gf.fetchFarmAcc(new PublicKey(farm.value!));
      console.log(
        `farm found at ${farm.value}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const fetchFarmer = async () => {
      const [farmerPDA] = await gf.findFarmerPDA(
        new PublicKey(farm.value!),
        getWallet()!.publicKey
      );
      farmerIdentity.value = getWallet()!.publicKey?.toBase58();
      farmerAcc.value = await gf.fetchFarmerAcc(farmerPDA);
      farmerState.value = gf.parseFarmerState(farmerAcc.value);
      await updateAvailableRewards();
      console.log(
        `farmer found at ${farmerIdentity.value}:`,
        stringifyPKsAndBNs(farmerAcc.value)
      );
    };

    const freshStart = async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
        farmerIdentity.value = getWallet()!.publicKey?.toBase58();

        //reset stuff
        farmAcc.value = undefined;
        farmerAcc.value = undefined;
        farmerState.value = undefined;
        availableA.value = undefined;
        availableB.value = undefined;

        try {
          await fetchFarn();
          await fetchFarmer();
        } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
        }
      }
    };

    const initFarmer = async () => {
      await gf.initFarmerWallet(new PublicKey(farm.value!));
      await fetchFarmer();
    };

    // --------------------------------------- staking
    const beginStaking = async () => {
      await gf.stakeWallet(new PublicKey(farm.value!));
      await fetchFarmer();
      selectedNFTs.value = [];
    };

    const endStaking = async () => {
      await gf.unstakeWallet(new PublicKey(farm.value!));
      await fetchFarmer();
      selectedNFTs.value = [];
    };

    const claim = async () => {
      await gf.claimWallet(
        new PublicKey(farm.value!),
        new PublicKey(farmAcc.value.rewardA.rewardMint!),
        new PublicKey(farmAcc.value.rewardB.rewardMint!)
      );
      await fetchFarmer();
    };

    const handleRefreshFarmer = async () => {
      await fetchFarmer();
    };

    // --------------------------------------- adding extra gem
    const selectedNFTs = ref<INFT[]>([]);

    const handleNewSelectedNFT = (newSelectedNFTs: INFT[]) => {
      console.log(`selected ${newSelectedNFTs.length} NFTs`);
      selectedNFTs.value = newSelectedNFTs;
    };

    const addSingleGem = async (
      gemMint: PublicKey,
      gemSource: PublicKey,
      creator: PublicKey
    ) => {
      await gf.flashDepositWallet(
        new PublicKey(farm.value!),
        '1',
        gemMint,
        gemSource,
        creator
      );
      await fetchFarmer();
    };

    const addGems = async () => {
      await Promise.all(
        selectedNFTs.value.map((nft) => {
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());

          addSingleGem(nft.mint, nft.pubkey!, creator);
        })
      );
      console.log(
        `added another ${selectedNFTs.value.length} gems into staking vault`
      );
    };

    return {
      wallet,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      farmerState,
      availableA,
      availableB,
      initFarmer,
      beginStaking,
      endStaking,
      claim,
      handleRefreshFarmer,
      selectedNFTs,
      handleNewSelectedNFT,
      addGems,
    };
  },
});
</script>

<style>
body {
  overflow-x: hidden;
}

.hr {
    
    width: 100%;
    height: 3px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    margin-bottom: 0em;
    padding: 0;
    border-style: solid;
    z-index: 2;
    
    
}
.hr:after {
  content: "";
        position: absolute;

        width: 100%;
        height: 3px;
        bottom: 50%;
        left: 0;
        transition: opacity 0.3s ease, animation 0.3s ease;

        background: linear-gradient(
            to right, 
            #62efab 5%,  
            #552993 25%, 
            #552993 35%, 
            #EB1AFA 55%, 
            #EB1AFA 65%, 
            #82fff4 75%, 
            #82fff4 85%, 
            #62efab 95%);

        background-size: 200%;
        background-position: 0%;
        animation: bar 15s linear infinite;

}

.hr:before {
  content: "";
        position: absolute;

        width: 100%;
        height: 3px;
        bottom: 50%;
        left: 0;
        background: linear-gradient( 90deg, #212121 0%);
        background-size: 15px;
        background-position: center;
        z-index: 2;
}

@keyframes bar {
    0% { background-position: 0%; }
    100% { background-position: 200%; }
}


.hrblur {
    width: 110%;
    height: 5px;
    display: block;
    position: absolute;
    top: 0;
    left: -5%;
    margin-bottom: 0em;
    border-style: solid;
    filter: blur(10px);
    z-index: 1;
}

.hrblur:after {
  content: "";
        position: absolute;

        width: 110%;
        height: 5px;
        bottom: 50%;
        left: -5%;
        transition: opacity 0.3s ease, animation 0.3s ease;

        background: linear-gradient(
            to right, 
            #62efab 5%,  
            #552993 25%, 
            #552993 35%, 
            #EB1AFA 55%, 
            #EB1AFA 65%, 
            #82fff4 75%, 
            #82fff4 85%, 
            #62efab 95%);

        background-size: 200%;
        background-position: 0%;
        animation: bar 15s linear infinite;

}

.hrblur:before {
  content: "";
        position: absolute;

        width: 110%;
        height: 5px;
        bottom: 50%;
        left: -5%;
        background: linear-gradient( 90deg, #212121 0%);
        background-size: 15px;
        background-position: center;
        z-index: 1;
}
</style>
