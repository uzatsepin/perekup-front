<template>
  <nav
    class="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-slate-200 shadow-md flex justify-around items-center z-50"
  >
    <router-link
      to="/"
      class="flex flex-col items-center w-1/4 py-2 text-slate-500 transition-colors duration-200"
      :class="{ 'router-link-active': $route.path === '/' }"
    >
      <div class="mb-1" :class="{ 'text-blue-500': $route.path === '/' }">
        <Icon icon="mdi:home" class="h-6 w-6" />
      </div>
      <span
        class="text-xs"
        :class="{ 'text-blue-500 font-semibold': $route.path === '/' }"
        >Главная</span
      >
    </router-link>

    <router-link
      to="/garage"
      class="flex flex-col items-center w-1/4 py-2 text-slate-500 transition-colors duration-200"
      :class="{ 'router-link-active': $route.path.startsWith('/garage') }"
    >
      <div class="mb-1" :class="{ 'text-blue-500': $route.path.startsWith('/garage') }">
        <Icon icon="mdi:garage" class="h-6 w-6" />
      </div>
      <span
        class="text-xs"
        :class="{ 'text-blue-500 font-semibold': $route.path.startsWith('/garage') }"
        >Гараж</span
      >
    </router-link>

    <router-link
      to="/market"
      class="flex flex-col items-center w-1/4 py-2 text-slate-500 transition-colors duration-200"
      :class="{ 'router-link-active': $route.path.startsWith('/market') }"
    >
      <div class="mb-1" :class="{ 'text-blue-500': $route.path.startsWith('/market') }">
        <Icon icon="mdi:store" class="h-6 w-6" />
      </div>
      <span
        class="text-xs"
        :class="{ 'text-blue-500 font-semibold': $route.path.startsWith('/market') }"
        >Авторынок</span
      >
    </router-link>

    <router-link
      to="/profile"
      class="flex flex-col items-center w-1/4 py-2 text-slate-500 transition-colors duration-200"
      :class="{ 'router-link-active': $route.path.startsWith('/profile') }"
    >
      <div class="mb-1" :class="{ 'text-blue-500': $route.path.startsWith('/profile') }">
        <Icon icon="mdi:account" class="h-6 w-6" />
      </div>
      <span
        class="text-xs"
        :class="{ 'text-blue-500 font-semibold': $route.path.startsWith('/profile') }"
        >Профиль</span
      >
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style scoped>
/* Скрываем стандартный класс active-class Vue Router для большего контроля */
.router-link-active {
  color: inherit;
}
</style>
