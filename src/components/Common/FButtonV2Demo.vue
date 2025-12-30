<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">FButtonV2 Demo</h3>

    <div class="flex items-center gap-4">
      <FButtonV2 label="Button CTA" :icon-left="icon" :icon-right="icon" @click="onClick" />

      <FButtonV2 label="Icon only" :icon-left="icon" iconOnly @click="onClick" aria-label="Send" />

      <FButtonV2 label="Disabled" :icon-left="icon" :disabled="true" />
    </div>
  </div>
</template>

<script setup>
import FButtonV2 from './FButtonV2.vue'
const icon = 'http://localhost:3845/assets/2133b81178abf2a214d179c682220a46e1b88aeb.svg'
const onClick = () => {
  // small demo action - replace with emits in real usage
  // eslint-disable-next-line no-console
  console.log('FButtonV2 clicked')
}
</script>

<style scoped>
.space-y-4 > * + * { margin-top: 1rem; }
</style>
