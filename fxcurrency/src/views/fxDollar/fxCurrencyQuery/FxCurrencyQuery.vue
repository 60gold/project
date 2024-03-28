<template>
  <router-view />
</template>

<script>
export default {
  name: "FxCurrencyQuery",
};
</script>

<script setup>
import { provide } from "vue";

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
