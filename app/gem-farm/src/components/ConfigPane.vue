<template>
  <div class="flex text-center mb-10 m-3">
    <!--<div class="is-dark flex-1">
      <select class="bg-deep-purple-accent-400 z-99 shadow-2xl w-40 h-15 p-1 m-4 mb-0 rounded-xl text-white text-center font-bold hover:bg-deep-purple-accent-700" required id="cluster" v-model="chosenCluster">
        <option :value="Cluster.Mainnet">Mainnet</option>
        <option :value="Cluster.Devnet">Devnet</option>
        <option :value="Cluster.Testnet">Testnet</option>
        <option :value="Cluster.Localnet">Localnet</option>
      </select>
    </div>-->
    <div class="is-dark flex-1">
      <select class="bg-deep-purple-accent-400 absolute top-5 right-2 z-99 shadow-2xl w-2/12 h-10 p-1 m-4 mb-0 rounded-xl text-white text-center font-bold hover:bg-deep-purple-accent-700 cursor-pointer" required id="wallet" v-model="chosenWallet">
        <option class="text-gray-500" :value="null">Choose wallet..</option>
        <option :value="WalletName.Phantom">Phantom</option>
        <option :value="WalletName.Sollet">Sollet</option>
        <option :value="WalletName.SolletExtension">Sollet Extension</option>
        <option :value="WalletName.Solflare">Solflare</option>
        <option :value="WalletName.SolflareWeb">Solflare Web</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { WalletName } from '@solana/wallet-adapter-wallets';
import useCluster, { Cluster } from '@/composables/cluster';
import useWallet from '@/composables/wallet';

export default defineComponent({
  setup() {
    // cluster
    const { cluster, setCluster, getClusterURL } = useCluster();
    // const chosenCluster = computed({
    //   get() {
    //     return cluster.value;
    //   },
    //   set(newVal: Cluster) {
    //     setCluster(newVal);
    //   },
    // });
    const devnet: Cluster = Cluster.Devnet;
    const mainnet: Cluster = Cluster.Mainnet;
    const chosenCluster = setCluster(mainnet);



    // wallet
    const { getWalletName, setWallet } = useWallet();
    const chosenWallet = computed({
      get() {
        return getWalletName();
      },
      set(newVal: WalletName | null) {
        setWallet(newVal, getClusterURL());
      },
    });

    return {
      Cluster,
      chosenCluster,
      WalletName,
      chosenWallet,
    };
  },
});
</script>

<style scoped></style>
