<script setup>
import StatusSale from '@/components/PageComponent/e-invoice/StatusSale.vue';
import LastBillTable from '@/components/PageComponent/e-invoice/LastBillTable.vue';
import SaleByDate from '@/components/PageComponent/e-invoice/SaleByDate.vue';
import StatsWidget from '@/components/PageComponent/e-invoice/StatsWidget.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: (globalStore?.currentBrandStoreIds || []).join(','),
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

// Báo cáo thống kê 7 ngày trước
const getStatisticInvoice = async (payload) => {
  await invoiceStore.getStatisticInvoice(payload);
};

// Báo cáo tài nguyên sử dụng
const getTotalQuantityInvoices = async (payload) => {
  const { list_store_uid, ...restPayload } = payload;
  const store_uids = list_store_uid;
  await invoiceStore.getTotalQuantityInvoices({ ...restPayload, store_uids });
};

// Báo cáo trạng thái hóa đơn
const getStatusInvoices = async (payload) => {
  await invoiceStore.getStatusInvoices(payload);
};

// Biểu đồ số lượng hóa đơn theo ngày
const getDailyStatistics = async (payload) => {
  const dateRange = get7Day();
  await invoiceStore.getDailyStatistics({ ...payload, ...dateRange });
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
    <Button size="small" outlined class="!fb-rounded-lg" @click="onBuyInvoice">
      <IconCart />
      Mua hóa đơn
    </Button>
  </div>
  <div class="fb-grid fb-grid-cols-12 fb-gap-6">
    <StatsWidget class="fb-col-span-12" />

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
