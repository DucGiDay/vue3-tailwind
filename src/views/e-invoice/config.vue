<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Cấu hình</h4>
    </div>
    <Button @click="openDetail()" size="small">Tạo cấu hình mới</Button>
  </div>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <!-- <Select
        v-model="partner"
        :options="partnerOptions"
        placeholder="Chọn đối tác"
        optionLabel="name"
        optionValue="code"
        class="fb-w-full md:fb-w-72"
        @update:modelValue="filter"
      /> -->
    </div>
  </div>

  <div class="!fb-p-0">
    <FbTable
      :columns="columns"
      :items="items"
      :stripedRows="false"
      :isLoading="isLoading"
      rowHover
      :rowClass="() => 'fb-cursor-pointer'"
      @row-click="openDetail"
    >
      <template #empty>
        {{ storeSettings?.error || 'Chưa có cấu hình' }}
      </template>
      <template #action="{ row }">
        <Button size="small" variant="text" @click.stop="openDetail({ data: row })">
          <IconEdit color="#0560A6" />
        </Button>
      </template>
    </FbTable>
  </div>
  <DetailConfig
    :partnerSelected="partner"
    :storeSelected="storeSelected"
    :isEdit="isEditConfig"
    v-model:visible="visibleDetail"
  />
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { ref, computed, onMounted } from 'vue';
import { INVOICE_PARTNERS } from '@/common/constant/e-invoice.constant';
import DetailConfig from '@/components/PageComponent/e-invoice/DetailConfig.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

// Constants
const partnerOptions = INVOICE_PARTNERS;
const columns = [
  { field: 'store_name', header: 'Cửa hàng', frozen: true },
  { field: 'partner_id', header: 'Đối tác' },
  { field: 'fb_store_id', header: 'POS ID' },
  { field: 'inv_user_name', header: 'Tài khoản' },
  { field: 'inv_tax_code', header: 'Mã số thuế' },
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'mau_hd', header: 'Mẫu hóa đơn' },
  { field: 'version', header: 'Phiên bản' },
  {
    field: 'action',
    header: '',
    style: { padding: '0 0.5rem !important' },
    frozen: true,
    alignFrozen: 'right'
  }
];

// State
const partner = ref(null);
const storeSettings = computed(() => invoiceStore.storeSettingInvoices);
const items = ref([]);
const isLoading = ref(false);
const visibleDetail = ref(false);
const storeSelected = ref({}); // Cửa hàng được chọn chỉnh sửa cấu hình
const isEditConfig = ref(false); // Phân biệt Tạo mới/chỉnh sửa cấu hình

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    partner_id: partner.value
  };

  isLoading.value = true;
  await invoiceStore.getStoreSettingInvoice(payload);
  items.value = [...items.value, ...(storeSettings.value?.data?.data || [])];
  isLoading.value = false;
};

const filter = async () => {
  items.value = [];
  await getData();
};

const openDetail = (store = null) => {
  visibleDetail.value = true;
  storeSelected.value = store ? store.data : null;
  isEditConfig.value = !!store;
};

onMounted(() => {
  getData();
});
</script>
