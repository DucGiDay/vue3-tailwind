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
      <Button size="small" outlined class="!fb-rounded-lg" @click="exportExcel">
        <IconDownload color="currentColor" />
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
            <FbDateFilter @update:modelValue="filter" class="fb-w-full" size="small" />
          </div>

          <!-- Lọc Store -->
          <FbSelectCityStoreFilter
            :placeholder="$t('SELECT_CITIES_STORES_FILTER--INPUT_PLACEHOLDER_BLUR')"
            @update:modelValue="filter"
          />
          <Button
            v-tooltip.bottom="'Lọc nâng cao'"
            :severity="showAdvancedFilter ? 'primary' : 'secondary'"
            outlined
            size="small"
            class="fb-ml-auto"
            @click="showAdvancedFilter = !showAdvancedFilter"
          >
            <IconFilter />
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
        :columns="DETAIL_INVOICE_LIST_COLUMNS"
        :items="dataList"
        enableScrollPagination
        :hasMoreData="hasMoreData"
        reorderableColumns
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        scrollHeight="flex"
        @page-change="loadMore"
      >
        <!-- <template #header>
          <div class="fb-flex fb-items-center fb-ml-auto fb-mr-4 fb-gap-4">
            <Button
              size="small"
              severity="secondary"
              raised
              class="!fb-rounded-lg"
              @click="openExportHistory"
            >
              Lịch sử xuất báo cáo
            </Button>
            <Button size="small" outlined class="!fb-rounded-lg" @click="exportExcel">
              <IconDownload color="currentColor" />
              Xuất excel
            </Button>
          </div>
        </template> -->
        <template #empty>Chưa có dữ liệu</template>
      </FbTable>
    </template>

    <template #extra>
      <!-- Export History Dialog -->
      <Dialog
        v-model:visible="showExportHistory"
        header="Lịch sử xuất báo cáo"
        modal
        :style="{ width: '60vw' }"
        :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
      >
        <FbTable :columns="exportHistoryColumns" :items="exportHistoryData" :stripedRows="false">
          <template #empty>Chưa có lịch sử xuất báo cáo</template>
        </FbTable>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { DETAIL_INVOICE_LIST_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import IconDownload from '@/components/Common/Icon/IconDownload.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';

const filterStore = useFilterStore();
const globalStore = useGlobalStore();

// State for filters
const searchField = ref('');
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
const currentPage = ref(1);
const pageSize = ref(50);
const totalRecords = ref(0);
const hasMoreData = ref(true);

// State for Export History
const showExportHistory = ref(false);
const exportHistoryColumns = [
  { field: 'time', header: 'Thời gian' },
  { field: 'user', header: 'Người xuất' },
  { field: 'status', header: 'Trạng thái' },
];
const exportHistoryData = ref([]);

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
    start_date = filterStore.report.start_date;
    end_date = filterStore.report.end_date;
  }

  // TODO: Map filter fields (statusField, creatorField, etc.) correctly when backend supports them.
  return {
    company_uid: globalStore?.currentUser?.company_uid,
    report_type: 'monthly_invoice_list',
    start_date,
    end_date,
    list_store_uid: filterStore.report.stores_uid?.length
      ? filterStore.report.stores_uid.join(',')
      : (globalStore?.storesIdPermissionActive || []).join(','), // fallback if empty
  };
};

const getData = async () => {
  const payload = getPayload();
  if (!payload.start_date || !payload.end_date) return;

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

let searchTimeout = null;
const onSearchChange = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filter();
  }, 500);
};

const openExportHistory = () => {
  showExportHistory.value = true;
  // TODO: Fetch export history data from API
};

const exportExcel = () => {
  console.log('Xuất excel - Bảng kê chi tiết hóa đơn');
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 200px;
  opacity: 1;
  overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  overflow: hidden;
}
</style>
