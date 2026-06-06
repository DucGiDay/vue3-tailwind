<template>
  <DetailView title="Tạo loại sai sót" :handleBack="handleBack">
    <template #header-actions>
      <Button label="Lưu lại" raised size="small" :loading="loading" @click="handleSave" />
    </template>
    <FbLoading :show="loading" :fullScreen="true" />
    <div class="fb-px-10">
      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-6">
          <!-- Cột trái -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div
              v-if="false"
              class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4"
            >
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Loại sai sót
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-min-w-0">
                <Select
                  v-model="notiError.type_error"
                  :options="errorTypeList"
                  optionLabel="name"
                  optionValue="type_error"
                  class="fb-w-full"
                  :invalid="!!error['type_error']"
                  placeholder="Chọn loại sai sót"
                  size="small"
                  :loading="isLoadingErrorType"
                  @change="
                    delete error['type_error'];
                    onFormChange();
                  "
                />
                <Message v-if="error['type_error']" severity="error" size="small" variant="simple">
                  {{ error['type_error'] }}
                </Message>
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Mẫu số
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="filterField.pattern"
                  :options="[
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '5', value: '5' },
                  ]"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  :invalid="!!error['pattern']"
                  placeholder="Chọn mẫu hóa đơn"
                  size="small"
                  @change="
                    delete error['pattern'];
                    onFormChange();
                  "
                />
                <Message v-if="error['pattern']" severity="error" size="small" variant="simple">
                  {{ error['pattern'] }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div
              v-if="false"
              class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4"
            >
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Loại HDDT
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-min-w-0">
                <Select
                  v-model="notiError.type_invoice"
                  :options="invoiceTypeList"
                  optionLabel="name"
                  optionValue="type_invoice"
                  class="fb-w-full"
                  :invalid="!!error['type_invoice']"
                  placeholder="Chọn loại hóa đơn"
                  size="small"
                  :loading="isLoadingInvoiceType"
                  @change="
                    delete error['type_invoice'];
                    onFormChange();
                  "
                />
                <Message
                  v-if="error['type_invoice']"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ error['type_invoice'] }}
                </Message>
              </div>
            </div>
            <div
              class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-start fb-gap-2 md:fb-gap-4 fb-h-full"
            >
              <label
                class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700 fb-pt-2"
              >
                Nội dung thông báo sai sót
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Textarea
                  v-model="notiError.reason"
                  class="fb-w-full"
                  :invalid="!!error['reason']"
                  rows="4"
                  placeholder="Vui lòng nhập nội dung"
                  style="min-height: 5rem"
                  size="small"
                  maxlength="255"
                  @input="
                    delete error['reason'];
                    onFormChange();
                  "
                />
                <Message v-if="error['reason']" severity="error" size="small" variant="simple">
                  {{ error['reason'] }}
                </Message>
                <small class="fb-text-gray-500 fb-block fb-text-left">
                  Tối đa {{ notiError.reason?.length || 0 }}/255 ký tự
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FbTable
        class="fb-mt-5"
        :items="items"
        :columns="[
          {
            field: 'no',
            header: 'STT',
          },
          {
            field: 'vat_invoice_series',
            header: 'Ký hiệu số',
          },
          {
            field: 'created_at',
            header: 'Ngày lập',
            format: 'date',
          },
          {
            field: 'vat_invoice_code',
            header: 'Mã CQT',
          },
        ]"
        :showGridlines="true"
        :hideIndexRow="true"
        :loading="loadingTable"
      >
        <template #header>
          <div class="fb-flex fb-gap-4">
            <!-- <InputText
              v-model="filterField.pattern"
              class="fb-w-full md:fb-w-auto"
              placeholder="Nhập ký hiệu"
              size="small"
              showClear
              @input="onFormChange"
            /> -->
            <InputText
              v-model="filterField.serial"
              class="fb-w-full md:fb-w-auto"
              placeholder="Nhập ký hiệu"
              size="small"
              showClear
              @input="onFormChange"
            />

            <IconField>
              <InputIcon
                class="!fb-mt-0 !-fb-translate-y-1/2 fb-cursor-pointer hover:fb-scale-125 fb-transition-all"
                @click="filter"
              >
                <IconSearch />
              </InputIcon>
              <InputText
                v-model="filterField.searchValue"
                placeholder="Tìm kiếm số hóa đơn theo ký hiệu, Ví dụ: 0123, 0124"
                class="fb-w-full md:fb-w-96"
                size="small"
                @input="onFormChange"
              />
            </IconField>
          </div>
        </template>

        <template #vat_invoice_series="{ row }">
          <div>Bộ ký hiệu: {{ row?.vat_invoice_series }}</div>
          <div>Số: {{ row?.vat_invoice_number }}</div>
        </template>

        <template #no="{ index }">
          {{ index + 1 }}
        </template>
      </FbTable>
    </div>
  </DetailView>
  <Dialog
    v-model:visible="showResponseDialog"
    header="Thông báo"
    modal
    :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
  >
    <div class="fb-flex fb-flex-col fb-gap-5">
      <!-- Tóm tắt số lượng -->
      <!-- <div class="fb-grid fb-grid-cols-2 fb-gap-3">
        <div
          class="fb-flex fb-flex-col fb-items-center fb-bg-success-50 fb-border fb-border-success-100 fb-p-3 fb-rounded-xl"
        >
          <span class="fb-text-success-600 fb-text-2xl fb-font-bold">
            {{ responseCreate.success?.length || 0 }}
          </span>
          <span class="fb-text-success-700 fb-text-xs fb-font-medium">Thành công</span>
        </div>
        <div
          class="fb-flex fb-flex-col fb-items-center fb-bg-error-50 fb-border fb-border-error-100 fb-p-3 fb-rounded-xl"
        >
          <span class="fb-text-error-600 fb-text-2xl fb-font-bold">
            {{ responseCreate.failed?.length || 0 }}
          </span>
          <span class="fb-text-error-700 fb-text-xs fb-font-medium">Thất bại</span>
        </div>
      </div> -->

      <!-- Chi tiết thành công -->
      <!-- <div v-if="responseCreate.success?.length" class="fb-flex fb-flex-col fb-gap-2">
        <div class="fb-flex fb-items-center fb-gap-2 fb-text-green-700 fb-font-semibold fb-text-sm">
          <i class="fal fa-check-circle"></i>
          <span>Danh sách thành công</span>
        </div>
        <div
          class="fb-max-h-40 fb-overflow-y-auto fb-bg-gray-50 fb-border fb-border-gray-200 fb-rounded-lg fb-p-3"
        >
          <div
            v-for="item in responseCreate.success"
            :key="item.merged_tran_id"
            class="fb-text-[0.8125rem] fb-mb-2 last:fb-mb-0 fb-text-gray-600 fb-flex fb-gap-2"
          >
            <span class="fb-font-semibold fb-text-green-600">{{ item.merged_tran_id }}</span>
            <span class="fb-text-gray-400">|</span>
            <span>{{ item.error || 'Xử lý thành công' }}</span>
          </div>
        </div>
      </div> -->

      <!-- Chi tiết thất bại -->
      <div v-if="responseCreate.failed?.length" class="fb-flex fb-flex-col fb-gap-2">
        <div class="fb-flex fb-items-center fb-gap-2 fb-text-error-700 fb-font-semibold fb-text-sm">
          <i class="fal fa-exclamation-circle"></i>
          <!-- <span>Danh sách thất bại</span> -->
          <span>Có lỗi xảy ra vui lòng kiểm tra lại</span>
        </div>
        <div
          class="fb-max-h-40 fb-overflow-y-auto fb-bg-gray-50 fb-border fb-border-gray-200 fb-rounded-lg fb-p-3"
        >
          <div
            v-for="item in responseCreate.failed"
            :key="item.merged_tran_id"
            class="fb-text-[0.8125rem] fb-mb-2 last:fb-mb-0 fb-text-gray-600 fb-flex fb-gap-2"
          >
            <span class="fb-font-semibold fb-text-green-600">{{ item.merged_tran_id }}</span>
            <span class="fb-text-gray-400">|</span>
            <span>{{ item.error || 'Xử lý thành công' }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="fb-flex fb-justify-end fb-gap-2 fb-w-full">
        <Button
          label="Đóng"
          @click="showResponseDialog = false"
          variant="text"
          raised
          severity="secondary"
          size="small"
        />
        <!-- <Button
          label="Về trang danh sách"
          @click="router.back()"
          raised
          severity="primary"
          size="small"
        /> -->
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useGlobalStore } from '@/stores/global.store';
import { validateByFields } from '@/common/utils/validate';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';

const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const isLoadingInvoiceType = ref(false);
const isLoadingErrorType = ref(false);
const loading = ref(false);
const loadingTable = ref(false);
const error = ref({});

const notiError = ref({
  reason: '',
  type_error: 4,
  type_invoice: 1,
});
const filterField = ref({
  pattern: '',
  serial: '',
  searchValue: '',
});
const items = ref([]);
const invoiceTypeList = computed(() => invoiceStore.invoiceTypeList || []);
const errorTypeList = computed(() => invoiceStore.errorTypeList || []);
const listMergedTranIds = computed(() => (items.value || []).map((item) => item.merged_tran_id));
const showResponseDialog = ref(false);
const responseCreate = ref({
  success: [],
  failed: [],
});

const handleBack = () => {
  router.push({ path: '/e-invoice/noti-error' });
};

const getInvoiceType = async () => {
  if (invoiceTypeList.value && invoiceTypeList.value.length) return;
  isLoadingInvoiceType.value = true;

  await invoiceStore.getInvoiceType();
  isLoadingInvoiceType.value = false;
};

const getErrorType = async () => {
  if (errorTypeList.value && errorTypeList.value.length) return;
  isLoadingErrorType.value = true;

  await invoiceStore.getErrorType();
  isLoadingErrorType.value = false;
};

const getData = async () => {
  await Promise.all([getInvoiceType(), getErrorType()]);
};

const handleSave = async () => {
  error.value = validateByFields(notiError.value, [
    {
      id: 'type_error',
      rules: ['required'],
    },
    {
      id: 'reason',
      rules: ['required'],
    },
    {
      id: 'type_invoice',
      rules: ['required'],
    },
  ]);

  Object.assign(
    error.value,
    validateByFields(filterField.value, [
      {
        id: 'pattern',
        rules: ['required'],
      },
    ]),
  );

  if (Object.keys(error.value).length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng kiểm tra lại các trường thông tin',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  const payload = {
    ...notiError.value,
    list_merged_tran_id: listMergedTranIds.value,
  };
  try {
    const res = await invoiceService.createNotiError(payload);
    responseCreate.value = res.data;
    if ((res?.data?.failed || []).length > 0) {
      showResponseDialog.value = true;
    } else {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Tạo thông báo sai sót thành công',
        life: 3000,
      });
      router.back();
    }
  } catch (err) {
    console.error('Error:', err?.message);
    toast.add({
      severity: 'error',
      summary: 'Lỗi hệ thống',
      detail: err?.message || 'Không thể kết nối đến máy chủ',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

let searchTimeout = null;
const onFormChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await filter();
  }, 800);
};

const filter = async () => {
  if (!filterField.value.searchValue) return;

  loadingTable.value = true;
  try {
    const payload = {
      list_invoice_number: filterField.value.searchValue,
      brand_uid: globalStore?.brandUid,
      company_uid: globalStore?.currentUser?.company_uid,
      pattern: filterField.value.pattern,
      serial: filterField.value.serial,
    };
    const res = await invoiceService.filterInvoiceByNumbers(payload);
    if (res?.data) {
      items.value = res.data || [];
    } else {
      console.error('Error:', res?.message);
    }
  } catch (err) {
    console.error('Error:', err?.message);
    toast.add({
      severity: 'error',
      summary: 'Lỗi hệ thống',
      detail: err?.message || 'Không thể kết nối đến máy chủ',
      life: 3000,
    });
  } finally {
    loadingTable.value = false;
  }
};

onMounted(() => {
  if (route?.query?.inv_series) {
    filterField.value.serial = route.query.inv_series;
  }
  if (route?.query?.vat_invoice_number) {
    filterField.value.searchValue = route.query.vat_invoice_number;
  }
  filter();
  getData();
  router.replace({ query: null });
});
</script>
