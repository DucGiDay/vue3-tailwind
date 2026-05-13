<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="card fb-border fb-border-gray-200 fb-shadow-xs">
    <div v-if="props.title" class="fb-font-semibold fb-mb-4">{{ props.title }}</div>
    <slot />
  </div>
</template>
