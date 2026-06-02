<script setup>
import AppMenu from './AppMenu.vue';
import { useLayout } from '@/layout/composables/layout';
import IconExpandMenu from '@/components/Common/Icon/IconExpandMenu.vue';

const { layoutConfig } = useLayout();

const onMenuModeChange = () => {
  layoutConfig.menuMode = layoutConfig.menuMode === 'static' ? 'overlay' : 'static';
};
</script>

<template>
  <div class="layout-sidebar fb-flex fb-flex-col">
    <app-menu></app-menu>
    <div
      class="fb-mt-auto fb-flex fb-justify-end fb-sticky fb-bottom-0 fb-pt-2"
      style="background-color: var(--surface-overlay)"
    >
      <Button
        text
        variant="secondary"
        @click="onMenuModeChange"
        class="!fb-p-2"
        v-tooltip.left="'Thu gọn'"
      >
        <IconExpandMenu class="fb-w-5 fb-h-5 fb-text-color-secondary" />
      </Button>
    </div>
  </div>

  <!-- Nút mở lại sidebar khi bị thu gọn -->
  <div v-if="layoutConfig.menuMode === 'overlay'" class="fb-fixed fb-left-0 fb-bottom-6 fb-z-[999]">
    <Button
      text
      variant="secondary"
      @click="onMenuModeChange"
      class="!fb-rounded-l-none !fb-rounded-r-lg !fb-p-2 fb-shadow-md fb-border fb-border-l-0 fb-border-surface-200"
      style="background-color: var(--surface-overlay)"
      v-tooltip.right="'Mở rộng'"
    >
      <IconExpandMenu class="fb-w-5 fb-h-5 fb-text-color-secondary" />
    </Button>
  </div>
</template>

<style lang="scss" scoped></style>
