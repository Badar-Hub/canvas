<template>
  <canvas @mousedown="drawPoints" @mousemove="trackLine" @mouseup="leaveMouse">
  </canvas>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

const canvas = ref();
const ctx = ref();
const mouse = ref({
  isPressed: false,
  down: {
    x: 0,
    y: 0,
  },
});

const getCanvas = () => {
  canvas.value = document.querySelector("canvas");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  ctx.value = canvas.value.getContext("2d");
  console.log(canvas.value);
};

const getMousePosition = (event: any, element: any) => {
  const position = {
    x: event.clientX - element.offsetLeft,
    y: event.clientY - element.offsetTop,
  };
  return position;
};

function drawLine(line: any) {
  const {
    start,
    end,
    lineWidth = 20,
    lineCap = "round",
    strokeStyle = "white",
  } = line;

  if (!start || !end) {
    throw new Error("Start or end of line not defined.");
  }

  ctx.value.beginPath();
  ctx.value.moveTo(start.x, start.y);
  ctx.value.lineTo(end.x, end.y);
  ctx.value.lineWidth = lineWidth;
  ctx.value.lineCap = lineCap;
  ctx.value.strokeStyle = strokeStyle;
  ctx.value.stroke();
}

const drawPoints = (e: any) => {
  mouse.value.isPressed = true;
  mouse.value.down = getMousePosition(e, canvas.value);

  const line = {
    start: mouse.value.down,
    end: mouse.value.down,
  };

  drawLine(line);
};

const trackLine = (e: any) => {
  if (mouse.value.isPressed) {
    let currentPosition = getMousePosition(e, canvas.value);
    let line = {
      start: mouse.value.down,
      end: currentPosition,
    };
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    drawLine(line);
  }
};

const leaveMouse = () => {
  mouse.value.isPressed = false;
};

onMounted(() => {
  setTimeout(() => {
    getCanvas();
  }, 300);
});

watch(
  () => canvas.value,
  () => {
    console.log(canvas.value, "from watch");
  }
);
</script>

<style lang="scss">
canvas {
  background: black !important;
}
</style>
