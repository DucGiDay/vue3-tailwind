<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-6']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Cấu hình</h4>
    </div>
    <Button @click="openDetail()" size="small" raised>Tạo cấu hình mới</Button>
  </div>
  <!-- <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-4']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <FbDateSelect />
    </div>
  </div> -->

  <div class="!fb-p-0">
    <FbTable
      :columns="STORE_CONFIG_TABLE_COLUMNS"
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
import { INVOICE_PARTNERS, STORE_CONFIG_TABLE_COLUMNS } from '@/common/constant/e-invoice.constant';
import DetailConfig from '@/components/PageComponent/e-invoice/DetailConfig.vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

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
