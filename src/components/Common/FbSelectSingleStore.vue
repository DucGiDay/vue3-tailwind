<template>
  <Select
    v-model="selected"
    :options="storeOptions"
    optionLabel="label"
    optionValue="value"
    :placeholder="placeholder"
    :size="size"
    filter
    filterPlaceholder="Tìm kiếm cửa hàng"
    class="md:fb-w-52 fb-w-full"
    v-bind="$attrs"
    @update:modelValue="onSelect"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useGlobalStore } from '@/stores/global.store';
import { storeToRefs } from 'pinia';

/**
 * FbSelectSingleStore — Select chọn 1 cửa hàng.
 * Options lấy từ storesPermissionActive (stores được phân quyền tới user).
 * Hỗ trợ v-model với giá trị là store.id.
 */
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Chọn cửa hàng'
  },
  size: {
    type: String,
    default: 'small'
  }
});

const emit = defineEmits(['update:modelValue']);

const globalStore = useGlobalStore();
const { storesPermissionActive } = storeToRefs(globalStore);

const storeOptions = computed(() =>
  (globalStore?.storesPermissionActive || []).map((store) => ({
    label: store?.store_name,
    value: store.id
  }))
);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const onSelect = (val) => {
  // emit('update:modelValue', val);
};
</script>
