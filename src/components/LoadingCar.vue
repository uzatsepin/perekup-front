<template>
  <div class="loading-container">
    <div class="loading-road">
      <div class="loading-car-container">
        <div class="loading-car">
          <div class="car-body">
            <div class="car-top"></div>
            <div class="car-window"></div>
            <div class="car-light"></div>
          </div>
          <div class="car-wheel car-wheel-left"></div>
          <div class="car-wheel car-wheel-right"></div>
          <div class="smoke-container">
            <div class="smoke smoke-1"></div>
            <div class="smoke smoke-2"></div>
            <div class="smoke smoke-3"></div>
          </div>
        </div>
      </div>
      <div class="loading-text">Загрузка...</div>
      <div class="loading-road-lines"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Компонент с анимацией загрузки в виде едущей машины
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-road {
  position: relative;
  width: 240px;
  height: 140px;
  margin-bottom: 60px;
}

.loading-car-container {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 60px;
  animation: car-bounce 1s infinite ease-in-out;
}

.loading-car {
  position: relative;
  width: 60px;
  height: 30px;
  animation: car-drive 2.5s infinite linear;
}

.car-body {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 16px;
  background-color: var(--primary-color);
  border-radius: 10px 8px 0 0;
  z-index: 2;
}

.car-top {
  position: absolute;
  bottom: 16px;
  left: 10px;
  width: 40px;
  height: 14px;
  background-color: var(--primary-dark);
  border-radius: 10px 10px 0 0;
}

.car-window {
  position: absolute;
  bottom: 16px;
  left: 25px;
  width: 10px;
  height: 8px;
  background-color: var(--bg-color);
  border-radius: 2px;
}

.car-light {
  position: absolute;
  bottom: 3px;
  right: -2px;
  width: 6px;
  height: 3px;
  background-color: var(--warning-color);
  border-radius: 1px;
  box-shadow: 0 0 5px var(--warning-color);
  animation: car-light-flicker 0.1s infinite;
}

.car-wheel {
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 12px;
  background-color: var(--text-color);
  border-radius: 50%;
  border: 2px solid var(--bg-color);
  z-index: 1;
  animation: wheel-spin 0.5s infinite linear;
}

.car-wheel-left {
  left: 10px;
}

.car-wheel-right {
  right: 10px;
}

.loading-road-lines {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    var(--border-color),
    var(--border-color) 12px,
    transparent 12px,
    transparent 24px
  );
  animation: road-move 0.5s infinite linear;
}

.smoke-container {
  position: absolute;
  left: 0;
  bottom: 8px;
}

.smoke {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(200, 200, 200, 0.4);
  border-radius: 50%;
  opacity: 0;
}

.smoke-1 {
  animation: smoke-emit 1.5s infinite;
}

.smoke-2 {
  animation: smoke-emit 1.5s infinite 0.3s;
}

.smoke-3 {
  animation: smoke-emit 1.5s infinite 0.6s;
}

.loading-text {
  position: absolute;
  bottom: -40px;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
  opacity: 0.8;
}

@keyframes car-drive {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(240px - 60px));
  }
}

@keyframes car-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes wheel-spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes road-move {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -24px 0;
  }
}

@keyframes car-light-flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes smoke-emit {
  0% {
    opacity: 0.5;
    transform: translateX(0) translateY(0) scale(0.8);
  }
  50% {
    opacity: 0.3;
    transform: translateX(-15px) translateY(-10px) scale(1.5);
  }
  100% {
    opacity: 0;
    transform: translateX(-30px) translateY(-20px) scale(2);
  }
}
</style>
