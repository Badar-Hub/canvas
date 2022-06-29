<template>
  <canvas @mousedown="canvasHelper.trackPoints"></canvas>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { CanvasHelper } from "./helper1/CanvasHelper";
const canvasHelper = new CanvasHelper();
onMounted(() => {
  canvasHelper.init();
  window.addEventListener("keydown", (e) => {
    console.log(e);
    canvasHelper.connectLines();
  });
});
</script>
<style lang="scss">
canvas {
  background-color: aqua;
  cursor: url("./assets/cross-hair.png"), default;
}
</style>
