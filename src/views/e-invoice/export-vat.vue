<template>
  <div class="fb-flex fb-items-center fb-justify-center fb-min-h-screen fb-p-4">
    <FbCard
      class="fb-w-full md:fb-w-[55vw] fb-shadow-2xl !fb-rounded-2xl fb-overflow-visible !fb-p-6"
    >
      <div class="fb-bg-surface-0 fb-border-b fb-border-surface-200 fb-pb-5">
        <div class="fb-flex fb-flex-col fb-items-center">
          <h6 class="!fb-font-semibold !fb-text-sm !fb-mb-0">
            {{ t('SALE_SYNC_VAT--VAT_INFO') }}
          </h6>
          <p class="fb-text-sm fb-text-muted-color fb-mt-1 fb-font-normal text-center">
            {{ !url ? t('SALE_SYNC_VAT--TEXT_NOTE') : t('SALE_SYNC_VAT--EXPORT_VAT_SUCCESS_NOTE') }}
          </p>
        </div>
      </div>

      <div class="fb-py-5">
        <Fluid v-if="!url" class="">
          <div class="fb-flex fb-flex-wrap fb-items-center fb-gap-4 fb-justify-between fb-mb-4">
            <!-- Đối tượng: Cá nhân / Tổ chức -->
            <div class="fb-flex fb-gap-8">
              <div class="fb-flex fb-items-center">
                <RadioButton
                  v-model="scope"
                  inputId="scope_company"
                  :value="0"
                  :disabled="isLoading"
                />
                <label
                  for="scope_company"
                  class="fb-ml-2 fb-font-semibold fb-cursor-pointer fb-mb-0"
                >
                  {{ t('SALE_SYNC_VAT--COMPANY') }}
                </label>
              </div>
              <div class="fb-flex fb-items-center">
                <RadioButton
                  v-model="scope"
                  inputId="scope_individual"
                  :value="1"
                  :disabled="isLoading"
                />
                <label
                  for="scope_individual"
                  class="fb-ml-2 fb-font-semibold fb-cursor-pointer fb-mb-0"
                >
                  {{ t('SALE_SYNC_VAT--INDIVIDUAL') }}
                </label>
              </div>
            </div>
            <div>
              <Select
                v-model="selectedVatInfo"
                size="small"
                placeholder="Thông tin đã lưu"
                class="!fb-border-0 !fb-shadow-none"
                :options="invoiceStore.guestVatOptions"
                :loading="isLoadingGuestVat"
                optionLabel="buyer_display_name"
                optionValue="_id"
                showClear
                @show="showSelect = true"
                @hide="showSelect = false"
                @value-change="handleSelectVatInfo"
              >
                <!-- <template #value="{ value, placeholder }">
                  <span class="fb-text-primary">
                    {{ value || placeholder }}
                  </span>
                </template> -->
                <template #dropdownicon>
                  <IconChevrondown :class="{ 'fb-rotate-180': showSelect }" />
                </template>

                <template #empty>Chưa có thông tin đã lưu nào.</template>

                <template #option="{ option }">
                  <div
                    class="fb-flex fb-items-center fb-justify-between fb-gap-4 fb-w-full !fb-min-w-[15rem] fb-max-w-[25rem]"
                  >
                    <div class="fb-truncate">
                      <div class="fb-font-medium">
                        {{ option?.buyer_legal_name }}
                        {{ option?.buyer_legal_name && option?.buyer_display_name ? ' - ' : '' }}
                        {{ option?.buyer_display_name }}
                      </div>
                      <div class="fb-text-gray-500">
                        {{ option?.buyer_tax_code || option?.sdt_nmua }}
                      </div>
                    </div>
                    <Button
                      text
                      size="small"
                      class="!fb-p-0 fb-max-w-min"
                      @click.stop.prevent="deleteVatOption(option)"
                      @mousedown.stop
                    >
                      <IconTrash class="fb-text-error" />
                    </Button>
                  </div>
                </template>
              </Select>
            </div>
          </div>

          <!-- Grid 2 cột cho các trường còn lại -->
          <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-x-6 fb-gap-y-4 fb-mb-4">
            <!-- Mã số thuế (Chỉ hiện nếu là Tổ chức) -->
            <div
              v-if="scope === 0"
              class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1"
            >
              <label for="tax_code" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('MINVOICE_ROW--LIST_CONFIG--TAX_CODE') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="tax_code"
                v-model="extraSale.inv_buyerTaxCode"
                class="fb-w-full"
                size="small"
                :disabled="isLoading"
                :invalid="scope === 0 && !extraSale.inv_buyerTaxCode"
                :placeholder="t('MINVOICE_ROW--DETAIL_CONFIG--TAX_CODE_INPUT_PLACEHOLDER')"
                @input="handleSearchTaxCode"
              />
            </div>

            <!-- Tên đơn vị (Chỉ hiện nếu là Tổ chức) -->
            <div
              v-if="scope === 0"
              class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1"
            >
              <label for="legal_name" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_SYNC_VAT--BUYER_LEGAL_NAME') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="legal_name"
                v-model="extraSale.inv_buyerLegalName"
                class="fb-w-full"
                size="small"
                :disabled="isLoading"
                :invalid="scope === 0 && !extraSale.inv_buyerLegalName"
                :placeholder="t('CREATE_EDIT_LOCATION--INPUT_COMPANY_NAME_PLACEHOLDER')"
              />
            </div>

            <!-- Tên khách hàng -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2">
              <label for="display_name" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_EDIT_DELETE_DETAIL--BILL_CONTENT--CUSTOMER_NAME') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="display_name"
                v-model="extraSale.inv_buyerDisplayName"
                class="fb-w-full"
                size="small"
                :disabled="isLoading"
                :invalid="scope === 1 && !extraSale.inv_buyerDisplayName"
                :placeholder="t('CREATE_EDIT_LOCATION--INPUT_GUEST_NAME_PLACEHOLDER')"
              />
            </div>

            <!-- Email -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="email" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_SYNC_VAT--BUYER_EMAIL') }}
              </label>
              <InputText
                id="email"
                v-model="extraSale.inv_buyerEmail"
                size="small"
                :disabled="isLoading"
                :placeholder="t('REGISTER--FORM_EMAIL_PLACEHOLDER')"
              />
            </div>

            <!-- Số điện thoại -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="phone" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('BILL_CONTENT--CUSTOMER_PHONE') }}
                <span class="fb-text-error fb-ml-1">*</span>
              </label>
              <InputText
                id="phone"
                v-model="extraSale.sdtnmua"
                size="small"
                :disabled="isLoading"
                :invalid="scope === 1 && !extraSale.sdtnmua"
                :placeholder="t('CONNECT_AHAMOVE_MODAL--PHONE_INPUT_PLACEHOLDER')"
              />
            </div>

            <!-- CCCD / Identity Card -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="id_card" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_SYNC_VAT--INPUT_CCCD') }}
              </label>
              <InputGroup>
                <InputText
                  id="id_card"
                  v-model="extraSale.inv_buyerIdentityCard"
                  size="small"
                  :disabled="isLoading"
                  :placeholder="t('SALE_SYNC_VAT--INPUT_CCCD_PLACEHOLDER')"
                  maxlength="12"
                />
                <InputGroupAddon class="fb-text-xs">
                  {{ (extraSale.inv_buyerIdentityCard || '').length }}/12
                </InputGroupAddon>
              </InputGroup>
            </div>

            <!-- Hộ chiếu -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="passport" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_SYNC_VAT--INPUT_PASSPORT_NUMBER') }}
              </label>
              <InputGroup>
                <InputText
                  id="passport"
                  v-model="extraSale.passport_number"
                  size="small"
                  :disabled="isLoading"
                  :placeholder="t('SALE_SYNC_VAT--INPUT_PASSPORT_NUMBER_PLACEHOLDER')"
                  maxlength="20"
                />
                <InputGroupAddon class="fb-text-xs">
                  {{ (extraSale.passport_number || '').length }}/20
                </InputGroupAddon>
              </InputGroup>
            </div>

            <!-- Số tai khoản -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="bank_acc" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('STORE_DETAIL--VIET_QR_INPUT_BANK_ACC') }}
              </label>
              <InputText
                id="bank_acc"
                v-model="extraSale.inv_buyerBankAccount"
                size="small"
                :disabled="isLoading"
                :placeholder="t('STORE_DETAIL--VIET_QR_INPUT_BANK_ACC')"
              />
            </div>
            <!-- Tên ngân hàng -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="bank_name" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('STORE_DETAIL--VIET_QR_INPUT_LIST_BANK--LABEL') }}
              </label>
              <InputText
                id="bank_name"
                v-model="extraSale.inv_buyerBankName"
                size="small"
                :disabled="isLoading"
                :placeholder="t('STORE_DETAIL--VIET_QR_INPUT_LIST_BANK--LABEL')"
              />
            </div>

            <!-- Ghi chú (Full width) -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="note" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('BILL_CONTENT--NOTE') }}
              </label>
              <Textarea
                id="note"
                v-model="extraSale.note"
                class="fb-w-full"
                size="small"
                :disabled="isLoading"
                :placeholder="t('SALE_SYNC_VAT--INPUT_NOTE_PLACEHOLDER')"
                rows="2"
              />
            </div>

            <!-- Địa chỉ -->
            <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
              <label for="address" class="fb-font-medium fb-text-sm fb-mb-0">
                {{ t('SALE_SYNC_VAT--BUYER_ADDRESS') }}
                <span v-if="scope === 0" class="fb-text-error fb-ml-1">*</span>
              </label>
              <Textarea
                id="address"
                v-model="extraSale.inv_buyerAddressLine"
                class="fb-w-full"
                size="small"
                rows="2"
                :disabled="isLoading"
                :invalid="scope === 0 && !extraSale.inv_buyerAddressLine"
                :placeholder="t('CREATE_EDIT_LOCATION--INPUT_ADDRESS_PLACEHOLDER')"
              />
            </div>
          </div>

          <label for="checkOption1" class="fb-cursor-pointer fb-mb-0 fb-flex fb-gap-3">
            <Checkbox inputId="checkOption1" name="checkOption1" v-model="isSaveVatInfo" binary />
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
        <div v-else class="fb-flex fb-flex-col fb-items-center fb-justify-center fb-py-10 fb-gap-4">
          <div class="fb-h-[8rem] fb-w-[8rem]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="fb-stroke-success"
              />
            </svg>
          </div>

          <p class="fb-text-lg fb-font-medium fb-text-success">Yêu cầu xuất hóa đơn thành công</p>
        </div>
      </div>

      <div class="fb-bg-surface-0 fb-border-t fb-border-surface-200 fb-pt-5">
        <div class="fb-flex fb-justify-end fb-gap-3">
          <Button
            v-if="url || isLoadingPreview"
            :label="isLoadingPreview ? 'Đang đợi lấy hoá đơn' : 'Xem hoá đơn'"
            :severity="isLoadingPreview ? 'secondary' : 'success'"
            :loading="isLoadingPreview"
            @click="openPreview()"
          />
          <Button
            v-if="!url"
            :label="t('SALE_SYNC_VAT--EXPORT_VAT')"
            raised
            :loading="isLoadingSave"
            class="fb-w-full md:fb-w-auto"
            @click="handleExport"
          />
          <Button
            v-if="url && !isLoadingSave"
            label="Chỉnh sửa"
            severity="secondary"
            text
            @click="updateVatInfo"
          />
        </div>
      </div>
    </FbCard>
  </div>
  <ConfirmDialog />
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useI18n } from '@/common/i18n';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useVisitorId } from '@/common/composables/useVisitorId';
import md5Enscrypt from '@/common/utils/md5';

const invoiceStore = useEInoiveStore();
const toast = useToast();
const confirm = useConfirm();
const route = useRoute();
const { getStableVisitorId } = useVisitorId();
const { t } = useI18n();

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
  passport_number: '',
  _id: ''
};

const isLoadingSave = ref(false);
const isLoadingGuestVat = ref(false);
const isLoadingSession = ref(false);
const isLoadingPreview = ref(false);
const selectedVatInfo = ref(null);
const scope = ref(1); // 0: Tổ chức, 1: Cá nhân
const showSelect = ref(false);
const isSaveVatInfo = ref(false);
const url = ref(null);

const extraSale = ref({ ...DEFAULT_EXTRA_SALE });

const isLoading = computed(() => {
  return isLoadingSession.value;
});

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
        // summary: t('NOTIFICATION--TITLE_WARNING'),
        detail: t('VALIDATE--REQUIRED'),
        life: 3000
      });
      return false;
    }
  } else if (scope.value === 1) {
    if (!extraSale.value.sdtnmua || !extraSale.value.inv_buyerDisplayName) {
      toast.add({
        severity: 'warn',
        // summary: t('NOTIFICATION--TITLE_WARNING'),
        detail: t('VALIDATE--REQUIRED'),
        life: 3000
      });
      return false;
    }
  }
  return true;
};

const handleExport = async () => {
  const { store_uid, tran_id } = route.query;
  if (!store_uid || !tran_id) {
    toast.add({
      severity: 'error',
      detail: 'Truyền thiếu dữ liệu, vui lòng kiểm tra lại!',
      life: 3000
    });
    return;
  }

  isLoadingSave.value = true;
  try {
    if (!validateForm()) {
      return;
    }
    if (isSaveVatInfo.value) {
      await saveVatInfo();
    }

    url.value = null;
    const { _id, source, ...extra_sale } = extraSale.value;

    const payload = {
      extra_sale,
      store_uid,
      tran_id
    };

    const timestamp = Date.now().toString();
    const tokenExportVat = import.meta.env.VITE_TOKEN_EXPORT_VAT || '';
    const strEnscrypt = tran_id + timestamp + tokenExportVat;
    const token = md5Enscrypt(strEnscrypt);

    const headers = {
      timestamp,
      token,
      options: ''
    };

    const response = await invoiceService.updateInvoiceByQr(payload, headers);
    
    if (!response.data) {
      throw new Error(response.message?.debug_message || response.message?.message);
    }

    toast.add({
      severity: 'success',
      detail: 'Gửi yêu cầu xuất VAT thành công',
      life: 3000
    });

    const {
      access_token,
      link_image_invoice,
      partner_id,
      tax_code,
      url: url_res
    } = response?.data || {};

    if (link_image_invoice) {
      // ME V2
      url.value = link_image_invoice;
    } else if (url_res) {
      isLoadingPreview.value = true;
      const {
        data: imageData,
        success: imageSuccess,
        message: imageMessage
      } = await invoiceService.customService(url_res, {
        headers: Object.assign(
          {
            Authorization: access_token,
            fabi_type: undefined,
            timezone: undefined,
            'x-client-timezone': undefined,
            access_token: undefined
          },
          partner_id === 'MEINVOICE' ? { TaxCode: tax_code } : null
        ),
        responseType: 'blob'
      });

      isLoadingPreview.value = false;

      if (imageSuccess) {
        url.value = window.URL.createObjectURL(new Blob([imageData], { type: 'application/pdf' }));
      } else {
        toast.add({
          severity: 'error',
          detail: imageMessage,
          life: 3000
        });
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      detail: error?.message || t('ERROR_RESPONSE_MESSAGE--520'),
      life: 3000
    });
  } finally {
    isLoadingSave.value = false;
    await getVatInfo();
  }
};

const updateVatInfo = () => {
  url.value = null;
};

const openPreview = () => {
  if (url.value) window.open(url.value, '_blank');
};

const saveVatInfo = async () => {
  try {
    const payload = {
      buyer_display_name: extraSale.value.inv_buyerDisplayName,
      buyer_legal_name: extraSale.value.inv_buyerLegalName,
      buyer_tax_code: extraSale.value.inv_buyerTaxCode,
      buyer_address_line: extraSale.value.inv_buyerAddressLine,
      buyer_email: extraSale.value.inv_buyerEmail,
      buyer_bank_account: extraSale.value.inv_buyerBankAccount,
      buyer_bank_name: extraSale.value.inv_buyerBankName,
      sdt_nmua: extraSale.value.sdtnmua,
      ma_dt: extraSale.value.ma_dt,
      note: extraSale.value.note,
      inv_buyerIdentityCard: extraSale.value.inv_buyerIdentityCard,
      budget_unit_code: extraSale.value.budget_unit_code,
      passport_number: extraSale.value.passport_number
    };
    if (extraSale.value._id) {
      await invoiceService.updateGuestVatInfo(extraSale.value._id, payload);
    } else {
      await invoiceService.createGuestVatInfo(payload);
    }
  } catch (error) {
    console.error('Error saving guest VAT info', error);
    // toast.add({
    //   severity: 'error',
    //   detail: 'Không thể lưu thông tin đã xuất hóa đơn',
    //   life: 3000
    // });
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
        await invoiceService.deleteGuestVatInfo(option._id);
        await getVatInfo();
        if (selectedVatInfo.value === option._id) {
          selectedVatInfo.value = null;
        }
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
    await getGuestSession();
    await getVatInfo();
  } catch (error) {
    console.error('Error fetching guest data', error);
  }
};

const getGuestSession = async () => {
  isLoadingSession.value = true;
  // const visitorId = await getVisitorId();
  const visitorId = await getStableVisitorId();
  await invoiceStore.fetchGuestSession({ visitor_id: visitorId });
  isLoadingSession.value = false;
};

const getVatInfo = async () => {
  isLoadingGuestVat.value = true;
  await invoiceStore.fetchGuestVatInfo();
  isLoadingGuestVat.value = false;
};

const handleSelectVatInfo = (event) => {
  const value = invoiceStore.guestVatOptions.find((option) => option._id === event);

  if (!value) {
    extraSale.value = { ...DEFAULT_EXTRA_SALE };
    return;
  }

  extraSale.value = {
    ...extraSale.value,
    _id: value._id || '',
    inv_buyerDisplayName: value.buyer_display_name || '',
    inv_buyerLegalName: value.buyer_legal_name || '',
    inv_buyerTaxCode: value.buyer_tax_code || '',
    inv_buyerAddressLine: value.buyer_address_line || '',
    inv_buyerEmail: value.buyer_email || '',
    inv_buyerBankAccount: value.buyer_bank_account || '',
    inv_buyerBankName: value.buyer_bank_name || '',
    sdtnmua: value.sdt_nmua || '',
    ma_dt: value.ma_dt || '',
    note: value.note || '',
    inv_buyerIdentityCard: value.inv_buyerIdentityCard || '',
    budget_unit_code: value.budget_unit_code || '',
    passport_number: value.passport_number || ''
  };

  // Tự động chuyển đổi scope dựa trên thông tin
  if (value.buyer_tax_code) {
    scope.value = 0;
  } else {
    scope.value = 1;
  }
};

onMounted(() => {
  getData();
});
</script>
