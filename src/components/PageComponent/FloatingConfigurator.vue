<script setup>
import AppConfigurator from '@/layout/AppConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';

const { toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
  <div class="fb-fixed fb-flex fb-gap-4 fb-top-8 fb-right-8">
    <Button type="button" @click="toggleDarkMode" rounded :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
    <div class="fb-relative">
      <Button
        icon="pi pi-palette"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'fb-hidden',
          enterActiveClass: 'fb-animate-scalein',
          leaveToClass: 'fb-hidden',
          leaveActiveClass: 'fb-animate-fadeout',
          hideOnOutsideClick: true
        }"
        type="button"
        rounded
      />
      <AppConfigurator />
    </div>
  </div>
</template>