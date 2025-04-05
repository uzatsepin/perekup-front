<template>
  <div class="loading-container">
    <div class="loading-road">
      <div class="car-animation-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px" viewBox="0 0 36 36" class="animated-car">
          <!-- Основная часть машины -->
          <path fill="currentColor" d="M26.87 14.28a22.36 22.36 0 0 0-7.22-7.38a9.64 9.64 0 0 0-9-.7a8.6 8.6 0 0 0-4.82 6.4c-.08.49-.15 1-.21 1.4h-1A2.59 2.59 0 0 0 2 16.59v8.55a.86.86 0 0 0 .86.86h1.73v-.39a5.77 5.77 0 0 1 7.71-5.45l-1 1a4.56 4.56 0 0 0-4.34 1.58a3 3 0 0 0-.63.93A4.5 4.5 0 1 0 14.82 26h5.48v-.39a5.77 5.77 0 0 1 7.7-5.45l-1 1a4.56 4.56 0 0 0-4.34 1.58a3 3 0 0 0-.63.93a4.5 4.5 0 1 0 8.5 2.33h2.61a.86.86 0 0 0 .86-.86v-1.78a9.39 9.39 0 0 0-7.13-9.08M12 14H8c0-.35.1-.71.16-1.07a6.52 6.52 0 0 1 3.87-5Zm-1.64 14.36a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5M19 19h-3v-2h3Zm-6-5V7.47a8.16 8.16 0 0 1 5.4 1.15A19.15 19.15 0 0 1 24 14Zm13.06 14.36a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5" class="car-body" />
          
          <!-- Левое колесо с анимацией вращения -->
          <circle class="wheel wheel-left" cx="10.36" cy="25.86" r="2.5" />
          
          <!-- Правое колесо с анимацией вращения -->
          <circle class="wheel wheel-right" cx="26.06" cy="25.86" r="2.5" />
          
          <!-- Область выхлопа для дыма -->
          <circle class="exhaust" cx="2" cy="20" r="0.5" fill="transparent" />
          
          <!-- Дым из выхлопной трубы -->
          <g class="smoke-group">
            <circle class="smoke smoke-1" cx="0" cy="0" r="1" />
            <circle class="smoke smoke-2" cx="0" cy="0" r="1" />
            <circle class="smoke smoke-3" cx="0" cy="0" r="1" />
          </g>
          
          <!-- Фары -->
          <circle class="headlight" cx="34" cy="18" r="1" />
          
          <path fill="none" d="M0 0h36v36H0z" />
        </svg>
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
  width: 280px;
  height: 140px;
  margin-bottom: 60px;
}

.car-animation-container {
  position: absolute;
  bottom: 30px;
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: center;
}

.animated-car {
  position: relative;
  color: var(--primary-color);
  animation: car-drive 3s infinite linear, car-bounce 1.5s infinite ease-in-out;
}

.car-body {
  fill: var(--primary-color);
}

.wheel {
  fill: var(--text-color);
  stroke: var(--card-color);
  stroke-width: 0.5;
  transform-origin: center;
  animation: wheel-spin 1s infinite linear;
}

.wheel-left {
  transform-box: fill-box;
}

.wheel-right {
  transform-box: fill-box;
}

.headlight {
  fill: var(--warning-color);
  filter: drop-shadow(0 0 3px var(--warning-color));
  animation: light-flicker 0.1s infinite;
}

.smoke {
  fill: rgba(200, 200, 200, 0.6);
  transform-box: fill-box;
  opacity: 0;
  r: 0.6;
}

.smoke-1 {
  animation: smoke-emit 3s infinite 0s;
}

.smoke-2 {
  animation: smoke-emit 3s infinite 1s;
}

.smoke-3 {
  animation: smoke-emit 3s infinite 2s;
}

.smoke-group {
  transform: translate(2px, 20px);
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

.loading-road-lines {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    var(--border-color),
    var(--border-color) 15px,
    transparent 15px,
    transparent 30px
  );
  animation: road-move 0.8s infinite linear;
}

@keyframes car-drive {
  0% {
    transform: translateX(-140px);
  }
  100% {
    transform: translateX(140px);
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
    transform: rotate(0deg);
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
    background-position: -30px 0;
  }
}

@keyframes light-flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes smoke-emit {
  0% {
    opacity: 0.8;
    transform: translateX(0) translateY(0) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translateX(-15px) translateY(-10px) scale(2);
  }
  100% {
    opacity: 0;
    transform: translateX(-30px) translateY(-20px) scale(3);
  }
}
</style>
