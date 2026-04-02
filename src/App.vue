<template>
  <div :style="contentStyle">
    <router-view />
    <Toast />
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const route = useRoute();

    const contentStyle = computed(() => ({
      marginTop: route.meta.isLayoutVue3 ? '0' : '60px'
    }));

    return { contentStyle };
  }
};
</script>

<style>
/* global styles can go here */
</style>
