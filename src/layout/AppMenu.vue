<script setup>
import AppMenuItem from './AppMenuItem.vue';
import { eInvoiceMenu, employee } from '@/common/constant/menu.constant';
import { useRoute } from 'vue-router';

const route = useRoute();

const parentRoute = computed(() => {
  const path = route.fullPath.split('/');
  return path[1];
});

const listItems = computed(() => {
  switch (parentRoute.value) {
    case 'e-invoice':
      return eInvoiceMenu;
    case 'employee':
      return employee;
    default:
      return eInvoiceMenu;
  }
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in listItems" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>
