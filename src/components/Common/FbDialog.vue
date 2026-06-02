<!-- components/AppDialog.vue -->
<template>
  <Dialog v-bind="mergedProps" v-model:visible="proxyVisible" v-on="forwardedEmits">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </Dialog>
</template>

<script>
export default { inheritAttrs: false };
</script>

<script setup>
import { computed, useAttrs } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
  visible: Boolean,
  breakpoints: {
    type: Object,
    default: () => ({ '1199px': '75vw', '575px': '90vw' }),
  },
  style: {
    type: Object,
    default: () => ({ width: '60vw' }),
  },
});

const emit = defineEmits(['update:visible']);
const attrs = useAttrs();

const proxyVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

// Tách các event listener từ $attrs ra để forward
const forwardedEmits = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('on'))),
);

// Phần còn lại (class, style, ...) vẫn bind bình thường
const mergedProps = computed(() => ({
  modal: true,
  maximizable: true,
  style: props.style,
  breakpoints: props.breakpoints,
}));
</script>
