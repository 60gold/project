<template>
  <div class="inputSwitcher">
    <div class="inputSwitcher_inner">
      <div class="multiInput">
        <div class="multiInput_item">
          <input
            type="text"
            v-model="sValue"
            :placeholder="props.propsPlaceholder"
            @change="fnChangeValue"
          />
        </div>
        <div class="multiInput_item width_3_2">{{ props.propsUnit }}</div>
      </div>
    </div>
    <div class="inputSwitcher_info width_3_1">{{ props.propsInfo }}</div>
  </div>
</template>

<script>
export default {
  name: "PublicInput",
};
</script>

<script setup>
import { ref } from "vue";
const props = defineProps({
  propsPlaceholder: {
    type: String,
    default: "請輸入",
  },
  propsUnit: {
    type: String,
    default: "",
  },
  propsInfo: {
    type: String,
    default: "",
  },
});
const sValue = ref("");
const emit = defineEmits(["emitChangeValue"]);
const fnChangeValue = () => {
  emit("emitChangeValue", sValue.value);
};
</script>

<style scoped>
.inputSwitcher {
  display: flex;
  align-items: center;
}
.inputSwitcher_inner {
  flex: 1 1 560px;
  max-width: 560px;
  margin-right: 20px;
}
.inputSwitcher_info {
  flex: 1 0 auto;
}
.multiInput {
  display: flex;
  align-items: center;
}
.multiInput_item {
  flex: 1 1 100%;
  margin-right: 10px;
}
.multiInput .width_2_1 {
  flex: 1 1 50%;
}
.multiInput .width_3_1 {
  flex: 1 1 33%;
}
.multiInput .width_3_2 {
  flex: 1 1 66%;
}
.multiInput .width_4_1 {
  flex: 1 1 25%;
}
.multiInput .width_4_3 {
  flex: 1 1 75%;
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
