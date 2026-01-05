<script setup>
import BestSellingWidget from '@/components/PageComponent/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/PageComponent/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/PageComponent/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/PageComponent/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/PageComponent/dashboard/StatsWidget.vue';
</script>

<template>
  <div class="fb-grid fb-grid-cols-12 fb-gap-8">
    <StatsWidget />

    <div class="fb-col-span-12 xl:fb-col-span-6">
      <RecentSalesWidget />
      <BestSellingWidget />
    </div>
    <div class="fb-col-span-12 xl:fb-col-span-6">
      <RevenueStreamWidget />
      <NotificationsWidget />
    </div>
  </div>
</template>