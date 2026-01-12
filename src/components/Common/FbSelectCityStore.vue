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
        />
      </div>
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
import { useGlobalStore } from '@/stores/global';
import { useFilterStore } from '@/stores/filter';

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
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// State
const expandedKeys = ref({});
const choosenStores = ref([]);
const selectedBusinessType = ref(-1);
const selectedStoresInCity = ref([]);
const storeBusinessType = ref('');

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
  const data = (props.options || currentBrand?.value?.cities || []).map((dataStore) => ({
    ...dataStore,
    key: dataStore.id,
    label: dataStore.city_name,
    value: dataStore.city_id,
    children: dataStore.stores
      .filter((store) => {
        return (
          store.active === 1 &&
          (storeBusinessType.value !== '' ? store.is_franchise === storeBusinessType.value : true)
        );
      })
      .map((store) => ({
        ...store,
        key: store.id,
        label: store.store_name,
        value: store.store_id
      }))
  }));

  return data;
});
const itemSelected = computed({
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

const setStoreSelected = (value) => {
  const results = [];
  filteredItems.value.forEach((city) => {
    const isEmptyCity = !city.children || !city.children.length;
    if (!isEmptyCity) {
      city.children.forEach((store) => {
        if (value[store.key]?.checked) {
          results.push(store.key);
        }
      });
    }
  });
  filterStore.updateFilter({ report: { ...filterStore.report, stores_uid: results } });
};

const getStoreSelected = (value) => {
  console.log(value);

  if (!value) return [];
  return value.flatMap((city) => (city?.children ? [...city.children] : []));
};
// const toggleSelectAllStoreInCity = (cities) => {
//   choosenStores.value = cities.flatMap((cityUid) =>
//     filteredItems.value?.some((city) => city.id === cityUid)
//       ? filteredItems.value.find((city) => city.id === cityUid).stores.map((store) => store.id)
//       : []
//   );

//   selectedStoresInCity.value = [].concat(cities);
// };

// const selectAllCities = () => {
//   const cities = filteredItems.value.filter((item) => item.stores.length).map(({ id }) => id);
//   toggleSelectAllStoreInCity(cities);
// };

const onBusinessTypeChange = () => {
  console.log(selectedBusinessType.value);
};
</script>
