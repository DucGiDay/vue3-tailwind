<template>
  <DetailView title="Tạo máy tính tiền" :handleBack="handleBack">
    <template #header-actions>
      <Button label="Lưu lại" raised size="small" :loading="loading" @click="handleSave" />
    </template>

    <div class="fb-px-10">
      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-6">
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Mã số thuế
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.tax_code"
                  :options="taxStoreList"
                  optionLabel="tax_code"
                  optionValue="tax_code"
                  placeholder="Chọn mã số thuế"
                  size="small"
                  class="fb-w-full"
                  :loading="isLoadingTaxStores"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Chọn ngày
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <DatePicker
                  fluid
                  v-model="form.date"
                  size="small"
                  dateFormat="dd/mm/yy"
                  placeholder="Chọn ngày"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Mẫu số
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <InputText
                  v-model="form.pattern"
                  class="fb-w-full"
                  placeholder="Nhập mẫu số"
                  size="small"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Cấu hình
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.stop_on_error"
                  :options="STOP_ON_ERROR_OPTIONS"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn cấu hình"
                  size="small"
                />
              </div>
            </div>
          </div>

          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Gói số lượng
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.number_invoice"
                  :options="QUANTITY_PACKAGE_OPTIONS"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn gói số lượng"
                  size="small"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Ký hiệu
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <InputText
                  v-model="form.serial"
                  class="fb-w-full"
                  placeholder="Nhập ký hiệu"
                  size="small"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Thử lại khi lỗi
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.max_retries"
                  :options="MAX_RETRY_OPTIONS"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Số lần thử lại"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FbTable
        class="fb-mt-5"
        :items="items"
        :columns="CREATE_MTT_TABLE_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
        :loading="loadingTable"
      >
        <template #header>
          <div class="fb-flex fb-gap-4 fb-uppercase fb-text-sm fb-font-medium">
            Tổng HD trong bảng: {{ items.length }} - Tổng HD trong kỳ: _ - Tổng HD chưa tạo: _
          </div>
        </template>

        <template #no="{ index }">
          {{ index + 1 }}
        </template>
      </FbTable>
    </div>
  </DetailView>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import {
  CREATE_MTT_TABLE_COLUMNS,
  STOP_ON_ERROR_OPTIONS,
  QUANTITY_PACKAGE_OPTIONS,
  MAX_RETRY_OPTIONS
} from '@/common/constant/e-invoice.constant';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

// --- Initialization ---
const router = useRouter();
const toast = useToast();
const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();

// --- State ---
const loading = ref(false);
const loadingTable = ref(false);
const isLoadingTaxStores = ref(false);
const items = ref([]);
const form = ref({
  tax_code: null,
  date: new Date(),
  pattern: '',
  stop_on_error: true,
  number_invoice: 1,
  serial: '',
  max_retries: 1
});

let debounceTimer = null;

// --- Computed ---
const taxStoreList = computed(() => invoiceStore.listTaxStores.data || []);

// --- Methods ---
const fetchInvoices = async () => {
  if (!form.value.tax_code || !form.value.date) return;

  loadingTable.value = true;
  try {
    const params = {
      tax_code: form.value.tax_code || '',
      company_uid: globalStore?.currentUser?.company_uid || '',
      number_invoice: form.value.number_invoice,
      pattern: form.value.pattern,
      serial: form.value.serial,
      vat_invoice_date: new Date(form.value.date).getTime()
    };

    const response = await invoiceService.getListPosInvoice(params);
    items.value = response?.data?.invoices || [];
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi khi lấy danh sách hóa đơn',
      detail: error?.message || '',
      life: 5000
    });
    items.value = [];
  } finally {
    loadingTable.value = false;
  }
};

const getListStoreGroupByTaxCode = async () => {
  if (taxStoreList.value && taxStoreList.value.length) return;
  isLoadingTaxStores.value = true;
  const payload = {
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid
  };
  await invoiceStore.getListStoreGroupByTaxCode(payload);
  isLoadingTaxStores.value = false;
};

const handleBack = () => {
  router.push('/e-invoice/pos-invoice');
};

const handleSave = async () => {
  if (
    !form.value.tax_code ||
    !form.value.stop_on_error ||
    !form.value.max_retries ||
    !items.value ||
    !items.value.length
  ) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng điền đầy đủ các thông tin bắt buộc',
      life: 3000
    });
    return;
  }
  loading.value = true;
  try {
    const payload = {
      tax_code: form.value.tax_code,
      list_merged_tran_id: items.value.map((e) => e.merged_tran_id),
      stop_on_error: form.value.stop_on_error,
      max_retries: form.value.max_retries
    };

    await invoiceService.createPosInvoice(payload);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Tạo máy tính tiền thành công',
      life: 3000
    });
    router.back();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Có lỗi xảy ra khi tạo máy tính tiền',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

// --- Watchers ---
// Watch cho các trường Input (cần debounce)
watch(
  () => [form.value.pattern, form.value.serial],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchInvoices();
    }, 500);
  }
);

// Watch cho các trường Select/Date (gọi ngay lập tức)
watch(
  () => [form.value.tax_code, form.value.date, form.value.number_invoice],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    fetchInvoices();
  }
);

// --- Lifecycle hooks ---
onMounted(() => {
  fetchInvoices();
  getListStoreGroupByTaxCode();
});
</script>
