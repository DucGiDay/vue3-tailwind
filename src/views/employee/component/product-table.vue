<template>
  <div ref="containerRef" class="product-tags">
    <Tag
      v-for="product in visibleProducts"
      :key="product.product_uid"
      :value="product.product_name"
      severity="secondary"
      rounded
    />

    <Tag v-if="hiddenCount > 0" :value="`+${hiddenCount}`" rounded />

    <Button size="small" variant="text" @click.stop="openDetail({ data: row })">
      <IconEdit />
    </Button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});

const containerRef = ref(null);

const visibleCount = ref(props.products.length);

const TAG_ESTIMATE_WIDTH = 90;
const MORE_TAG_WIDTH = 50;

const calculateVisibleTags = () => {
  if (!containerRef.value) return;

  const containerWidth = containerRef.value.offsetWidth;

  let usedWidth = 0;
  let count = 0;

  for (const product of props.products) {
    usedWidth += TAG_ESTIMATE_WIDTH;

    if (usedWidth + MORE_TAG_WIDTH > containerWidth) {
      break;
    }

    count++;
  }

  visibleCount.value = count || 1;
};

const visibleProducts = computed(() => {
  return (props.products || []).slice(0, visibleCount.value);
});

const hiddenCount = computed(() => {
  return props.products.length - visibleCount.value;
});

const emit = defineEmits(['edit']);

const openDetail = (payload) => {
  emit('edit', payload);
};

const handleResize = () => {
  nextTick(calculateVisibleTags);
};

watch(
  () => props.products,
  async () => {
    await nextTick();

    calculateVisibleTags();
  },
  {
    deep: true,
    immediate: true,
  },
);

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.product-tags {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
