<template>
  <TreeSelect
    v-model="itemSelected"
    :options="filteredItems"
    filter
    filterMode="lenient"
    selectionMode="single"
    :placeholder="placeholder"
    filterPlaceholder="Tìm kiếm"
    v-model:expandedKeys="expandedKeys"
    class="md:fb-w-[300px] fb-w-full"
    :size="size"
  >
    <template #option="{ node }">
      <p class="fb-text-base">
        {{ node.label }}
      </p>
    </template>
  </TreeSelect>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { computed, onMounted, ref } from 'vue';

// Store
const globalStore = useGlobalStore();
const filterStore = useFilterStore();
const eInvoiceStore = useEInoiveStore();

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Chọn một cửa hàng'
  },
  size: {
    type: String,
    default: 'normal'
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// State
const expandedKeys = ref({});

// Computed
const listTaxStores = computed(() => eInvoiceStore.listTaxStores.data);

const filteredItems = computed(() => {
  return listTaxStores.value
    .map((item) => ({
      key: item.tax_code,
      label: item.tax_code,
      selectable: false, // Không cho phép chọn mã số thuế (chỉ là folder)
      children: (item.list_store_uid || []).map((store) => ({
        key: store.store_uid,
        label: store.store_name,
        selectable: true
      }))
    }))
    .filter((tax) => tax.children && tax.children.length);
});

const itemSelected = computed({
  get() {
    const storeUid = filterStore?.report?.store_uid;
    if (!storeUid) return null;

    // TreeSelect in single mode requires an object { [key]: true }
    return { [storeUid]: true };
  },
  set(value) {
    // value khi chọn single là object kiểu { [key]: true }
    const selectedUid = value ? Object.keys(value)[0] : '';
    setStoreSelected(selectedUid);
  }
});

onMounted(async () => {
  await fetchStores();
  expandAll();
});

// Methods
const fetchStores = async () => {
  const params = {
    brand_uid: globalStore.brandUid,
    company_uid: globalStore.currentUser?.company_uid
  };
  await eInvoiceStore.getListStoreGroupByTaxCode(params);
};

const expandAll = () => {
  expandedKeys.value = {};
  for (let node of filteredItems.value) {
    expandNode(node);
  }
};

const expandNode = (node) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;
    for (let child of node.children) {
      expandNode(child);
    }
  }
};

const setStoreSelected = async (selectedUid) => {
  // update filter trong Pinia: lưu vào store_uid (string) thay vì stores_uid (array)
  await filterStore.updateFilter({
    report: {
      ...filterStore.report,
      store_uid: selectedUid
    }
  });
  emit('update:modelValue', selectedUid);
};
</script>
