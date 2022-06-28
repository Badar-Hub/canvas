<template>
  <div class="row">
    <div class="col-8">
      <canvas
        @mousedown="canvasHelper.handleMouseDown"
        @mousemove="canvasHelper.handleMouseMove"
      >
        <!-- @mouseup="canvasHelper.handleMouseUp" -->
      </canvas>
    </div>
    <div class="col-4">
      <div class="column items-end">
        <img
          class="image"
          v-for="(img, i) in images"
          :key="i"
          :src="require(`@/assets/images/${img}`)"
          @click="selectImage(img)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, watch } from "vue";
import { CanvasHelper } from "./helper/CanvasHelper";

const canvas = ref();
const canvasHelper = new CanvasHelper();
const images = ref([
  "cert1.png",
  "cert2.png",
  "cert3.png",
  "cert4.png",
  "cert5.png",
  "cert6.png",
]);

const ctx = ref();

const selectImage = (img: string) => {
  canvasHelper.loadCanvasImage(`@/assets/images/${img}`);
  const img1 = new Image();
  img1.onload = function () {
    ctx.value.drawImage(img1, 0, 0);
  };
  img1.src =
    "https://pbs.twimg.com/profile_images/1455185376876826625/s1AjSxph_400x400.jpg";
};

onMounted(async () => {
  canvas.value = await (await canvasHelper.getCanvas()).canvas;
  ctx.value = await (await canvasHelper.getCanvas()).ctx;
  window.addEventListener("keyup", function (ev) {
    canvasHelper.handleMouseUp(ev);
  });
});

watch(
  () => toRefs(canvasHelper).canvas.value,
  () => {
    console.log(canvasHelper.canvas, "canvasHelper.canvas");
  }
);
</script>

<style lang="scss">
.image {
  max-width: 150px;
  width: 100%;
  margin: 10px 0;
  background-color: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #a1a1a1;
  }
}
canvas {
  background: rgba(0, 0, 0, 0.233) !important;
}
</style>
