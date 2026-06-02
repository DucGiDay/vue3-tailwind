<template>
  <div ref="containerRef" class="product-tags">
    <Tag
      v-for="product in visibleProducts"
      :key="product.product_uid"
      :value="product.product_name"
      severity="secondary"
      rounded
    >
      {{ product.product_code === 'GENERAL' ? 'FABI' : product.product_name }}
    </Tag>

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

const emit = defineEmits(['edit']);

const containerRef = ref(null);

const visibleCount = ref(0);

const TAG_ESTIMATE_WIDTH = 90;
const MORE_TAG_WIDTH = 50;
const MAX_VISIBLE = 2;

const filteredProducts = computed(() => {
  return (props.products || []).filter(
    (product) => !(product.is_active === false && product.is_requesting === false),
  );
});

const visibleProducts = computed(() => {
  return filteredProducts.value.slice(0, MAX_VISIBLE);
});

const hiddenCount = computed(() => {
  return Math.max(filteredProducts.value.length - MAX_VISIBLE, 0);
});

const calculateVisibleTags = () => {
  if (!containerRef.value) return;

  const containerWidth = containerRef.value.offsetWidth;

  let usedWidth = 0;
  let count = 0;

  for (const product of filteredProducts.value) {
    usedWidth += TAG_ESTIMATE_WIDTH;

    if (usedWidth + MORE_TAG_WIDTH > containerWidth) {
      break;
    }

    count++;
  }

  visibleCount.value = count || 1;
};

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
:deep(.p-tag.p-component.p-tag-rounded) {
  background: rgba(233, 234, 235, 1) !important;
  color: rgba(65, 70, 81, 1) !important;
  font-weight: 500 !important;
}
</style>
