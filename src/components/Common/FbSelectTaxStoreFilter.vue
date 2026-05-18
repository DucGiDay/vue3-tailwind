<template>
  <TreeSelect
    v-model="itemSelected"
    :options="filteredItems"
    filter
    filterMode="lenient"
    selectionMode="checkbox"
    :placeholder="placeholder"
    filterPlaceholder="Tìm kiếm"
    v-model:expandedKeys="expandedKeys"
    class="md:fb-w-[18.75rem] fb-w-full"
    :display="props.display"
    :size="size"
    showClear
  >
    <template #value="{ value }">
      <div v-if="!value || Object.keys(value).length === 0">
        {{ placeholder }}
      </div>
      <div v-else-if="props.display === 'chip'" class="fb-space-x-1">
        <Chip
          v-for="(store, index) in getStoreSelected(value)"
          :key="index"
          :label="store?.label"
          :class="{
            'fb-text-xs': props.size === 'small',
          }"
        />
      </div>
      <div v-else-if="props.display === 'comma'" class="fb-space-x-1">
        {{
          getStoreSelected(value)
            ?.map((store) => store?.label || '')
            .join(', ')
        }}
      </div>
    </template>

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

// Store
const globalStore = useGlobalStore();
const filterStore = useFilterStore();
const eInvoiceStore = useEInoiveStore();

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Chọn cửa hàng',
  },
  size: {
    type: String,
    default: 'small',
  },
  display: {
    type: String,
    default: 'comma', // comma || chip
  },
  isSingleGroup: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['update:modelValue']);

// State
const expandedKeys = ref({});

// Computed
const listTaxStores = computed(() => eInvoiceStore.listTaxStores.data);

const filteredItems = computed(() => {
  const storeObj = filterStore?.invoice?.store_uid_by_tax_code || {};
  const selectedStores = Object.values(storeObj).flat();

  let activeTaxCode = null;
  if (props.isSingleGroup && selectedStores.length > 0) {
    // Tìm tax_code đầu tiên có chứa cửa hàng đang được chọn
    for (const item of listTaxStores.value) {
      const hasSelection = (item.list_store_uid || []).some((s) =>
        selectedStores.includes(s.store_uid),
      );
      if (hasSelection) {
        activeTaxCode = item.tax_code;
        break;
      }
    }
  }

  return listTaxStores.value
    .map((item) => {
      const isDisabled =
        props.isSingleGroup && activeTaxCode !== null && item.tax_code !== activeTaxCode;

      return {
        ...item,
        key: item.tax_code,
        label: item.tax_code,
        selectable: !isDisabled,
        children: (item.list_store_uid || []).map((store) => ({
          ...store,
          key: store.store_uid,
          label: store.store_name,
          selectable: !isDisabled,
        })),
      };
    })
    .filter((tax) => tax.children && tax.children.length);
});

const itemSelected = computed({
  get() {
    const storeObj = filterStore?.invoice?.store_uid_by_tax_code || {};
    const stores = props.isSingleGroup ? Object.values(storeObj).flat() : [];
    if (!stores.length) {
      return null;
    }
    const results = {};
    filteredItems.value?.forEach((tax) => {
      const isEmptyTax = !tax.children || !tax.children.length;
      results[tax.key] = {
        partialChecked:
          !isEmptyTax &&
          tax.children.some((store) => stores.includes(store.key)) &&
          !tax.children.every((store) => stores.includes(store.key)),
        checked: !isEmptyTax && tax.children.every((store) => stores.includes(store.key)),
      };
      (tax?.children || []).forEach((store) => {
        results[store.key] = {
          partialChecked: false,
          checked: stores.includes(store.key),
        };
      });
    });

    return Object.keys(results).length ? results : null;
  },
  set(value) {
    setStoreSelected(value);
  },
});

onMounted(async () => {
  await fetchStores();
  expandAll();
});

// Methods
const fetchStores = async () => {
  const params = {
    brand_uid: globalStore.brandUid,
    company_uid: globalStore.currentUser?.company_uid,
  };
  await eInvoiceStore.getListStoreGroupByTaxCode(params);
};

const expandAll = () => {
  expandedKeys.value = {};
  for (let node of filteredItems.value || []) {
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

const setStoreSelected = async (value) => {
  const resultObj = {};
  const listStoreUids = [];
  filteredItems.value?.forEach((tax) => {
    const storesForTax = [];
    (tax?.children || []).forEach((store) => {
      if (value?.[store.key]?.checked) {
        storesForTax.push(store.key);
        listStoreUids.push(store.key);
      }
    });
    if (storesForTax.length > 0) {
      resultObj[tax.key] = storesForTax;
    }
  });

  // update filter trong Pinia
  await filterStore.updateFilter({
    invoice: {
      ...filterStore.invoice,
      store_uid_by_tax_code: resultObj,
    },
  });

  emit('update:modelValue', listStoreUids);
};

const getStoreSelected = (value) => {
  // Lấy danh sách tất cả các cửa hàng được chọn nhưng không bao gồm Tax Code
  if (!value) return [];
  // Loại bỏ value là Tax Code
  // filterItems là cây 2 cấp: TaxCode -> Stores
  // tree-select của PrimeVue khi dùng v-model:selectionMode="checkbox" trả về object { [id]: {checked, partialChecked} }
  // Ở đây value (itemSelected) đã được xử lý ở get() trả về object.
  // Tuy nhiên template TreeSelect #value="{ value }" nhận value là mảng các node được chọn (nếu là display="chip") hoặc object tùy version.
  // Trong FbSelectCityStore.vue, nó dùng flatMap.
  if (Array.isArray(value)) {
    return value.flatMap((node) => (node?.children ? [] : node));
  }
  return [];
};
</script>
