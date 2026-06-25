<script setup>
import { computed } from 'vue';
import StatusSale from '@/components/PageComponent/e-invoice/StatusSale.vue';
import LastBillTable from '@/components/PageComponent/e-invoice/LastBillTable.vue';
import SaleByDate from '@/components/PageComponent/e-invoice/SaleByDate.vue';
import StatsWidget from '@/components/PageComponent/e-invoice/StatsWidget.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { useFilterStore } from '@/stores/filter.store';
import ButtonExtendInvoice from '@/components/SharedComponent/ButtonExtendInvoice.vue';
import IconChevronDown from '@/components/Common/Icon/IconChevronDown.vue';

const onDateChange = () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: invoiceStore.listStoreUidInCurrentTaxCode.join(','),
  };
  getDailyStatistics(payload);
  getStatisticInvoice(payload);
  getStatusInvoices(payload);
};

// Store/Getter
const filterStore = useFilterStore();
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

const taxCodeOptions = computed(() => invoiceStore.listTaxStores.data || []);

const confirmTaxCode = (selectedTaxCode) => {
  if (selectedTaxCode) {
    invoiceStore.setCurrentTaxCode(selectedTaxCode);
    invoiceStore.showTaxCodeDialog = false;
    getData();
  }
};

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    list_store_uid: invoiceStore.listStoreUidInCurrentTaxCode.join(','),
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
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
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
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
  };
  await invoiceStore.getStatusInvoices({ ...payload, ...datePayload });
};

// Biểu đồ số lượng hóa đơn theo ngày
const getDailyStatistics = async (payload) => {
  const datePayload = {
    start_date: filterStore?.invoice?.start_date,
    end_date: filterStore?.invoice?.end_date,
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

// life cycle
onMounted(() => {
  getData();
});
</script>

<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-5']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h5 class="!fb-m-0 !fb-text-lg !fb-font-semibold">Tổng quan</h5>
      <!-- <div 
        class="fb-flex fb-items-center fb-px-3 fb-py-1.5 fb-border fb-border-surface-200 fb-rounded-md fb-bg-white fb-cursor-pointer hover:fb-border-primary fb-transition-colors fb-text-sm fb-text-color"
        @click="invoiceStore.showTaxCodeDialog = true"
        title="Chọn mã số thuế"
      >
        <span>
          MST: <strong class="fb-font-semibold">{{ invoiceStore.currentTaxCode || 'Chưa chọn' }}</strong>
        </span>
        <IconChevronDown class="fb-ml-2 fb-text-color-secondary fb-w-4 fb-h-4" />
      </div> -->
      <Select
        :modelValue="invoiceStore.currentTaxCode"
        @update:modelValue="confirmTaxCode"
        :options="taxCodeOptions"
        size="small"
        optionLabel="tax_code"
        optionValue="tax_code"
        placeholder="Chọn mã số thuế"
        class="fb-w-60 fb-h-9 fb-items-center"
      >
        <template #value="slotProps">
          <span v-if="slotProps.value">
            MST: <strong class="fb-font-semibold">{{ slotProps.value }}</strong>
          </span>
          <span v-else>Chọn mã số thuế</span>
        </template>
        <template #option="slotProps">
          <span>{{ slotProps.option.tax_code }}</span>
        </template>
      </Select>
    </div>
    <ButtonExtendInvoice />
  </div>
  <div class="fb-grid fb-grid-cols-12 fb-gap-6">
    <StatsWidget class="fb-col-span-12">
      <template #date-filter>
        <div class="fb-flex fb-items-center fb-space-x-3">
          <FbDateFilter module="invoice" size="small" @update:modelValue="onDateChange" />
          <!-- <FbSelectTaxStoreFilter
            class=""
            isSingleGroup
            @update:modelValue="onDateChange"
          /> -->
        </div>
      </template>
    </StatsWidget>

    <div class="fb-col-span-12 xl:fb-col-span-6">
      <SaleByDate class="fb-h-full" />
    </div>

    <div class="fb-col-span-12 xl:fb-col-span-6">
      <StatusSale class="fb-h-full" />
    </div>

    <div class="fb-col-span-12">
      <LastBillTable />
    </div>
  </div>
</template>
