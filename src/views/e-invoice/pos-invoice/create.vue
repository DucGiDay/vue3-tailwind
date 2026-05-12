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
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.templateNumber"
                  :options="templateOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn mẫu số"
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
                  v-model="form.configOption"
                  :options="configOptions"
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
                  v-model="form.quantityPackage"
                  :options="quantityOptions"
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
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.symbol"
                  :options="symbolOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn ký hiệu"
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
                  v-model="form.retryCount"
                  :options="retryOptions"
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
        :columns="TABLE_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
        :loading="loadingTable"
      >
        <template #header>
          <div class="fb-flex fb-gap-4">
            <IconField>
              <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2 fb-cursor-pointer">
                <IconSearch />
              </InputIcon>
              <InputText
                v-model="searchValue"
                placeholder="Tìm kiếm hóa đơn"
                class="fb-w-full md:fb-w-96"
                size="small"
              />
            </IconField>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const loadingTable = ref(false);

const form = ref({
  date: null,
  templateNumber: null,
  configOption: null,
  quantityPackage: null,
  symbol: null,
  retryCount: null
});

const symbolOptions = [
  { label: 'K126T', value: 'K126T' },
  { label: 'K226T', value: 'K226T' }
];
const templateOptions = [
  { label: 'Mẫu 01', value: '01' },
  { label: 'Mẫu 02', value: '02' }
];
const configOptions = [{ label: 'Cấu hình mặc định', value: 'default' }];
const quantityOptions = [
  { label: '1000 Hóa đơn', value: '1000' },
  { label: '5000 Hóa đơn', value: '5000' }
];
const retryOptions = [
  { label: '1 lần', value: '1' },
  { label: '2 lần', value: '2' },
  { label: '3 lần', value: '3' }
];

const searchValue = ref('');

const TABLE_COLUMNS = [
  { field: 'no', header: 'STT' },
  { field: 'invoice_info', header: 'Thông tin hóa đơn' },
  { field: 'customer_name', header: 'Tên KH' },
  { field: 'customer_tax_code', header: 'MST KH' },
  { field: 'total_amount', header: 'Tiền TT' },
  { field: 'tax_amount', header: 'Tiền thuế' },
  { field: 'sub_total', header: 'Tiền ST' }
];

const items = ref([
  {
    invoice_info: 'HD-001',
    customer_name: 'Khách hàng A',
    customer_tax_code: '0123456789',
    total_amount: '1,000,000',
    tax_amount: '80,000',
    sub_total: '920,000'
  }
]);

const handleBack = () => {
  router.push('/e-invoice/pos-invoice');
};

const handleSave = async () => {
  if (
    !form.value.symbol ||
    !form.value.date ||
    !form.value.templateNumber ||
    !form.value.configOption ||
    !form.value.quantityPackage ||
    !form.value.retryCount
  ) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng điền đầy đủ các thông tin bắt buộc',
      life: 3000
    });
    return;
  }
  loading.value = true;
  await invoiceService.createPosInvoice(form.value);
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Tạo máy tính tiền thành công',
    life: 3000
  });
  loading.value = false;
  router.back();
};
</script>
