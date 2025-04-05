<template>
  <div class="pb-4">
    <!-- Шапка страницы -->
    <Header>
      <template #title>Баланс</template>
      <template #descr>Управляйте своим балансом и пополняйте его</template>
      <template #info>
        <BalanceTotal />
      </template>
    </Header>

    <!-- Выбор периода и фильтры -->

    <BalanceTrasactions />

    <!-- Модальное окно пополнения баланса -->
    <BalanceDepositPopup />
  </div>
</template>

<script setup lang="ts">
import BalanceTrasactions from "@/components/Balance/BalanceTrasactions.vue";
import BalanceDepositPopup from "@/components/Balance/BalanceDepositPopup.vue";
import BalanceTotal from "@/components/Balance/BalanceTotal.vue";
import Header from "@/components/Header.vue";
</script>
