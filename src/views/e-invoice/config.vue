<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-8']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Cấu hình</h4>
    </div>
    <Button>Tạo cấu hình mới</Button>
  </div>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <Select
        v-model="partner"
        :options="partnerOptions"
        optionLabel="name"
        placeholder="Chọn đối tác"
        class="fb-w-full md:fb-w-72"
      />
    </div>
  </div>

  <div class="!fb-p-0">
    <FbTable :columns="columns" :items="items" :stripedRows="false" :isLoading="isLoading">
      <template #empty>
        {{ storeSettings?.error || 'Chưa có cấu hình' }}
      </template>
    </FbTable>
  </div>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { onMounted } from 'vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

// Constants
const columns = [
  { field: 'store_name', header: 'Cửa hàng' },
  { field: 'partner_id', header: 'Đối tác' },
  { field: 'fb_store_id', header: 'POS ID' },
  { field: 'inv_user_name', header: 'Tài khoản' },
  { field: 'inv_tax_code', header: 'Mã số thuế' },
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'mau_hd', header: 'Mẫu hóa đơn' },
  { field: 'version', header: 'Phiên bản' },
  { field: 'action', header: '' }
];

// State
const partner = ref(null);
const partnerOptions = ref([{}]);
const storeSettings = computed(() => invoiceStore.storeSettingInvoices);
const items = ref([]);
const isLoading = ref(false);

// Methods
const getData = async () => {
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid,
    partner_id: 'SINVOICE'
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

onMounted(() => {
  getData();
});
</script>
