<template>
  <Dialog
    v-model:visible="visibleDetail"
    modal
    header="Sửa thông tin"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
  >
    <template #header>
      <h6 class="fb-text-center fb-font-semibold fb-text-lg fb-flex-1">Sửa thông tin</h6>
    </template>
    <div v-if="false" class="fb-flex fb-items-center fb-justify-center fb-h-[20rem]">
      <ProgressSpinner class="fb-stroke-primary" />
    </div>

    <Fluid v-else class="fb-space-y-6">
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label
          for="partner"
          class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-2 fb-mb-0"
        >
          Đối tác
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-10">
          <Select
            id="partner"
            v-model="partner"
            :options="partnerOptions"
            placeholder="Chọn đối tác"
            optionLabel="name"
            optionValue="code"
            filter
            :disabled="isEdit"
            @change="onPartnerChange"
          />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="store" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-2 fb-mb-0">
          Cửa hàng
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-10">
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
        <label for="posId" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-2 fb-mb-0">
          POS ID
          <span class="fb-text-error fb-ml-1">*</span>
        </label>
        <div class="fb-col-span-12 md:fb-col-span-10">
          <InputText
            id="posId"
            disabled
            type="text"
            :value="store?.fb_store_id"
            placeholder="POS ID"
          />
        </div>
      </div>

      <!-- Dynamic Form Fields -->
      <template v-for="(field, index) in partnerConfigFields" :key="field.id + index">
        <div v-show="!field.hide?.(config)" class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label
            v-if="field.type !== 'checkbox'"
            :for="field.id"
            class="fb-col-span-12 md:fb-col-span-2 fb-mb-0"
          >
            <span>{{ typeof field.label === 'string' ? field.label : field.id }}</span>
            <span
              v-if="field.type !== 'checkbox' && field.type !== 'radio'"
              class="fb-text-error fb-ml-1"
            >
              *
            </span>

            <svg
              v-if="field.tooltip"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-tooltip.top="{ value: field.tooltip, escape: false }"
              class="fb-w-5 fb-h-5 fb-ml-1 fb-inline-block fb-align-middle"
            >
              <path
                d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </label>
          <div
            :class="[
              'fb-col-span-12 ',
              field.type === 'checkbox' ? 'md:fb-col-span-12' : 'md:fb-col-span-10'
            ]"
          >
            <!-- Radio -->
            <div v-if="field.type === 'radio'" class="fb-flex fb-flex-wrap fb-gap-4 fb-py-2">
              <div
                v-for="opt in field.options"
                :key="opt.value"
                class="fb-flex fb-items-center fb-gap-2"
              >
                <RadioButton
                  :inputId="field.id + opt.value"
                  :name="field.id"
                  :value="opt.value"
                  v-model="config[field.id]"
                />
                <label :for="field.id + opt.value" class="fb-cursor-pointer fb-text-sm fb-mb-0">
                  {{ opt.text }}
                </label>
              </div>
            </div>

            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="fb-py-2">
              <label
                :for="field.id"
                class="fb-cursor-pointer fb-mb-0 fb-flex fb-items-center fb-gap-1"
              >
                <Checkbox
                  :inputId="field.id"
                  :name="field.id"
                  v-model="config[field.id]"
                  :binary="true"
                  :trueValue="1"
                  :falseValue="0"
                />
                <div class="fb-flex fb-items-center fb-gap-2">
                  {{ typeof field.label === 'string' ? field.label : field.id }}
                  <svg
                    v-if="field.tooltip"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    v-tooltip.top="{ value: field.tooltip, escape: false }"
                    class="fb-w-5 fb-h-5"
                  >
                    <path
                      d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </label>
            </div>

            <!-- Password -->
            <Password
              v-else-if="field.id === 'inv_password'"
              :id="field.id"
              v-model="config[field.id]"
              :placeholder="'Nhập ' + (field.label || field.id)"
              :toggleMask="true"
              fluid
              :feedback="false"
            />

            <!-- Default InputText -->
            <InputText
              v-else
              :id="field.id"
              v-model="config[field.id]"
              type="text"
              :placeholder="'Nhập ' + (field.label || field.id)"
              @input="
                field.isReplaceSpace &&
                (config[field.id] = config[field.id].toString().replace(/\s/g, ''))
              "
            />
          </div>
        </div>
      </template>
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
import {
  INVOICE_PARTNERS,
  STORE_CONNECT_PARTNER_CONFIG_KEYS
} from '@/common/constant/e-invoice.constant';
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

const partner = ref(props.partnerSelected || INVOICE_PARTNERS[0].code);
const store = ref();
const isLoading = ref(false);

// Dynamic Config Helpers
const partnerConfigFields = computed(() => {
  return STORE_CONNECT_PARTNER_CONFIG_KEYS[partner.value] || [];
});

const generateDefaultConfig = (fields) => {
  const cfg = {
    store_uid: '',
    config_template_v2: 0,
    accept_zero_vat: 0,
    enable_savesign: 0,
    block_export_vat_0d: 0,
    export_vat_invoice_date_is_tran_date: 0
  };
  fields.forEach((f) => {
    if (f.defaultValue) {
      cfg[f.id] = f.defaultValue;
    } else if (f.type === 'checkbox') cfg[f.id] = 0;
    else if (f.type === 'radio') cfg[f.id] = f.options?.[0]?.value || '';
    else cfg[f.id] = '';
  });
  return cfg;
};

const config = ref(generateDefaultConfig(partnerConfigFields.value));

const resetData = () => {
  partner.value = props.partnerSelected || INVOICE_PARTNERS[0].code;
  store.value = {};
  config.value = generateDefaultConfig(partnerConfigFields.value);
};

const onPartnerChange = () => {
  config.value = { ...generateDefaultConfig(partnerConfigFields.value) };
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
      config.value = { ...generateDefaultConfig(partnerConfigFields.value), ...newVal };
      partner.value = newVal.partner_id;
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
