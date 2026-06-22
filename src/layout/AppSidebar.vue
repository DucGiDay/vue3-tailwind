<script setup>
import AppMenu from './AppMenu.vue';
import { useRoute } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import IconExpandMenu from '@/components/Common/Icon/IconExpandMenu.vue';
import { computed } from 'vue';

const { layoutConfig } = useLayout();
const route = useRoute();

const menuTitle = computed(() => {
  return route.meta?.menuTitle || route.meta?.title || '';
});

const onMenuModeChange = () => {
  layoutConfig.menuMode = layoutConfig.menuMode === 'static' ? 'overlay' : 'static';
};
</script>

<template>
  <div class="layout-sidebar fb-flex fb-flex-col" v-show="!route.meta.disableSidebar">
    <div
      class="fb-flex fb-items-center fb-sticky fb-bottom-0"
      style="background-color: var(--surface-overlay)"
    >
      <span v-if="menuTitle" class="fb-font-bold fb-uppercase">{{ menuTitle }}</span>
      <Button
        text
        variant="secondary"
        @click="onMenuModeChange"
        class="!fb-p-2 fb-ml-auto"
        v-tooltip.right="'Thu gọn'"
      >
        <IconExpandMenu class="fb-w-5 fb-h-5 fb-text-color-secondary" />
      </Button>
    </div>
    <app-menu></app-menu>
    <!-- <div
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
    </div> -->
  </div>

  <!-- Nút mở lại sidebar khi bị thu gọn -->
  <div
    v-if="!route.meta.disableSidebar && layoutConfig.menuMode === 'overlay'"
    class="fb-fixed fb-left-0 fb-top-[4.55rem] fb-z-[999]"
  >
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
