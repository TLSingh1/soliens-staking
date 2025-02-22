<template>
  <div class="nes-container with-title">
    <p class="title">Treasury Payout</p>
    <div class="mb-5">Treasury balance: {{ balance }} lamports</div>

    <form @submit.prevent="payoutFromTreasury">
      <div class="nes-field mb-5">
        <label for="destination">Payout destination:</label>
        <input
          id="destination"
          type="text"
          v-model="destination"
          class="nes-input"
        />
      </div>
      <div class="nes-field mb-5">
        <label for="lamports">Amount to pay out (lamp):</label>
        <input id="lamports" type="text" v-model="lamports" class="nes-input" />
      </div>
      <button class="mb-5 w-full h-12 px-6 font-semibold tracking-wide text-teal-900 transition duration-200 rounded-xl shadow-md md:w-auto hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none is-primary is-primary" type="submit">Payout</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';

export default defineComponent({
  props: {
    farm: String,
  },
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
        await getTresauryBalance();
      }
    });

    watch(
      () => props.farm,
      async () => {
        await getTresauryBalance();
      }
    );

    // --------------------------------------- payout
    const destination = ref<string>();
    const lamports = ref<string>();
    const balance = ref<string>();

    const payoutFromTreasury = async () => {
      await gf.treasuryPayoutWallet(
        new PublicKey(props.farm!),
        new PublicKey(destination.value!),
        lamports.value!
      );
      await getTresauryBalance();
    };

    const getTresauryBalance = async () => {
      const [treasury] = await gf.findFarmTreasuryPDA(
        new PublicKey(props.farm!)
      );
      console.log('treasury found:', treasury.toBase58());
      balance.value = await gf.getBalance(treasury);
    };

    return {
      balance,
      destination,
      lamports,
      payoutFromTreasury,
    };
  },
});
</script>

<style scoped></style>
