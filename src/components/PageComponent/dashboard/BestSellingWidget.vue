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
    <div class="fb-flex fb-justify-between fb-items-center fb-mb-6">
      <div class="fb-font-semibold fb-text-xl">Best Selling Products</div>
      <div>
        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
        <Menu ref="menu" popup :model="items" class="!fb-min-w-40"></Menu>
      </div>
    </div>
    <ul class="fb-list-none fb-p-0 fb-m-0">
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Space T-Shirt</span>
          <div class="fb-mt-1 fb-text-muted-color">Clothing</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-orange-500 fb-h-full" style="width: 50%"></div>
          </div>
          <span class="fb-text-orange-500 fb-ml-4 fb-font-medium">%50</span>
        </div>
      </li>
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Portal Sticker</span>
          <div class="fb-mt-1 fb-text-muted-color">Accessories</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-ml-0 md:fb-ml-20 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-cyan-500 fb-h-full" style="width: 16%"></div>
          </div>
          <span class="fb-text-cyan-500 fb-ml-4 fb-font-medium">%16</span>
        </div>
      </li>
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Supernova Sticker</span>
          <div class="fb-mt-1 fb-text-muted-color">Accessories</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-ml-0 md:fb-ml-20 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-pink-500 fb-h-full" style="width: 67%"></div>
          </div>
          <span class="fb-text-pink-500 fb-ml-4 fb-font-medium">%67</span>
        </div>
      </li>
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Wonders Notebook</span>
          <div class="fb-mt-1 fb-text-muted-color">Office</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-ml-0 md:fb-ml-20 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-green-500 fb-h-full" style="width: 35%"></div>
          </div>
          <span class="fb-text-primary fb-ml-4 fb-font-medium">%35</span>
        </div>
      </li>
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Mat Black Case</span>
          <div class="fb-mt-1 fb-text-muted-color">Accessories</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-ml-0 md:fb-ml-20 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-purple-500 fb-h-full" style="width: 75%"></div>
          </div>
          <span class="fb-text-purple-500 fb-ml-4 fb-font-medium">%75</span>
        </div>
      </li>
      <li class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center md:fb-justify-between fb-mb-6">
        <div>
          <span class="fb-text-surface-900 dark:fb-text-surface-0 fb-font-medium fb-mr-2 fb-mb-1 md:fb-mb-0">Robots T-Shirt</span>
          <div class="fb-mt-1 fb-text-muted-color">Clothing</div>
        </div>
        <div class="fb-mt-2 md:fb-mt-0 fb-ml-0 md:fb-ml-20 fb-flex fb-items-center">
          <div class="fb-bg-surface-300 dark:fb-bg-surface-500 fb-rounded-border fb-overflow-hidden fb-w-40 lg:fb-w-24" style="height: 8px">
            <div class="fb-bg-teal-500 fb-h-full" style="width: 40%"></div>
          </div>
          <span class="fb-text-teal-500 fb-ml-4 fb-font-medium">%40</span>
        </div>
      </li>
    </ul>
  </div>
</template>