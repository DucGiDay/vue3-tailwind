<template>
  <FbTableView
    :columns="tableColumns"
    :show-export="false"
    :is-loading="isLoading"
    :items="orderHistory.data"
    :scrollable="false"
  >
    <template #filter>
      <IconField>
        <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="fb-h-[14px]"
          >
            <path
              d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
              stroke="#A4A7AE"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </InputIcon>
        <InputText v-model="searchField" placeholder="Tìm kiếm mã hóa đơn" size="small" />
      </IconField>

      <Select
        v-model="statusField"
        :options="statusOptions"
        optionLabel="name"
        placeholder="Chọn trạng thái"
        class="fb-w-full md:fb-w-56"
        size="small"
      />
    </template>
    <template #guide-text>
      <div></div>
    </template>
    <template #deliveryInfo="{ record }">
      {{ record?.receiverName }}
    </template>
    <template #amount="{ record }">
      {{ formatCurrency(record) }}
    </template>
    <template #status="{ record }">
      <span
        :class="statusMap(record)?.class"
        class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
      >
        {{ statusMap(record)?.label }}
      </span>
    </template>
    <template #action>
      <span class="fb-text-primary">Thanh toán lại</span>
    </template>
  </FbTableView>
</template>

<script setup>
import { ORDER_STATUS_FILTER_LIST, ORDER_STATUS_COLOR } from '@/common/constant/extend-license.constant';
import { useExtendLicenseServiceStore } from '@/stores/extend-license.store';
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/common/ulties';

const tableColumns = [
  { field: 'roCode', header: 'Mã hóa đơn' },
  { field: 'contactName', header: 'Người liên hệ' },
  { field: 'contactPhone', header: 'Số điện thoại' },
  { field: 'companyTaxEmail', header: 'Email' },
  { field: 'amount', header: 'Tổng tiền' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'action', header: '' }
];
const searchField = ref('');
const statusField = ref(null);
const statusOptions = ref([{ name: 'Tất cả trạng thái', code: null }, ...ORDER_STATUS_FILTER_LIST]);
const statusMap = (status) => {
  return ORDER_STATUS_COLOR[status];
};

// stores
const extendLicenseServiceStore = useExtendLicenseServiceStore();
const globalStore = useGlobalStore();
const { orderHistory, isLoading } = storeToRefs(extendLicenseServiceStore);

onMounted(() => {
  extendLicenseServiceStore.getListOrderHistory({
    companyId: globalStore?.currentUser?.company_id,
    page: 1
  });
});
</script>
