<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="$t('SALE_SYNC_VAT--VAT_INFO')"
    :style="{ width: '60vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div v-if="props.saleData?.is_immediate"></div>
      <div v-else class="fb-flex fb-flex-col fb-items-center fb-flex-1">
        <h6 class="fb-font-semibold fb-text-lg">{{ $t('SALE_SYNC_VAT--VAT_INFO') }}</h6>
        <p class="fb-text-sm fb-text-error fb-mt-1">
          {{ $t('SALE_SYNC_VAT--TEXT_NOTE') }}
        </p>
      </div>
    </template>

    <template #default>
      <div
        v-if="props.saleData?.is_immediate"
        class="fb-text-center fb-font-medium fb-text-lg fb-text-error"
      >
        {{
          $t('SALE_SYNC_VAT--EXPORT_IMMEDIATE--TEXT_NOTE', {
            buyerDisplayname: getInvBuyerDisplayName()
          })
        }}
      </div>
      <Fluid v-else class="fb-space-y-4">
        <!-- Đối tượng: Cá nhân / Tổ chức -->
        <div class="fb-flex fb-gap-4 fb-justify-around">
          <div class="fb-flex fb-items-center">
            <RadioButton v-model="scope" inputId="scope_company" :value="0" />
            <label for="scope_company" class="fb-ml-2 fb-mb-0 fb-cursor-pointer">
              {{ $t('SALE_SYNC_VAT--COMPANY') }}
            </label>
          </div>
          <div class="fb-flex fb-items-center">
            <RadioButton v-model="scope" inputId="scope_individual" :value="1" />
            <label for="scope_individual" class="fb-ml-2 fb-mb-0 fb-cursor-pointer">
              {{ $t('SALE_SYNC_VAT--INDIVIDUAL') }}
            </label>
          </div>
        </div>

        <!-- Mã số thuế (Chỉ hiện nếu là Tổ chức) -->
        <div v-if="scope === 0" class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="tax_code" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('MINVOICE_ROW--LIST_CONFIG--TAX_CODE') }}
            <span class="fb-text-error fb-ml-1">*</span>
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="tax_code"
              v-model="extraSale.inv_buyerTaxCode"
              size="small"
              :invalid="!extraSale.inv_buyerTaxCode"
              :placeholder="$t('MINVOICE_ROW--DETAIL_CONFIG--TAX_CODE_INPUT_PLACEHOLDER')"
              @input="handleSearchTaxCode"
            />
          </div>
        </div>

        <!-- Tên đơn vị (Chỉ hiện nếu là Tổ chức) -->
        <div v-if="scope === 0" class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="legal_name" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--BUYER_LEGAL_NAME') }}
            <span class="fb-text-error fb-ml-1">*</span>
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="legal_name"
              v-model="extraSale.inv_buyerLegalName"
              size="small"
              :invalid="!extraSale.inv_buyerLegalName"
              :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_COMPANY_NAME_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- Tên người mua -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="display_name" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_EDIT_DELETE_DETAIL--BILL_CONTENT--CUSTOMER_NAME') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="display_name"
              v-model="extraSale.inv_buyerDisplayName"
              size="small"
              :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_GUEST_NAME_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="address" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--BUYER_ADDRESS') }}
            <span v-if="scope === 0" class="fb-text-error fb-ml-1">*</span>
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="address"
              v-model="extraSale.inv_buyerAddressLine"
              size="small"
              :invalid="!extraSale.inv_buyerLegalName && scope === 0"
              :placeholder="$t('CREATE_EDIT_LOCATION--INPUT_ADDRESS_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="email" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--BUYER_EMAIL') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="email"
              v-model="extraSale.inv_buyerEmail"
              size="small"
              :placeholder="$t('REGISTER--FORM_EMAIL_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- Số điện thoại -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="phone" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('BILL_CONTENT--CUSTOMER_PHONE') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="phone"
              v-model="extraSale.sdtnmua"
              size="small"
              :placeholder="$t('CONNECT_AHAMOVE_MODAL--PHONE_INPUT_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- CCCD / Identity Card -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="id_card" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--INPUT_CCCD') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputGroup class="fb-w-full">
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
        </div>

        <!-- Hộ chiếu -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="passport" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--INPUT_PASSPORT_NUMBER') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputGroup class="fb-w-full">
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
        </div>

        <!-- Thông tin ngân hàng -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="bank_acc" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('STORE_DETAIL--VIET_QR_INPUT_BANK_ACC') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9 fb-grid fb-grid-cols-2 fb-gap-2">
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

        <!-- Mã đơn vị dự toán -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="budget_unit" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('SALE_SYNC_VAT--INPUT_BUDGET_UNIT') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <InputText
              id="budget_unit"
              v-model="extraSale.budget_unit_code"
              size="small"
              :placeholder="$t('SALE_SYNC_VAT--INPUT_BUDGET_UNIT_PLACEHOLDER')"
            />
          </div>
        </div>

        <!-- Ghi chú -->
        <div class="fb-grid fb-grid-cols-12 fb-gap-1">
          <label for="note" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
            {{ $t('BILL_CONTENT--NOTE') }}
          </label>
          <div class="fb-col-span-12 md:fb-col-span-9">
            <Textarea
              id="note"
              v-model="extraSale.note"
              size="small"
              :placeholder="$t('SALE_SYNC_VAT--INPUT_NOTE_PLACEHOLDER')"
              rows="2"
              autoResize
            />
          </div>
        </div>
      </Fluid>
    </template>

    <template #footer>
      <div class="fb-flex fb-justify-between fb-flex-1 fb-gap-2">
        <Button
          :label="$t('SALE_SYNC_VAT--BUTTON_CLOSE')"
          raised
          severity="secondary"
          @click="visible = false"
        />
        <!-- Người dùng bấm xuất ngay -->
        <Button
          v-if="props.saleData.is_immediate"
          class="btn"
          :label="$t('SALE_SYNC_VAT--EXPORT_VAT')"
          raised
          :loading="isLoading"
          @click="handleExportNotReceiveBill"
        />
        <div v-else class="fb-space-x-2">
          <Button
            class="btn"
            :label="$t('SALE_SYNC_VAT--NOT_RECEIVE_BILL')"
            raised
            severity="warn"
            :loading="isLoading"
            @click="handleExportNotReceiveBill"
          />
          <Button
            class="btn"
            :label="$t('SALE_SYNC_VAT--EXPORT_VAT')"
            raised
            :loading="isLoading"
            @click="handleExport"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from '@/common/i18n';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();

// Giả định props truyền vào
const props = defineProps({
  // sale hoặc list sales cần xuất
  saleData: {
    type: Object,
    default: () => ({})
  }
});

const visible = defineModel('visible', { default: false });
const emit = defineEmits(['success']);
const toast = useToast();

const isLoading = ref(false);
const scope = ref(1); // 0: Tổ chức, 1: Cá nhân

const DEFAULT_EXTRA_SALE = {
  source: 'CMS',
  inv_buyerDisplayName: '',
  inv_buyerLegalName: '',
  inv_buyerTaxCode: '.',
  inv_buyerAddressLine: '.',
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

// Logic tìm kiếm theo mã số thuế (Debounced)
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
      detail: error?.message || '',
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

const handleExportNotReceiveBill = async () => {
  const defaultText = getInvBuyerDisplayName();
  extraSale.value.inv_buyerDisplayName = defaultText;
  extraSale.value.inv_buyerLegalName = defaultText;

  await handleExport();
};

const handleExport = async () => {
  isLoading.value = true;

  try {
    if (!validateForm()) {
      isLoading.value = false;
      return;
    }

    const salesList = props.saleData?.sales || [];
    const payload = {
      extra_sale: { ...extraSale.value },
      ...(salesList.length > 1 && { is_not_merge: 1 }),
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      store_uid: salesList.length ? salesList[0]?.store_uid : '',
      list_tran_id: salesList.map((e) => e.tran_id)
    };

    const { error } = await invoiceStore.exportVatInvoice(payload);

    if (error) throw error;

    toast.add({
      severity: 'success',
      // summary: t('NOTIFICATION--TITLE_SUCCESS'),
      detail: 'Dữ liệu đang được đồng bộ sang HĐĐT',
      life: 3000
    });

    emit('success');

    visible.value = false;
  } catch (error) {
    console.error('Export error:', error?.message);
    toast.add({
      severity: 'error',
      // summary: t('NOTIFICATION--TITLE_ERROR'),
      detail: error?.message || t('ERROR_RESPONSE_MESSAGE--520'),
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const mapStoreData = () => {
  return globalStore.currentBrandStores.find(
    (store) => store.id === props.saleData.sales[0].store_uid
  );
};

const getInvBuyerDisplayName = () => {
  return mapStoreData()?.inv_buyerdisplayname || 'Người mua không lấy hóa đơn';
};

// Reset data khi mở/đóng modal
watch(visible, (newVal) => {
  if (newVal) {
    // Nếu có dữ liệu cũ truyền vào từ props.saleData.extra_sale thì fill vào
    if (props.saleData?.extra_sale) {
      extraSale.value = { ...extraSale.value, ...props.saleData.extra_sale };
      scope.value =
        extraSale.value.inv_buyerTaxCode && extraSale.value.inv_buyerTaxCode !== '.' ? 0 : 1;
    }
    console.log(props.saleData);

  } else {
    // Reset về mặc định khi đóng
    extraSale.value = { ...DEFAULT_EXTRA_SALE };
    scope.value = 1;
  }
});
</script>
