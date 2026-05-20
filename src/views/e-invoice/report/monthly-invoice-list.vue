<template>
  <TableView title="Bảng kê hóa đơn hàng tháng" :searchable="false">
    <template #header-actions>
      <Button
        size="small"
        severity="secondary"
        raised
        class="!fb-rounded-lg"
        @click="openExportHistory"
      >
        Lịch sử xuất báo cáo
      </Button>
      <Button
        :loading="isLoadingExport"
        size="small"
        outlined
        class="!fb-rounded-lg"
        @click="exportExcel"
      >
        <IconDownload v-if="!isLoadingExport" color="currentColor" />
        <FbLoading v-else show />
        Xuất excel
      </Button>
    </template>

    <template #filters>
      <div
        class="fb-bg-white fb-flex-1 fb-p-2 fb-rounded-lg fb-border fb-border-surface-200 fb-flex fb-flex-col fb-gap-4"
      >
        <!-- Header: Toggle Chế độ lọc -->
        <div class="fb-flex fb-items-center fb-gap-3">
          <span class="fb-text-sm fb-font-medium fb-text-surface-600">Thời gian báo cáo:</span>
          <SelectButton
            v-model="filterType"
            :options="filterTypeOptions"
            optionLabel="label"
            optionValue="value"
            :allowEmpty="false"
            class="fb-w-auto"
            @change="onFilterTypeChange"
          />
          <!-- Lọc Thời Gian -->
          <div
            v-if="filterType === 'month'"
            class="fb-col-span-1 md:fb-col-span-2 lg:fb-col-span-1 fb-flex fb-gap-2"
          >
            <Select
              v-model="monthField"
              :options="monthOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn Tháng"
              class="fb-w-full"
              showClear
              size="small"
              @change="filter"
            />
            <Select
              v-model="yearField"
              :options="yearOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Chọn Năm"
              class="fb-w-full"
              showClear
              size="small"
              @change="filter"
            />
          </div>
          <div v-else class="fb-col-span-1 md:fb-col-span-2 lg:fb-col-span-1">
            <FbDateFilter
              module="invoice"
              @update:modelValue="filter"
              class="fb-w-full"
              size="small"
            />
          </div>

          <!-- Lọc Store -->
          <FbSelectTaxStoreFilter isSingleGroup @update:modelValue="filter" />
          <Button
            v-tooltip.bottom="'Lọc nâng cao'"
            :severity="showAdvancedFilter ? 'primary' : 'secondary'"
            outlined
            size="small"
            class="fb-ml-auto"
            @click="showAdvancedFilter = !showAdvancedFilter"
          >
            <IconFilter color="currentColor" />
          </Button>
        </div>
      </div>
      <!-- Các tiêu chí lọc (Sử dụng Grid để căn chỉnh đẹp mắt) -->
      <transition name="filter-slide">
        <div v-show="showAdvancedFilter" class="fb-flex fb-flex-wrap fb-gap-4 fb-w-full">
          <!-- Các bộ lọc khác -->
          <Select
            v-model="statusField"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Trạng thái"
            class="fb-flex-1"
            showClear
            size="small"
            @change="filter"
          />
          <Select
            v-model="creatorField"
            :options="creatorOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Người lập"
            class="fb-flex-1"
            showClear
            size="small"
            @change="filter"
          />
          <Select
            v-model="patternField"
            :options="patternOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Mẫu số"
            class="fb-flex-1"
            showClear
            size="small"
            @change="filter"
          />
          <Select
            v-model="serialField"
            :options="serialOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Ký hiệu"
            class="fb-flex-1"
            showClear
            size="small"
            @change="filter"
          />
        </div>
      </transition>
    </template>

    <template #table>
      <FbTable
        :columns="MONTHLY_INVOICE_LIST_COLUMNS"
        :items="dataList"
        enableScrollPagination
        :hasMoreData="hasMoreData"
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        scrollHeight="flex"
        @page-change="loadMore"
      >
        <template #empty>
          {{ !storeUidByTaxCode ? 'Vui lòng chọn cửa hàng' : 'Chưa có dữ liệu' }}
        </template>
      </FbTable>
    </template>

    <template #extra></template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { useToast } from 'primevue/usetoast';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { MONTHLY_INVOICE_LIST_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { saveAs } from 'file-saver';

const filterStore = useFilterStore();
const globalStore = useGlobalStore();
const toast = useToast();
const router = useRouter();

// State for filters
const showAdvancedFilter = ref(false);
const filterType = ref('date'); // 'month' | 'date'
const filterTypeOptions = [
  { label: 'Theo ngày', value: 'date' },
  { label: 'Theo tháng', value: 'month' },
];

const monthField = ref(moment().month() + 1);
const yearField = ref(moment().year());
const statusField = ref(null);
const creatorField = ref(null);
const patternField = ref(null);
const serialField = ref(null);

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `Tháng ${i + 1}`,
  value: i + 1,
}));
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => ({
  label: `Năm ${currentYear - i}`,
  value: currentYear - i,
}));

const statusOptions = ref([]); // Will be populated from API/Constants
const creatorOptions = ref([]);
const patternOptions = ref([]);
const serialOptions = ref([]);

// State for Table
const dataList = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);
const totalRecords = ref(0);
const hasMoreData = ref(true);

const storeUidByTaxCode = computed(() => {
  return Object.values(filterStore?.invoice?.store_uid_by_tax_code || {})
    .flat()
    .join(',');
});

// Methods
const getPayload = () => {
  let start_date = null;
  let end_date = null;

  if (filterType.value === 'month') {
    if (monthField.value && yearField.value) {
      const date = moment()
        .year(yearField.value)
        .month(monthField.value - 1);
      start_date = date.startOf('month').valueOf();
      end_date = date.endOf('month').valueOf();
    }
  } else {
    start_date = filterStore?.invoice?.start_date;
    end_date = filterStore?.invoice?.end_date;
  }

  // TODO: Map filter fields (statusField, creatorField, etc.) correctly when backend supports them.
  return {
    company_uid: globalStore?.currentUser?.company_uid,
    report_type: 'monthly_invoice_list',
    start_date,
    end_date,
    list_store_uid: Object.values(filterStore.invoice.store_uid_by_tax_code || {})
      .flat()
      .join(','),
    tax_code: Object.keys(filterStore.invoice.store_uid_by_tax_code || {}).join(','),
  };
};

const getData = async () => {
  const payload = getPayload();
  if (!payload.start_date || !payload.end_date || !payload.list_store_uid) {
    dataList.value = [];
    return;
  }

  isLoading.value = true;
  try {
    const res = await invoiceService.previewReport({
      ...payload,
      page: currentPage.value,
      result_per_page: pageSize.value,
    });

    const fetchedData = res?.data || [];

    if (currentPage.value === 1) {
      dataList.value = fetchedData;
    } else {
      dataList.value = [...dataList.value, ...fetchedData];
    }

    // Check if we loaded all data
    hasMoreData.value = pageSize.value === fetchedData.length;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (currentPage.value === 1) dataList.value = [];
    hasMoreData.value = false;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = () => {
  if (isLoading.value || !hasMoreData.value) return;
  currentPage.value++;
  getData();
};

const filter = async () => {
  currentPage.value = 1;
  await getData();
};

const onFilterTypeChange = () => {
  // Reset related fields when switching filter types
  monthField.value = null;
  yearField.value = null;
  filter();
};

const openExportHistory = () => {
  router.push('/e-invoice/report/export-invoice-history');
};

const exportExcel = async () => {
  try {
    isLoadingExport.value = true;
    const payload = getPayload();
    const res = await invoiceService.exportReportInvoice(payload);
    const fileName = `BCN_MTT_${moment().format('YYYYMMDD_HHmm')}.xlsx`;
    saveAs(res, fileName);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đang tải tệp báo cáo',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || '',
      life: 5000,
    });
  } finally {
    isLoadingExport.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>
