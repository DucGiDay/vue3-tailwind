<template>
  <TableView
    title="Ký hiệu hóa đơn"
    v-model:searchValue="searchField"
    searchPlaceholder="Tìm kiếm mẫu hóa đơn"
    @search="onSearchChange"
  >
    <template #header-actions>
      <Button size="small" raised @click="directToDetail">Thêm mới</Button>
    </template>

    <template #filters>
      <!-- <Select
        v-model="template"
        :options="[]"
        optionLabel="name"
        optionValue="type_error"
        placeholder="Chọn mẫu hóa đơn"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        :loading="isLoadingTemplate"
        @change="filter"
      />
      <Select
        v-model="serial"
        :options="[]"
        optionLabel="name"
        optionValue="type_error"
        placeholder="Chọn ký hiệu hóa đơn"
        class="fb-w-auto md:fb-w-48"
        showClear
        size="small"
        :loading="isLoadingSerial"
        @change="filter"
      /> -->

      <FbDateFilter @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable
        :columns="SERIAL_INVOICE_TABLE_COLUMNS"
        :items="items"
        enablePagination
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :totalRecords="items.length"
        scrollHeight="flex"
        @page-change="getData"
      >
        <template #status="{ record }">
          <span
            :class="statusMap(record)?.class"
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
          >
            {{ statusMap(record)?.label }}
          </span>
        </template>

        <template #empty>
          {{ serialInvoiceList?.error ? 'Error: ' + serialInvoiceList?.error : 'Chưa có dữ liệu' }}
        </template>
      </FbTable>
    </template>

    <template #extra></template>
  </TableView>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  SERIAL_INVOICE_TABLE_COLUMNS
} from '@/common/constant/e-invoice.constant';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const router = useRouter();

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const filterStore = useFilterStore();

const toast = useToast();

// State
const searchField = ref(null);
const template = ref(null);
const serial = ref(null);
const currentPage = ref(1);
const pageSize = ref(50);

const serialInvoiceList = computed(() => invoiceStore.serialInvoiceList); // data from api
const items = ref([]); // data display in table

const isLoading = ref(false);
const isLoadingTemplate = ref(null);
const isLoadingSerial = ref(null);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || 1;
  pageSize.value = rows || 50;

  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    start_date: filterStore?.report?.start_date,
    end_date: filterStore?.report?.end_date,
    page: currentPage.value,
    perpage: pageSize.value,
    search: searchField.value,
  };

  isLoading.value = true;
  await invoiceStore.getSerialInvoice(payload);
  items.value = serialInvoiceList.value?.data?.records || [];
  isLoading.value = false;
};

const filter = async () => {
  currentPage.value = 1;
  items.value = [];
  await getData();
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const statusMap = (status) => {
  return VAT_PUBLISH_STATUS_COLOR[status] || VAT_PUBLISH_STATUS_COLOR['-1'];
};

const directToDetail = () => {
  router.push({ path: '/e-invoice/serial-invoice/detail' });
};

// life cycle
onMounted(async () => {
  await getData();
});
</script>
