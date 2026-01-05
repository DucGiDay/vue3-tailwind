<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
  { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);
</script>

<template>
  <div class="card">
    <div class="fb-flex fb-items-center fb-justify-between fb-mb-6">
      <div class="fb-font-semibold fb-text-xl">Notifications</div>
      <div>
        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
        <Menu ref="menu" popup :model="items" class="!fb-min-w-40"></Menu>
      </div>
    </div>

    <span class="fb-block fb-text-muted-color fb-font-medium fb-mb-4">TODAY</span>
    <ul class="fb-p-0 fb-mx-0 fb-mt-0 fb-mb-6 fb-list-none">
      <li class="fb-flex fb-items-center fb-py-2 fb-border-b fb-border-surface">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-blue-100 dark:fb-bg-blue-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-dollar !fb-text-xl fb-text-blue-500"></i>
        </div>
        <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-leading-normal"
          >Richard Jones
          <span class="fb-text-surface-700 dark:fb-text-surface-100"
            >has purchased a blue t-shirt for <span class="fb-text-primary fb-font-bold">$79.00</span></span
          >
        </span>
      </li>
      <li class="fb-flex fb-items-center fb-py-2">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-orange-100 dark:fb-bg-orange-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-download !fb-text-xl fb-text-orange-500"></i>
        </div>
        <span class="fb-text-surface-700 dark:fb-text-surface-100 fb-leading-normal"
          >Your request for withdrawal of <span class="fb-text-primary fb-font-bold">$2500.00</span> has been initiated.</span
        >
      </li>
    </ul>

    <span class="fb-block fb-text-muted-color fb-font-medium fb-mb-4">YESTERDAY</span>
    <ul class="fb-p-0 fb-m-0 fb-list-none fb-mb-6">
      <li class="fb-flex fb-items-center fb-py-2 fb-border-b fb-border-surface">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-blue-100 dark:fb-bg-blue-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-dollar !fb-text-xl fb-text-blue-500"></i>
        </div>
        <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-leading-normal"
          >Keyser Wick
          <span class="fb-text-surface-700 dark:fb-text-surface-100"
            >has purchased a black jacket for <span class="fb-text-primary fb-font-bold">$59.00</span></span
          >
        </span>
      </li>
      <li class="fb-flex fb-items-center fb-py-2 fb-border-b fb-border-surface">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-pink-100 dark:fb-bg-pink-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-question !fb-text-xl fb-text-pink-500"></i>
        </div>
        <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-leading-normal"
          >Jane Davis
          <span class="fb-text-surface-700 dark:fb-text-surface-100">has posted a new questions about your product.</span>
        </span>
      </li>
    </ul>
    <span class="fb-block fb-text-muted-color fb-font-medium fb-mb-4">LAST WEEK</span>
    <ul class="fb-p-0 fb-m-0 fb-list-none">
      <li class="fb-flex fb-items-center fb-py-2 fb-border-b fb-border-surface">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-green-100 dark:fb-bg-green-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-arrow-up !fb-text-xl fb-text-green-500"></i>
        </div>
        <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-leading-normal"
          >Your revenue has increased by <span class="fb-text-primary fb-font-bold">%25</span>.</span
        >
      </li>
      <li class="fb-flex fb-items-center fb-py-2 fb-border-b fb-border-surface">
        <div class="fb-w-12 fb-h-12 fb-flex fb-items-center fb-justify-center fb-bg-purple-100 dark:fb-bg-purple-400/10 fb-rounded-full fb-mr-4 fb-shrink-0">
          <i class="pi pi-heart !fb-text-xl fb-text-purple-500"></i>
        </div>
        <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-leading-normal"
          ><span class="fb-text-primary fb-font-bold">12</span> users have added your products to their wishlist.</span
        >
      </li>
    </ul>
  </div>
</template>