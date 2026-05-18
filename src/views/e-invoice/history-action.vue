<template>
  <TableView title="Lịch sử thao tác" :searchable="false">
    <template #filters>
      <!-- Filter by Date -->
      <FbDateFilter @update:modelValue="filter" size="small" />
    </template>

    <template #table>
      <FbTable
        :columns="HISTORY_ACTION_COLUMNS"
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
        <template #action_desc="{ row }">
          <span :class="getActionClass(row.action)" class="fb-font-medium">
            {{ getActionDesc(row) }}
          </span>
        </template>

        <template #detail="{ row }">
          <div class="fb-flex fb-justify-center">
            <Button size="small" text v-tooltip.top="'Xem chi tiết'" @click="showDetail(row)">
              <IconEye color="currentColor" />
            </Button>
          </div>
        </template>

        <template #empty>Chưa có lịch sử thao tác</template>
      </FbTable>
    </template>

    <template #extra>
      <!-- Detail JSON Dialog -->
      <Dialog
        v-model:visible="displayDetailDialog"
        header="Chi tiết thao tác"
        modal
        :style="{ width: '60vw' }"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      >
        <div class="fb-mt-2">
          <pre
            class="fb-bg-gray-100 fb-p-4 fb-rounded-lg fb-overflow-auto fb-text-xs fb-font-mono fb-max-h-[60vh]"
            >{{ formattedJsonDetail }}</pre
          >
        </div>
        <template #footer>
          <div class="fb-flex fb-justify-end fb-pt-2">
            <Button
              label="Đóng"
              severity="secondary"
              @click="displayDetailDialog = false"
              raised
              size="small"
            />
          </div>
        </template>
      </Dialog>
    </template>
  </TableView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { HISTORY_ACTION_COLUMNS } from '@/common/constant/e-invoice-column.constant';
import IconEye from '@/components/Common/Icon/IconEye.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useFilterStore } from '@/stores/filter.store';
import { useGlobalStore } from '@/stores/global.store';
import { useToast } from 'primevue/usetoast';

const filterStore = useFilterStore();
const globalStore = useGlobalStore();

// State for Table
const dataList = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMoreData = ref(true);

// State for Detail Dialog
const displayDetailDialog = ref(false);
const formattedJsonDetail = ref('');

// Methods
const getPayload = () => {
  return {
    company_uid: globalStore?.currentUser?.company_uid,
    start_date: filterStore.report.start_date,
    end_date: filterStore.report.end_date,
  };
};

const MOCK_DATA = [
  {
    trace_id: '2026-0516-164110-fd7738e7-837c-4b70-aa61-27ff493cb2b7',
    action: 'create',
    data: '{"id": "9c814a84-774b-6d0f-5f3c-afe4e46fa103", "serial": "123411", "pattern": "123", "tax_code": "0106713804-999", "from_no": 1, "to_no": 99999999, "start_date": 1778924470795, "end_date": 1798650000000}',
    service: 'einvoice',
    uuid: '9c814a84-774b-6d0f-5f3c-afe4e46fa103',
    hour: 9,
    company_uid: '483deb8f-9184-4b10-bd5e-e02df70c2905',
    series: '123411',
    timestamp: '2026-05-16T09:41:13.787148+00:00',
    tax_code: '0106713804-999',
    model: 'invoice_serials',
    name: '123/123411',
    updated_by: '12541',
    source: 'api',
  },
  {
    trace_id: '2026-0516-164520-fd7738e7-837c-4b70-aa61-27ff493cb2b8',
    action: 'update',
    data: '{"id": "9c814a84-774b-6d0f-5f3c-afe4e46fa103", "serial": "123411", "pattern": "123", "tax_code": "0106713804-999", "from_no": 1, "to_no": 99999999, "start_date": 1778924470795, "end_date": 1798650000000, "note": "Cập nhật dải số cấu hình hóa đơn"}',
    service: 'einvoice',
    uuid: '9c814a84-774b-6d0f-5f3c-afe4e46fa103',
    hour: 10,
    company_uid: '483deb8f-9184-4b10-bd5e-e02df70c2905',
    series: '123411',
    timestamp: '2026-05-16T10:45:20.123456+00:00',
    tax_code: '0106713804-999',
    model: 'invoice_serials',
    name: '123/123411',
    updated_by: '12541',
    source: 'api',
  },
  {
    trace_id: '2026-0517-091530-fd7738e7-837c-4b70-aa61-27ff493cb2b9',
    action: 'delete',
    data: '{"id": "9c814a84-774b-6d0f-5f3c-afe4e46fa103"}',
    service: 'einvoice',
    uuid: '9c814a84-774b-6d0f-5f3c-afe4e46fa103',
    hour: 9,
    company_uid: '483deb8f-9184-4b10-bd5e-e02df70c2905',
    series: '123411',
    timestamp: '2026-05-17T09:15:30.987654+00:00',
    tax_code: '0106713804-999',
    model: 'invoice_serials',
    name: '123/123411',
    updated_by: '12542',
    source: 'api',
  },
];

const getData = async () => {
  const payload = getPayload();
  if (!payload.start_date || !payload.end_date) return;

  isLoading.value = true;
  try {
    const res = await invoiceService.listAuditLogs({
      ...payload,
      page: currentPage.value,
      perpage: pageSize.value,
    });

    const fetchedData = res?.data?.data || res?.data || [];

    if (currentPage.value === 1) {
      dataList.value = fetchedData.length ? fetchedData : MOCK_DATA;
    } else {
      dataList.value = [...dataList.value, ...fetchedData];
    }

    hasMoreData.value = fetchedData.length === pageSize.value && fetchedData.length > 0;
  } catch (error) {
    console.error('Error fetching audit logs, falling back to mock data:', error);
    if (currentPage.value === 1) {
      dataList.value = MOCK_DATA;
    }
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

const getActionDesc = (row) => {
  const actionMap = {
    create: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xóa',
  };
  const modelMap = {
    invoice_serials: 'kí hiệu hoá đơn',
    invoice_serial: 'kí hiệu hoá đơn',
    mtt_schedule_config: 'cấu hình thời gian gửi',
    schedule_config: 'cấu hình thời gian gửi',
    electronic_invoice_minutes: 'biên bản thoả thuận',
    invoice_minutes: 'biên bản thoả thuận',
    error_notify: 'thông báo sai sót',
  };

  const actionText = actionMap[row.action] || row.action;
  const modelText = modelMap[row.model] || row.model;
  return `${actionText} ${modelText}`;
};

const getActionClass = (action) => {
  const classes = {
    create: 'fb-text-success',
    update: 'fb-text-warn',
    delete: 'fb-text-error',
  };
  return classes[action] || 'fb-text-info';
};

const showDetail = (row) => {
  try {
    const parsed = row ?? {};
    formattedJsonDetail.value = JSON.stringify(parsed, null, 2);
    if (row.data) {
    } else {
      formattedJsonDetail.value = 'Không có dữ liệu chi tiết';
    }
  } catch (e) {
    formattedJsonDetail.value = row.data || 'Lỗi định dạng dữ liệu';
  }
  displayDetailDialog.value = true;
};

onMounted(() => {
  getData();
});
</script>

<style scoped></style>
