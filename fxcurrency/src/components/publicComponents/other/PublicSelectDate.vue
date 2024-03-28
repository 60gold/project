<template>
  <div class="inputSwitcher">
    <div class="inputSwitcher_inner">
      <div class="multiInput">
        <div class="multiInput_item">
          <div class="dateInputBox">
            <el-date-picker
              v-model="sDate"
              type="date"
              :placeholder="props.propsPlaceholder"
              format="YYYY/MM/DD"
              value-format="YYYY/MM/DD"
              :prefix-icon="customPrefix"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="multiInput_item"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicSelectDate",
};
</script>

<script setup>
import { h, ref, shallowRef } from "vue";
const props = defineProps({
  propsPlaceholder: {
    type: String,
    default: "請選擇日期",
  },
});
const sDate = ref();
// Element 日曆定預設 icon 圖為隱藏
const customPrefix = shallowRef({
  render() {
    return h("", ""); // el, text
  },
});
</script>

<style scoped>
.dateInputBox :deep(.el-input .el-input__inner) {
  width: 100%;
  height: 50px;
  color: #1e8ece;
  background: #fff;
  border: 1px solid #1e8ece;
  border-radius: 6px;
  /**/
  cursor: pointer;
  background: url(~@/assets/images/commonIcon/icon_dateInput_01.png) right 8px
    center no-repeat;
  background-size: 32px;
  /**/
  display: flex;
  align-items: center;
  padding: 0 50px 0 10px;
  font-size: 1rem;
}
.inputSwitcher {
  display: flex;
  align-items: center;
}
.inputSwitcher_inner {
  flex: 1 1 560px;
  max-width: 560px;
  margin-right: 20px;
}
.multiInput {
  display: flex;
  align-items: center;
}
.multiInput_item {
  flex: 1 1 100%;
  margin-right: 10px;
}
@media screen and (max-width: 768px) {
  .inputSwitcher {
    display: block;
  }
  .inputSwitcher_inner {
    max-width: 100%;
    margin: 0 0 10px;
  }
  .multiInput {
    display: block;
  }
}
</style>
