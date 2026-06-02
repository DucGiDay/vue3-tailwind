<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332"
      :stroke="color"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'white'
  }
});
</script>
