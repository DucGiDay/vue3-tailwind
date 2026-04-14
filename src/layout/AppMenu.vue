<script setup>
import AppMenuItem from './AppMenuItem.vue';

const models = ref([
  {
    label: '',
    items: [
      { label: 'Tổng quan', to: '/e-invoice/summary' },
      { label: 'Quản lý hóa đơn', to: '/e-invoice/invoice-manage' },
      { label: 'Hóa đơn bán hàng', to: '/e-invoice/sale-order' },
      { label: 'Cấu hình', to: '/e-invoice/config' },
      {
        label: 'Quản lý sai sót',
        items: [
          { label: 'Thông báo sai sót', to: '/e-invoice/notification-error', heno: true },
          { label: 'Biên bản thỏa thuận', to: '/e-invoice/agreement-protocol', heno: true }
        ]
      }
    ]
  }
]);

const listItems = computed(() => {
  return models.value;
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
