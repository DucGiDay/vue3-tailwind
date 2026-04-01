<template>
  <div class="fb-flex fb-items-center fb-justify-center fb-min-h-screen fb-p-4">
    <FbCard
      class="fb-w-full md:fb-w-[55vw] fb-shadow-2xl !fb-rounded-2xl fb-overflow-visible !fb-p-6"
    >
      <div class="fb-bg-surface-0 fb-border-b fb-border-surface-200 fb-pb-5">
        <div class="fb-flex fb-flex-col fb-items-center">
          <h6 class="!fb-font-semibold !fb-text-sm !fb-mb-0">
            {{ $t('SALE_SYNC_VAT--VAT_INFO') }}
          </h6>
          <p class="fb-text-sm fb-text-muted-color fb-mt-1 fb-font-normal text-center">
            {{ $t('SALE_SYNC_VAT--TEXT_NOTE') }}
          </p>
        </div>
      </div>

      <div class="fb-py-5">
        <Fluid class="">
          <div class="fb-flex fb-justify-between">
            <!-- Đối tượng: Cá nhân / Tổ chức (Full width) -->
            <div class="fb-flex fb-gap-8 fb-mb-4">
              <div class="fb-flex fb-items-center">
                <RadioButton v-model="scope" inputId="scope_company" :value="0" />
                <label
                  for="scope_company"
                  class="fb-ml-2 fb-font-semibold fb-cursor-pointer fb-mb-0"
                >
                  {{ $t('SALE_SYNC_VAT--COMPANY') }}
                </label>
              </div>
              <div class="fb-flex fb-items-center">
                <RadioButton v-model="scope" inputId="scope_individual" :value="1" />
                <label
                  for="scope_individual"
                  class="fb-ml-2 fb-font-semibold fb-cursor-pointer fb-mb-0"
                >
                  {{ $t('SALE_SYNC_VAT--INDIVIDUAL') }}
                </label>
              </div>
            </div>
            <div>
              <Select
                size="small"
                placeholder="Thông tin đã lưu"
                class="!fb-border-0 !fb-shadow-none"
                :options="guestVatOptions"
                :loading="isLoadingGuestVat"
                showClear
                @show="showSelect = true"
                @hide="showSelect = false"
              >
                <template #value="{ value, placeholder }">
                  <span class="fb-text-primary">
                    {{ value || placeholder }}
                  </span>
                </template>
                <template #dropdownicon>
                  <IconChevrondown :class="{ 'fb-rotate-180': showSelect }" />
                </template>

                <template #empty>Chưa có thông tin đã lưu nào.</template>

                <template #option="{ option }">
                  <div
                    class="fb-flex fb-items-center fb-justify-between fb-gap-4 fb-w-full !fb-min-w-[15rem]"
                  >
                    <div class="fb-flex-1">
                      <div class="fb-font-medium">
                        {{ option.name }}
                      </div>
                      <div class="fb-text-gray-500">
                        {{ option.phone }}
                      </div>
                    </div>
                    <IconTrash
                      class="fb-text-error fb-cursor-pointer hover:fb-scale-110 fb-transition-transform"
                      @click.stop="deleteVatOption(option)"
                    />
                  </div>
                </template>
              </Select>
            </div>
          </div>

          <!-- Grid 2 cột cho các trường còn lại -->
          <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-x-6 fb-gap-y-4 fb-mb-4">
            <!-- Mã số thuế (Chỉ hiện nếu là Tổ chức) -->
            <div v-if="scope === 0" class="fb-flex fb-flex-col fb-gap-2">
              <label for="tax_code" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('MINVOICE_ROW--LIST_CONFIG--TAX_CODE') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="tax_code"
                v-model="extraSale.inv_buyerTaxCode"
                class="fb-w-full"
                size="small"
                :invalid="scope === 0 && !extraSale.inv_buyerTaxCode"
                :placeholder="$t('MINVOICE_ROW--DETAIL_CONFIG--TAX_CODE_INPUT_PLACEHOLDER')"
                @input="handleSearchTaxCode"
              />
            </div>

            <!-- Tên đơn vị (Chỉ hiện nếu là Tổ chức) -->
            <div v-if="scope === 0" class="fb-flex fb-flex-col fb-gap-2">
              <label for="legal_name" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_SYNC_VAT--BUYER_LEGAL_NAME') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="legal_name"
                v-model="extraSale.inv_buyerLegalName"
                class="fb-w-full"
                size="small"
                :invalid="scope === 0 && !extraSale.inv_buyerLegalName"
                :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_COMPANY_NAME_PLACEHOLDER')"
              />
            </div>

            <!-- Tên người mua -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2">
              <label for="display_name" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_EDIT_DELETE_DETAIL--BILL_CONTENT--CUSTOMER_NAME') }}
              </label>
              <InputText
                id="display_name"
                v-model="extraSale.inv_buyerDisplayName"
                class="fb-w-full"
                size="small"
                :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_GUEST_NAME_PLACEHOLDER')"
              />
            </div>

            <!-- Email -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label for="email" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_SYNC_VAT--BUYER_EMAIL') }}
              </label>
              <InputText
                id="email"
                v-model="extraSale.inv_buyerEmail"
                size="small"
                :placeholder="$t('REGISTER--FORM_EMAIL_PLACEHOLDER')"
              />
            </div>

            <!-- Số điện thoại -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label for="phone" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('BILL_CONTENT--CUSTOMER_PHONE') }}
              </label>
              <InputText
                id="phone"
                v-model="extraSale.sdtnmua"
                size="small"
                :placeholder="$t('CONNECT_AHAMOVE_MODAL--PHONE_INPUT_PLACEHOLDER')"
              />
            </div>

            <!-- CCCD / Identity Card -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label for="id_card" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_SYNC_VAT--INPUT_CCCD') }}
              </label>
              <InputGroup>
                <InputText
                  id="id_card"
                  v-model="extraSale.inv_buyerIdentityCard"
                  size="small"
                  :placeholder="$t('SALE_SYNC_VAT--INPUT_CCCD_PLACEHOLDER')"
                  maxlength="12"
                />
                <InputGroupAddon class="fb-text-xs">
                  {{ (extraSale.inv_buyerIdentityCard || '').length }}/12
                </InputGroupAddon>
              </InputGroup>
            </div>

            <!-- Hộ chiếu -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label for="passport" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_SYNC_VAT--INPUT_PASSPORT_NUMBER') }}
              </label>
              <InputGroup>
                <InputText
                  id="passport"
                  v-model="extraSale.passport_number"
                  size="small"
                  :placeholder="$t('SALE_SYNC_VAT--INPUT_PASSPORT_NUMBER_PLACEHOLDER')"
                  maxlength="20"
                />
                <InputGroupAddon class="fb-text-xs">
                  {{ (extraSale.passport_number || '').length }}/20
                </InputGroupAddon>
              </InputGroup>
            </div>

            <!-- Thông tin ngân hàng -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-1 md:fb-col-span-2">
              <label for="bank_acc" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('STORE_DETAIL--VIET_QR_INPUT_BANK_ACC') }}
              </label>
              <div class="fb-grid fb-grid-cols-2 fb-gap-6">
                <InputText
                  id="bank_acc"
                  v-model="extraSale.inv_buyerBankAccount"
                  size="small"
                  :placeholder="$t('STORE_DETAIL--VIET_QR_INPUT_BANK_ACC')"
                />
                <InputText
                  v-model="extraSale.inv_buyerBankName"
                  size="small"
                  :placeholder="$t('STORE_DETAIL--VIET_QR_INPUT_LIST_BANK--LABEL')"
                />
              </div>
            </div>

            <!-- Ghi chú (Full width) -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-1">
              <label for="note" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('BILL_CONTENT--NOTE') }}
              </label>
              <Textarea
                id="note"
                v-model="extraSale.note"
                class="fb-w-full"
                size="small"
                :placeholder="$t('SALE_SYNC_VAT--INPUT_NOTE_PLACEHOLDER')"
                rows="2"
              />
            </div>

            <!-- Địa chỉ -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label for="address" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ $t('SALE_SYNC_VAT--BUYER_ADDRESS') }}
                <span v-if="scope === 0" class="fb-text-error fb-ml-1">*</span>
              </label>
              <Textarea
                id="address"
                v-model="extraSale.inv_buyerAddressLine"
                class="fb-w-full"
                size="small"
                rows="2"
                :invalid="scope === 0 && !extraSale.inv_buyerAddressLine"
                :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_ADDRESS_PLACEHOLDER')"
              />
            </div>
          </div>

          <label for="checkOption1" class="fb-cursor-pointer fb-mb-0 fb-flex fb-gap-3">
            <Checkbox id="checkOption1" name="checkOption1" v-model="saveVatInfo" binary />
            <div>
              <p class="fb-text-gray-700 fb-font-medium fb-text-sm">Lưu thông tin xuất hóa đơn</p>
              <p class="fb-text-gray-700 fb-font-normal fb-text-base">
                Thông tin sẽ được lưu để sử dụng cho các lần xuất hóa đơn sau, giúp thao tác nhanh
                chóng và chính xác hơn. Bạn có thể chọn lại thông tin đã lưu tại mục
                <span class="fb-font-medium">“Thông tin đã lưu”</span>
                để điền tự động.
              </p>
            </div>
          </label>
        </Fluid>
      </div>

      <div class="fb-bg-surface-0 fb-border-t fb-border-surface-200 fb-pt-5">
        <div class="fb-flex fb-justify-end">
          <Button
            :label="$t('SALE_SYNC_VAT--EXPORT_VAT')"
            raised
            :loading="isLoading"
            @click="handleExport"
          />
        </div>
      </div>
    </FbCard>
  </div>
  <ConfirmDialog />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from '@/common/i18n';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useVisitorId } from '@/common/composables/useVisitorId';

const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();
const toast = useToast();
const confirm = useConfirm();
const { getVisitorId } = useVisitorId();
const { t } = useI18n();

const isLoading = ref(false);
const isLoadingGuestVat = ref(false);
const scope = ref(1); // 0: Tổ chức, 1: Cá nhân
const showSelect = ref(false);
const saveVatInfo = ref(false);
const guestVatOptions = ref([
  {
    name: 'Nguyễn Văn long',
    phone: '0919175144',
    id: 1
  }
]);

const DEFAULT_EXTRA_SALE = {
  source: 'CMS',
  inv_buyerDisplayName: '',
  inv_buyerLegalName: '',
  inv_buyerTaxCode: '',
  inv_buyerAddressLine: '',
  inv_buyerEmail: '',
  inv_buyerBankAccount: '',
  inv_buyerBankName: '',
  sdtnmua: '',
  ma_dt: '',
  inv_buyerIdentityCard: '',
  note: '',
  budget_unit_code: '',
  passport_number: ''
};

const extraSale = ref({ ...DEFAULT_EXTRA_SALE });

// Simple debounce implementation
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const searchByTaxCode = async () => {
  if (!extraSale.value.inv_buyerTaxCode) return;
  try {
    const respoonse = await invoiceService.searchByTaxCode({
      tax_code: extraSale.value.inv_buyerTaxCode
    });

    if (respoonse?.data) {
      const { inv_buyerLegalName, inv_buyerAddressLine, inv_buyerDisplayName } =
        respoonse.data || {};

      extraSale.value.inv_buyerLegalName = inv_buyerLegalName;
      extraSale.value.inv_buyerAddressLine = inv_buyerAddressLine;
      extraSale.value.inv_buyerDisplayName = inv_buyerDisplayName;
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      // summary: t('NOTIFICATION--TITLE_ERROR'),
      detail: error.message || 'Đã có lỗi xảy ra',
      life: 3000
    });
  }
};

const handleSearchTaxCode = debounce(searchByTaxCode, 500);

const validateForm = () => {
  if (scope.value === 0) {
    if (
      !extraSale.value.inv_buyerTaxCode ||
      !extraSale.value.inv_buyerLegalName ||
      !extraSale.value.inv_buyerAddressLine
    ) {
      toast.add({
        severity: 'warn',
        summary: t('NOTIFICATION--TITLE_WARNING'),
        detail: t('VALIDATE--REQUIRED'),
        life: 3000
      });
      return false;
    }
  }
  return true;
};

const handleExport = async () => {
  isLoading.value = true;
  try {
    if (!validateForm()) {
      return;
    }
    // Simulate export
    toast.add({
      severity: 'success',
      detail: 'Dữ liệu đang được đồng bộ sang HĐĐT',
      life: 5000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      detail: error?.message || t('ERROR_RESPONSE_MESSAGE--520'),
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const deleteVatOption = (option) => {
  confirm.require({
    message: 'Bạn có chắc chắn muốn xóa thông tin đã lưu này?',
    header: 'Xác nhận xóa',
    acceptProps: {
      label: 'Xác nhận',
      severity: 'danger'
    },
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true
    },
    accept: async () => {
      try {
        // Logic to delete the option
        // For now, just filter the local array. If there is an API, it should be called here.
        guestVatOptions.value = guestVatOptions.value.filter((item) => item !== option);

        toast.add({
          severity: 'success',
          detail: 'Đã xóa thông tin đã lưu',
          life: 3000
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          detail: error.message || 'Xóa thất bại',
          life: 3000
        });
      }
    }
  });
};

const getData = async () => {
  try {
    isLoadingGuestVat.value = true;
    const visitorId = await getVisitorId();
    console.log(visitorId);

    const config = {
      withCredentials: true
    };

    const [guestVat] = await Promise.all([
      invoiceStore.fetchGuestVatInfo({}, config),
      invoiceStore.fetchGuestSession({ visitor_id: visitorId }, config)
    ]);
    guestVatOptions.value = guestVat;
  } catch (error) {
    console.error('Error fetching guest data', error);
  } finally {
    isLoadingGuestVat.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>
