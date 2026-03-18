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
    class="md:fb-w-[300px] fb-w-full"
    display="chip"
    :size="size"
  >
    <template #value="{ value }">
      <div v-if="!value || Object.keys(value).length === 0">
        {{ placeholder }}
      </div>
      <div v-else class="fb-space-x-1">
        <Chip
          v-for="(store, index) in getStoreSelected(value)"
          :key="index"
          :label="store?.label"
          :class="{
            'fb-text-xs': props.size === 'small'
          }"
        />
      </div>
    </template>

    <template #option="{ node }">
      <p class="fb-text-base">
        {{ node.label }}
      </p>
      <Tag
        v-if="getFranchiseTag(node?.is_franchise)"
        :value="getFranchiseTag(node?.is_franchise).text"
        :severity="getFranchiseTag(node?.is_franchise).severity"
        class="fb-text-xs"
      ></Tag>
    </template>

    <template #header>
      <div class="fb-p-2">
        <Select
          v-model="selectedBusinessType"
          :options="storeBusinessTypeOptions"
          :defaultValue="-1"
          optionLabel="text"
          optionValue="value"
          variant="filled"
          size="small"
          labelClass="fb-text-center"
          class="fb-w-full fb-border-none"
          @change="onBusinessTypeChange"
        />
      </div>
    </template>
  </TreeSelect>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';

// Store
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

// Props
const props = defineProps({
  options: {
    type: Array
  },
  placeholder: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'small'
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// State
const expandedKeys = ref({});
const selectedBusinessType = ref(-1);

// Computed
const currentBrand = computed(() => globalStore.currentBrand);

const storeBusinessTypeOptions = computed(() => {
  return [
    { value: -1, text: $t('SOURCE_LIST--FILTER_STORE_ALL_STORES_OPTION') },
    { value: 0, text: $t('STORE_LIST--BUSSINESS_TYPE_BRAND_CHAIN') },
    { value: 1, text: $t('STORE_LIST--BUSSINESS_TYPE_FRANCHISE') }
  ];
});

const filteredItems = computed(() => {
  const data = (props.options || currentBrand?.value?.cities || [])
    .map(({ stores, ...dataStore }) => ({
      ...dataStore,
      key: dataStore.id,
      label: dataStore.city_name,
      value: dataStore.city_id,
      children: stores
        .filter((store) => {
          return (
            store.active === 1 &&
            (selectedBusinessType.value !== -1
              ? store.is_franchise === selectedBusinessType.value
              : true)
          );
        })
        .map((store) => ({
          ...store,
          key: store.id,
          label: store.store_name,
          value: store.store_id
        }))
    }))
    .filter((city) => city.children && city.children.length);
  return data;
});

const itemSelected = computed({
  /* Data dạng:
    [
      {
        [key của city/key của store]:  {
          checked: boolean,
          partialChecked: boolean
        }
      }
  ]
*/
  get() {
    const stores = filterStore?.report?.stores_uid || [];
    if (!stores.length) {
      return null;
    }
    const results = {};
    filteredItems.value.forEach((city) => {
      const isEmptyCity = !city.children || !city.children.length;
      results[city.key] = {
        partialChecked:
          !isEmptyCity &&
          city.children.some((store) => stores.includes(store.key)) &&
          !city.children.every((store) => stores.includes(store.key)),
        checked: !isEmptyCity && city.children.every((store) => stores.includes(store.key))
      };
      (city?.children || []).forEach((store) => {
        results[store.key] = {
          partialChecked: false
        };
        results[store.key].checked = stores.includes(store.key);
      });
    });

    return Object.keys(results).length ? results : null;
  },
  set(value) {
    setStoreSelected(value);
  }
});

onMounted(() => {
  expandAll();
});

// Methods
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

const setStoreSelected = async (value) => {
  const listStoreUids = [];
  filteredItems.value.forEach((city) => {
    const isEmptyCity = !city.children || !city.children.length;
    if (!isEmptyCity) {
      city.children.forEach((store) => {
        if (value[store.key]?.checked) {
          listStoreUids.push(store.key);
        }
      });
    }
  });

  // update filter trong Pinia
  await filterStore.updateFilter({ report: { ...filterStore.report, stores_uid: listStoreUids } });
  emit('update:modelValue', listStoreUids);
};

const getStoreSelected = (value) => {
  // Lấy danh sách tất cả các cửa hàng được chọn nhưng không bao gồm thành phố
  if (!value) return [];
  // Loại bỏ value là Thành phố
  return value.flatMap((city) => (city?.children ? [] : city));
};

const onBusinessTypeChange = async () => {
  const listStoreUids = filteredItems.value
    .flatMap((city) => (city?.children ? city?.children : []))
    .map((store) => store.id);
  await filterStore.updateFilter({ report: { ...filterStore.report, stores_uid: listStoreUids } });
  emit('update:modelValue', listStoreUids);
};

const getFranchiseTag = (is_franchise) => {
  if (is_franchise === undefined) return null;
  const result = {
    0: {
      text: $t('STORE_LIST--BUSSINESS_TYPE_BRAND_CHAIN'),
      severity: 'info'
    },
    1: {
      text: $t('STORE_LIST--BUSSINESS_TYPE_FRANCHISE'),
      severity: 'warn'
    }
  };
  return result[is_franchise];
};
</script>
