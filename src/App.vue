<template>
  <div :style="contentStyle">
    <router-view />
    <Toast />
  </div>
</template>

<script>
export default {
  name: 'App',
  setup() {
    return {};
  }
};
</script>

<style>
/* global styles can go here */
</style>
