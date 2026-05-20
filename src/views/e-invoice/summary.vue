<script setup>
import StatusSale from '@/components/PageComponent/e-invoice/StatusSale.vue';
import LastBillTable from '@/components/PageComponent/e-invoice/LastBillTable.vue';
import SaleByDate from '@/components/PageComponent/e-invoice/SaleByDate.vue';
import StatsWidget from '@/components/PageComponent/e-invoice/StatsWidget.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';
import FbDateSelect from '@/components/Common/FbDateSelect.vue';
import moment from 'moment';
import { ref } from 'vue';

const reportDateRange = ref([
  moment().subtract(7, 'days').startOf('day').toDate(),
  moment().subtract(1, 'days').endOf('day').toDate(),
]);

const onDateChange = () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: Object.values(filterStore.invoice.store_uid_by_tax_code || {})
      .flat()
      .join(','),
  };
  getDailyStatistics(payload);
  getStatisticInvoice(payload);
  getStatusInvoices(payload);
};

// Store/Getter
const filterStore = useFilterStore();
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: Object.values(filterStore.invoice.store_uid_by_tax_code || {})
      .flat()
      .join(','),
  };

  await Promise.all([
    getListRecentInvoice(payload),
    getStatisticInvoice(payload),
    getTotalQuantityInvoices(payload),
    getStatusInvoices(payload),
    getDailyStatistics(payload),
  ]);
};

// Table Hóa đơn gần nhất
const getListRecentInvoice = async (payload) => {
  await invoiceStore.getListRecentInvoice(payload);
};

// Báo cáo thống kê
const getStatisticInvoice = async (payload) => {
  const datePayload = {
    start_date: reportDateRange.value?.[0] ? reportDateRange.value[0].getTime() : null,
    end_date: reportDateRange.value?.[1] ? reportDateRange.value[1].getTime() : null,
  };
  await invoiceStore.getStatisticInvoice({ ...payload, ...datePayload });
};

// Báo cáo tài nguyên sử dụng
const getTotalQuantityInvoices = async (payload) => {
  const { list_store_uid, ...restPayload } = payload;
  const store_uids = list_store_uid;
  await invoiceStore.getTotalQuantityInvoices({ ...restPayload, store_uids });
};

// Báo cáo trạng thái hóa đơn
const getStatusInvoices = async (payload) => {
  const datePayload = {
    start_date: reportDateRange.value?.[0] ? reportDateRange.value[0].getTime() : null,
    end_date: reportDateRange.value?.[1] ? reportDateRange.value[1].getTime() : null,
  };
  await invoiceStore.getStatusInvoices({ ...payload, ...datePayload });
};

// Biểu đồ số lượng hóa đơn theo ngày
const getDailyStatistics = async (payload) => {
  // const dateRange = get7Day();
  const datePayload = {
    start_date: reportDateRange.value?.[0] ? reportDateRange.value[0].getTime() : null,
    end_date: reportDateRange.value?.[1] ? reportDateRange.value[1].getTime() : null,
  };
  await invoiceStore.getDailyStatistics({ ...payload, ...datePayload });
};

const get7Day = () => {
  const now = new Date();

  const start = new Date(now);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  const start_date = start.getTime();
  const end_date = end.getTime();
  return {
    start_date,
    end_date,
  };
};

const onBuyInvoice = () => {
  window.location.assign(window.location.origin + '/extend-license/invoice-renewal-stores');
};

// life cycle
onMounted(() => {
  getData();
});
</script>

<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h5 class="!fb-m-0 !fb-text-lg !fb-font-semibold">Tổng quan</h5>
    </div>
    <ButtonExtendInvoice />
  </div>
  <div class="fb-grid fb-grid-cols-12 fb-gap-6">
    <StatsWidget class="fb-col-span-12">
      <template #date-filter>
        <div class="fb-flex fb-items-center fb-space-x-3">
          <FbDateSelect v-model="reportDateRange" size="small" @update:modelValue="onDateChange" />
          <FbSelectTaxStoreFilter
            class="!fb-hidden"
            isSingleGroup
            @update:modelValue="onDateChange"
          />
        </div>
      </template>
    </StatsWidget>

    <div class="fb-col-span-12 xl:fb-col-span-8">
      <SaleByDate class="fb-h-full" />
    </div>

    <div class="fb-col-span-12 xl:fb-col-span-4">
      <StatusSale class="fb-h-full" />
    </div>

    <div class="fb-col-span-12">
      <LastBillTable />
    </div>
  </div>
</template>
