<template>
  <DetailView title="Điều chỉnh tăng" :handleBack="handleBack">
    <template #header-actions>
      <Button label="Lưu" severity="primary" size="small" />
    </template>

    <div class="fb-px-10 fb-pb-10">
      <!-- Card 1: Thông tin đơn vị phát hành -->
      <div
        class="card !fb-p-0 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-mb-6 fb-overflow-hidden"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-bg-gray-100 fb-px-6 fb-py-3 fb-font-semibold fb-text-gray-700 fb-uppercase">
          Thông tin đơn vị phát hành
        </div>
        <div class="fb-p-4">
          <div class="fb-text-center fb-font-medium fb-mb-6 fb-text-lg">
            Hoá đơn điện tử giá trị gia tăng
          </div>

          <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-12 fb-gap-x-6 fb-gap-y-4">
            <!-- Left side -->
            <div class="md:fb-col-span-8 fb-flex fb-flex-col fb-gap-4">
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Mã số thuế
                </label>
                <div class="fb-w-full md:fb-w-3/4 fb-flex fb-gap-1">
                  <!-- Giả lập input group MST -->
                  <InputText size="small" value="0" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="1" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="0" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="4" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="7" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="8" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="8" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="4" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="7" class="!fb-w-8 !fb-text-center" readonly />
                  <span class="fb-mx-1 fb-self-center">-</span>
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Tên đơn vị
                </label>
                <div class="fb-w-full md:fb-w-3/4">
                  <InputText
                    size="small"
                    class="fb-w-full"
                    value="CÔNG TY CỔ PHẦN IPOS.VN - TEST HÓA ĐƠN"
                    readonly
                  />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Địa chỉ
                </label>
                <div class="fb-w-full md:fb-w-3/4">
                  <InputText
                    size="small"
                    class="fb-w-full"
                    value="Tòa Tháp VP Hòa Bình, 106 Hoàng Quốc Việt, Phường Nghĩa Đô, Thành phố Hà Nội, Việt Nam"
                    readonly
                  />
                </div>
              </div>
            </div>

            <!-- Right side -->
            <div class="md:fb-col-span-4 fb-flex fb-flex-col fb-gap-4">
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                  Mẫu số
                </label>
                <div class="fb-w-full md:fb-w-2/3">
                  <InputText size="small" class="fb-w-full fb-bg-gray-100" value="1" readonly />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                  Ký hiệu
                </label>
                <div class="fb-w-full md:fb-w-2/3">
                  <InputText
                    size="small"
                    class="fb-w-full fb-bg-gray-100"
                    value="C26MDT"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Thông tin khách hàng & hóa đơn -->
      <div class="card fb-w-full !fb-rounded-2xl fb-overflow-visible !fb-p-6">
        <div class="fb-bg-surface-0 fb-border-b fb-border-surface-200 fb-pb-5">
          <div class="fb-flex fb-flex-col fb-items-center">
            <h6 class="!fb-font-semibold !fb-text-sm !fb-mb-0">
              {{ t('SALE_SYNC_VAT--VAT_INFO') }}
            </h6>
            <p class="fb-text-sm fb-text-muted-color fb-mt-1 fb-font-normal text-center">
              {{
                !url ? t('SALE_SYNC_VAT--TEXT_NOTE') : t('SALE_SYNC_VAT--EXPORT_VAT_SUCCESS_NOTE')
              }}
            </p>
          </div>
        </div>

        <div class="fb-py-5">
          <Fluid class="">
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
                  <span v-if="scope === 1" class="fb-text-error fb-ml-1">*</span>
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
                  <span v-if="scope === 1" class="fb-text-error fb-ml-1">*</span>
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
                </label>
                <Textarea
                  id="address"
                  v-model="extraSale.inv_buyerAddressLine"
                  class="fb-w-full"
                  size="small"
                  rows="2"
                  :disabled="isLoading"
                  :placeholder="t('CREATE_EDIT_LOCATION--INPUT_ADDRESS_PLACEHOLDER')"
                />
              </div>

              <!-- PTTT -->
              <div class="fb-flex fb-flex-col fb-gap-2 fb-col-span-2 md:fb-col-span-1">
                <label for="address" class="fb-font-medium fb-text-sm fb-mb-0">
                  {{ 'Hình thức thanh toán' }}
                </label>
                <Select
                  :options="[]"
                  optionLabel="name"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn PTTT"
                  size="small"
                />
              </div>
            </div>
          </Fluid>
        </div>
      </div>
      <!-- Bảng 1: Hàng hóa dịch vụ -->
      <FbTable
        class="fb-mb-6"
        :items="itemsTable1"
        :columns="TABLE_1_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
      >
        <template #header>
          <div class="fb-flex fb-justify-between fb-items-center">
            <div class="fb-font-medium fb-text-gray-700">Chi tiết hàng hóa, dịch vụ</div>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
            />
          </div>
        </template>
        <template #action>
          <Button icon="pi pi-trash" severity="danger" text rounded />
        </template>
      </FbTable>

      <!-- Bảng 2: Các loại phí -->
      <FbTable
        class="fb-mb-6"
        :items="itemsTable2"
        :columns="TABLE_2_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
      >
        <template #header>
          <div class="fb-flex fb-justify-between fb-items-center">
            <div class="fb-font-medium fb-text-gray-700">Chi tiết các loại phí</div>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
            />
          </div>
        </template>
        <template #action>
          <Button icon="pi pi-trash" severity="danger" text rounded />
        </template>
      </FbTable>

      <!-- Form nhập cuối cùng -->
      <div
        class="card !fb-p-4 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-text-sm fb-text-gray-700"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <!-- Top Row -->
        <div class="fb-flex fb-items-center fb-gap-8 fb-mb-8">
          <div class="fb-flex fb-items-center fb-gap-4">
            <span class="fb-font-medium">Loại tiền</span>
            <InputText size="small" class="fb-w-[100px]" value="VND" />
          </div>
          <div class="fb-flex fb-items-center fb-gap-4">
            <span class="fb-font-medium">Tỷ giá</span>
            <InputText size="small" class="fb-w-[150px]" />
          </div>
        </div>

        <!-- 2 Columns for Taxes -->
        <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-x-10 fb-gap-y-4 fb-mb-8">
          <!-- Left Column -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền không kê khai chịu thuế:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền không chịu thuế:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 0%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="300,000" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 5%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 8%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 10%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center fb-mt-4">
              <span class="fb-font-semibold">
                Tổng tiền trước thuế
                <br />
                <span class="fb-italic fb-font-normal fb-text-gray-500">(Total)</span>
              </span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="300,000" readonly />
            </div>
          </div>

          <!-- Right Column -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <!-- 2 dummy rows to align with the left column -->
            <div class="fb-invisible fb-hidden md:fb-flex fb-justify-between fb-items-center">
              <span>Ẩn</span>
              <InputText size="small" class="fb-w-[150px]" readonly />
            </div>
            <div class="fb-invisible fb-hidden md:fb-flex fb-justify-between fb-items-center">
              <span>Ẩn</span>
              <InputText size="small" class="fb-w-[150px]" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 0%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 5%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 8%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 10%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
          </div>
        </div>

        <!-- Tổng tiền dịch vụ -->
        <div class="fb-flex fb-justify-end fb-items-center fb-gap-4 fb-mb-8">
          <span class="fb-font-semibold">
            Tổng tiền dịch vụ
            <span class="fb-italic fb-font-normal fb-text-gray-500">(Amount)</span>
          </span>
          <InputText
            size="small"
            class="fb-w-[200px] fb-text-right fb-bg-gray-100 !fb-border-transparent"
            value="300,000"
            readonly
          />
        </div>

        <!-- Số tiền viết bằng chữ -->
        <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-4">
          <span class="fb-font-semibold fb-whitespace-nowrap">
            Số tiền viết bằng chữ
            <span class="fb-italic fb-font-normal fb-text-gray-500">(Amount in word)</span>
          </span>
          <div class="fb-w-full">
            <InputText
              size="small"
              class="fb-w-full fb-bg-gray-100 !fb-border-transparent"
              value="Ba trăm nghìn đồng chẵn"
              readonly
            />
          </div>
        </div>
      </div>
    </div>
  </DetailView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { useGlobalStore } from '@/stores/global.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useI18n } from '@/common/i18n';

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const toast = useToast();
const globalStore = useGlobalStore();
const saleData = ref({});
const isLoading = ref(false);

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
  _id: '',
};

const formInfo = ref({});
const extraSale = ref({ ...DEFAULT_EXTRA_SALE });

const scope = ref(0); // 0: Tổ chức, 1: Cá nhân

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
  if (!extraSale.value?.inv_buyerTaxCode) return;
  try {
    const respoonse = await invoiceService.searchByTaxCode({
      tax_code: extraSale.value.inv_buyerTaxCode,
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
      detail: error.message || '',
      life: 3000,
    });
  }
};

const handleSearchTaxCode = debounce(searchByTaxCode, 500);

const handleBack = () => {
  router.push('/e-invoice/invoice-manage');
};

onMounted(async () => {
  try {
    const payload = {
      company_uid: globalStore?.currentUser?.company_uid,
      brand_uid: globalStore?.brandUid,
      tran_id: route.query?.tran_id,
      store_uid: route.query?.store_uid,
    };
    const res = await invoiceService.getSaleByTranId(payload);
    saleData.value = res?.data || {};
    const data = res.data;
    formInfo.value = {
      ...data,
    };
    extraSale.value = { ...DEFAULT_EXTRA_SALE, ...(data.extra_sale || {}) };

    // Default values for fields not in API
    formInfo.value.calculation_support = 'Mặc định';
    formInfo.value.tax_rate_support = '0%';
    formInfo.value.adjustment_criteria = 'Điều chỉnh số lượng';
    formInfo.value.payment_method_name =
      data.sale_payment_method?.[0]?.payment_method_name || 'Thanh toán tiền mặt';

    console.log('getSaleByTranId response:', res);
  } catch (error) {
    console.error('getSaleByTranId error:', error);
  }
});

const itemsTable1 = ref([
  // mock data
]);

const itemsTable2 = ref([
  // mock data
]);

const TABLE_1_COLUMNS = [
  { field: 'action', header: 'Xóa', width: '60px', align: 'center', type: 'custom' },
  { field: 'property', header: 'Tính chất' },
  { field: 'stt', header: 'STT', width: '60px', align: 'center' },
  { field: 'code', header: 'Mã hàng hóa' },
  { field: 'name', header: 'Tên hàng hóa, dịch vụ' },
  { field: 'unit', header: 'ĐVT (Unit)' },
  { field: 'quantity', header: 'Số lượng', align: 'right' },
  { field: 'price', header: 'Đơn giá', align: 'right' },
  { field: 'total_before_discount', header: 'Tiền trước chiết khấu', align: 'right' },
  { field: 'discount_rate', header: 'Tỷ lệ chiết khấu', align: 'right' },
  { field: 'discount_amount', header: 'Số tiền chiết khấu', align: 'right' },
  { field: 'total_amount', header: 'Thành tiền (Total) VNĐ', align: 'right' },
  { field: 'vat_rate', header: 'Thuế suất GTGT(%)', align: 'right' },
  { field: 'vat_amount', header: 'Thuế GTGT', align: 'right' },
  { field: 'total', header: 'Cộng', align: 'right' },
  { field: 'service_fee', header: 'Tiền phí dịch vụ', align: 'right' },
];

const TABLE_2_COLUMNS = [
  { field: 'action', header: 'Xóa', width: '60px', align: 'center', type: 'custom' },
  { field: 'stt', header: 'STT', width: '60px', align: 'center' },
  { field: 'fee_name', header: 'Tên loại phí' },
  { field: 'fee_amount', header: 'Tiền phí', align: 'right' },
];
</script>
