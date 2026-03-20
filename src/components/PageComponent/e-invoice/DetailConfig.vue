<template>
  <Dialog
    v-model:visible="visibleDetail"
    modal
    header="Sửa thông tin"
    :style="{ width: '60vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h6 class="fb-text-center fb-font-semibold fb-text-lg fb-flex-1">Sửa thông tin</h6>
    </template>
    <div v-if="false" class="fb-flex fb-items-center fb-justify-center fb-h-[20rem]">
      <ProgressSpinner class="fb-stroke-primary" />
    </div>

    <Fluid v-else class="fb-space-y-6">
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="partner" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Đối tác
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <Select
            id="partner"
            v-model="partner"
            :options="partnerOptions"
            placeholder="Chọn đối tác"
            optionLabel="name"
            optionValue="code"
            filter
            :disabled="isEdit"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="store" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Cửa hàng
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <Select
            id="store"
            v-model="store"
            :options="storeOptions"
            placeholder="Chọn cửa hàng"
            optionLabel="store_name"
            filter
            :disabled="isEdit"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="posId" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          POS ID
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="posId"
            disabled
            type="text"
            :value="store?.fb_store_id"
            placeholder="POS ID"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="inv_user_name" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Tài khoản
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="inv_user_name"
            type="text"
            v-model="config.inv_user_name"
            placeholder="Nhập tài khoản"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="inv_password" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Mật khẩu
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="inv_password"
            type="text"
            v-model="config.inv_password"
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="inv_tax_code" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Mã số thuế
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="inv_tax_code"
            type="text"
            v-model="config.inv_tax_code"
            placeholder="Nhập mã số thuế"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="inv_series" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Ký hiệu
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="inv_series"
            type="text"
            v-model="config.inv_series"
            placeholder="Nhập ký hiệu"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label
          for="inv_template_id"
          class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3"
        >
          Mẫu hóa đơn
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText
            id="inv_template_id"
            type="text"
            v-model="config.inv_template_id"
            placeholder="Nhập mẫu hóa đơn"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="version" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Phiên bản
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
            <label for="version1" class="fb-flex fb-items-center">
              <RadioButton
                id="version1"
                name="version"
                value="invoice_v1"
                v-model="config.version"
              />
              <span class="fb-leading-none fb-ml-2">Version 1</span>
            </label>
            <label for="version2" class="fb-flex fb-items-center">
              <RadioButton
                id="version2"
                name="version"
                value="invoice_v2"
                v-model="config.version"
              />
              <span class="fb-leading-none fb-ml-2">Version 2</span>
            </label>
          </div>
        </div>
      </div>
    </Fluid>

    <template #footer>
      <Button
        label="Lưu lại"
        raised
        :loading="isLoading"
        :disabled="isLoading"
        @click="saveConfig"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { INVOICE_PARTNERS } from '@/common/constant/e-invoice.constant';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();

const props = defineProps({
  partnerSelected: {
    type: String,
    default: ''
  },
  storeSelected: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const visibleDetail = defineModel('visible');
const storeOptions = computed(() => {
  return globalStore?.storesAccessibleInCurrentBrand || [];
});
const partnerOptions = INVOICE_PARTNERS;
const defaultConfig = () => ({
  store_uid: '',
  inv_user_name: '',
  inv_password: '',
  inv_tax_code: '',
  inv_series: '',
  inv_template_id: '',
  version: 'invoice_v1',
  config_template_v2: 0,
  accept_zero_vat: 0,
  enable_savesign: 0,
  block_export_vat_0d: 0,
  export_vat_invoice_date_is_tran_date: 0
});

const partner = ref(props.partnerSelected || INVOICE_PARTNERS[0].code);
const store = ref();
const isLoading = ref(false);
const config = ref(defaultConfig());

const resetData = () => {
  partner.value = props.partnerSelected || INVOICE_PARTNERS[0].code;
  store.value = {};
  config.value = defaultConfig();
};

const saveConfig = async () => {
  isLoading.value = true;
  const res = await invoiceStore.updateStoreSettingInvoice({
    ...config.value,
    store_uid: store.value.id,
    store_name: store.value.store_name,
    partner_id: partner.value,
    company_uid: globalStore.currentUser.company_uid,
    brand_uid: globalStore.brandUid
  });
  isLoading.value = false;
  if (res?.error) {
    toast.add({ severity: 'error', summary: res.error?.message, life: 3000 });
  } else {
    toast.add({ severity: 'success', summary: 'Lưu cấu hình thành công', life: 3000 });
    visibleDetail.value = false;
  }
};

watch(
  () => props.partnerSelected,
  (newVal) => {
    partner.value = newVal;
  }
);

watch(
  () => props.storeSelected,
  (newVal) => {
    if (newVal?.store_uid) {
      store.value = globalStore?.storesAccessibleInCurrentBrand?.find(
        (item) => item.id === newVal.store_uid
      );
      config.value = { ...defaultConfig(), ...newVal };
    } else {
      resetData();
    }
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
