<template>
  <div class="printtitle">
    <div class="printtitle-row">
      <img src="~@/assets/images/commonIcon/print_logo.gif" />
      <h6 class="printtitle-title">{{ props.propsTitle }}</h6>
      <p class="printtitle-desc printtitle-textright">
        <span v-for="(item, index) in props.propsDesc" :key="index + item">{{
          item
        }}</span>
      </p>
    </div>
    <div class="printtitle-row">
      <div class="printtitle-text">
        帳號: <span>{{ props.propsAcount }}</span>
      </div>
      <div class="printtitle-text printtitle-textright">
        列印日期:
        <span>{{ sPrintDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrintTitle",
};
</script>

<script setup>
import { ref } from "vue";
import { fnFormatDate } from "@/common/methodCommon/publicMethod";
const str = "年";
const split = fnFormatDate(new Date(), "YYYY年MM月DD日").split(str);
const sPrintDate = ref(Number(split[0]) - 1911 + str + split[1]);

// props
const props = defineProps({
  propsTitle: {
    type: String,
    default: "",
  },
  propsAcount: {
    type: String,
    default: "",
  },
  propsDesc: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss">
.printtitle {
  display: none;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important;
  }

  .printtitle {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    font-family: "標楷體", Arial;
    img {
      width: 140px;
      height: 34px;
    }
  }

  .printtitle-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 7px;
  }

  .printtitle-title {
    font-weight: bold;
    font-size: 32px;
    text-align: center;
  }

  .printtitle-desc {
    letter-spacing: 0.5px;
    span {
      display: block;
      font-size: 16px;
      line-height: 1.3;
    }
  }

  .printtitle-text {
    font-size: 13px;
    letter-spacing: 0.5px;
  }

  .printtitle-textright {
    text-align: right;
  }
}
</style>
