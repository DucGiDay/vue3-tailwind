<script setup>
import BestSellingWidget from '@/components/PageComponent/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/PageComponent/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/PageComponent/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/PageComponent/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/PageComponent/dashboard/StatsWidget.vue';
const mode = import.meta.env.MODE;
const SUB_APP_URL = import.meta.env.VITE_SUB_APP_URL;
</script>

<template>
  <div class="fb-grid fb-grid-cols-12 fb-gap-8">
    <StatsWidget />

    <div class="fb-col-span-12 xl:fb-col-span-6">
      <div class="card">{{ mode }} {{ SUB_APP_URL }}</div>
      <RecentSalesWidget />
      <BestSellingWidget />
    </div>
    <div class="fb-col-span-12 xl:fb-col-span-6">
      <RevenueStreamWidget />
      <NotificationsWidget />
    </div>
  </div>
</template>
