<template>
  <FbTableView
    :columns="tableColumns"
    :show-export="false"
    :is-loading="isLoading"
    :items="orderHistory.data"
    enablePagination
    :currentPage="currentPage"
    :rows="numPerPage"
    :totalRecords="totalRecords"
    rowHover
    :rowClass="() => 'fb-cursor-pointer'"
    @row-click="toggleDetail"
    @page-change="getData"
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
    <template #action="{ row }">
      <div v-if="row?.status === 'PENDING' && row.amount > 0" class="fb-flex fb-items-center">
        <Button size="small" variant="text" @click="togglePayingDialog(row)">Thanh toán lại</Button>
        <Button size="small" variant="text" severity="contrast" @click="toggleConfirmDialog(row)">
          <img :src="trashIcon" alt="Trash icon" />
        </Button>
      </div>
    </template>
  </FbTableView>

  <Dialog
    header="Xác nhận"
    v-model:visible="displayConfirmation"
    :style="{ width: '30rem' }"
    :modal="true"
  >
    <div class="fb-flex fb-items-center fb-justify-center">
      <span>
        Nhập lý do hủy đơn #
        <span class="fb-font-semibold fb-text-primary">{{ selectedItem?.roCode }}</span>
        :
      </span>
    </div>
    <Fluid>
      <Textarea v-model="reason" rows="3" placeholder="Nhập lý do" />
    </Fluid>
    <template #footer>
      <Button label="Đóng" @click="toggleConfirmDialog" text severity="secondary" />
      <Button label="Xác nhận" @click="onDeleteItem" severity="danger" autofocus />
    </template>
  </Dialog>
  <DetailOrder
    v-model:visible="displayDetail"
    :item="selectedItem"
    @delete-item="toggleConfirmDialog"
    @repaid-item="togglePayingDialog"
  />
  <ModalPayingOrder
    v-model:visible="displayPaying"
    :item="selectedItem"
    @success="onPayingSuccess"
    @hide="onHidePaying"
  />

</template>

<script setup>
import {
  ORDER_STATUS_FILTER_LIST,
  ORDER_STATUS_COLOR
} from '@/common/constant/extend-license.constant';
import { useExtendLicenseServiceStore } from '@/stores/extend-license.store';
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { formatCurrency, getAssetUrl } from '@/common/ulties';
import DetailOrder from '@/components/PageComponent/extend-license/DetailOrder.vue';
import ModalPayingOrder from '@/components/PageComponent/extend-license/ModalPayingOrder.vue';
import { extendLicenseService } from '@/api/services/extend-license/extend-license.service';
import { useToast } from 'primevue/usetoast';

// Constants
const trashIcon = getAssetUrl('/src/assets/img/icon/trash.svg');
const tableColumns = [
  { field: 'roCode', header: 'Mã hóa đơn' },
  { field: 'contactName', header: 'Người liên hệ' },
  { field: 'contactPhone', header: 'Số điện thoại' },
  { field: 'companyTaxEmail', header: 'Email' },
  { field: 'amount', header: 'Tổng tiền' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'action', header: '', classes: '!fb-py-0' }
];
const toast = useToast();

// States
const searchField = ref('');
const statusField = ref(null);
const statusOptions = ref([{ name: 'Tất cả trạng thái', code: null }, ...ORDER_STATUS_FILTER_LIST]);
const statusMap = (status) => {
  return ORDER_STATUS_COLOR[status];
};
const numPerPage = ref(8);
const totalRecords = ref(0);
const currentPage = ref(1);
const displayConfirmation = ref(false);
const displayDetail = ref(false);
const displayPaying = ref(false);
const selectedItem = ref({});
const reason = ref('Hủy đơn từ CMS');

// Stores
const extendLicenseServiceStore = useExtendLicenseServiceStore();
const globalStore = useGlobalStore();
const { orderHistory, isLoading } = storeToRefs(extendLicenseServiceStore);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || currentPage.value;
  numPerPage.value = rows || numPerPage.value;
  await extendLicenseServiceStore.getListOrderHistory({
    companyId: globalStore?.currentUser?.company_id,
    page: currentPage.value,
    numPerPage: numPerPage.value
  });

  totalRecords.value = orderHistory.value?.meta?.count;
};

const onDeleteItem = async () => {
  try {
    if (!selectedItem.value?.roCode) throw new Error('Không tìm thấy roCode');

    const payload = {
      status: 'CANCELED',
      orderCode: selectedItem.value?.roCode,
      cancelNote: reason.value
    };
    isLoading.value = true;
    displayConfirmation.value = false;
    const response = await extendLicenseService.updateStatusOrder(payload);
    if (response.error)
      toast.add({ severity: 'error', summary: response.error?.message, life: 3000 });
    else toast.add({ severity: 'success', summary: 'Hủy đơn thành công', life: 3000 });

  } catch (error) {
    displayConfirmation.value = true;
    console.error(error?.message);
  } finally {
    isLoading.value = false;
  }
};

const onPayingSuccess = async () => {
  await getData();
};

const onHidePaying = async () => {
  selectedItem.value = {};
};

const toggleConfirmDialog = (item) => {
  selectedItem.value = item || {};
  displayConfirmation.value = !displayConfirmation.value;
};
const togglePayingDialog = (item) => {
  selectedItem.value = item || {};
  displayPaying.value = !displayPaying.value;
};
const toggleDetail = ({ data } = {}) => {
  selectedItem.value = data || {};
  displayDetail.value = true;
};
</script>
