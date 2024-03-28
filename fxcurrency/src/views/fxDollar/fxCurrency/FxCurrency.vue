<template>
  <!--步驟-->
  <div class="stepProgressArea" v-if="nStep !== 0">
    <ul class="stepProgress">
      <li class="on"><span>1.</span>{{ $t("fxDollar.fxCurrency.step", 0) }}</li>
      <li :class="[{ on: nStep === 2 }, { on: nStep === 3 }]">
        <span>2.</span>{{ $t("fxDollar.fxCurrency.step", 1) }}
      </li>
      <li :class="[{ on: nStep === 3 }]">
        <span>3.</span>{{ $t("fxDollar.fxCurrency.step", 2) }}
      </li>
    </ul>
  </div>
  <!--router-view-->
  <router-view />
</template>

<script>
export default {
  name: "FxCurrency",
};
</script>

<script setup>
import { ref, provide } from "vue";

//更新步驟
const nStep = ref(0);
const updateNStep = (val) => {
  nStep.value = val;
};
provide("updateNStep", updateNStep);

//儲存資料
let aCurrencyData = [];

//set data
const setCurrencyData = (obj) => {
  aCurrencyData.length = 0;
  aCurrencyData.push(obj);
};
provide("setCurrencyData", setCurrencyData);

//get data
provide("getCurrencyData", aCurrencyData);
</script>

<style lang="scss" scoped></style>
