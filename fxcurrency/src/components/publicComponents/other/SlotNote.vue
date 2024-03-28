<template>
  <div class="noteArea">
    <h3 class="subtitle_line">
      <span>{{ $t(`${sNoteTitle}`) }}</span>
    </h3>
    <div class="slot_note">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlotNote",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
// props
const props = defineProps({
  propsTitleType: {
    type: String,
    default: "",
  },
});
const sNoteTitle = ref("slotNote.notice");
onMounted(() => {
  if (props.propsTitleType === "specialNotice") {
    sNoteTitle.value = "slotNote.specialNotice";
  }
});
</script>

<style lang="scss" scoped>
:deep(.slot_note > ol) {
  padding: 0 0 0 2em;
  margin-bottom: 20px;
  counter-reset: item;
  text-align: left;
  font-size: 0.875em;
  color: #686868;
  li {
    margin-bottom: 1em;
    padding: 0;
    line-height: 150%;
    text-indent: -0.8em;
    &::before {
      content: counter(item) ". ";
      counter-increment: item;
      display: inline-block;
      min-width: 0.8em;
    }
  }
}

:deep(.slot_note > div) {
  margin-bottom: 20px;
  counter-reset: item;
  text-align: left;
  line-height: 150%;
  font-size: 0.875em;
  color: #686868;
}
</style>
