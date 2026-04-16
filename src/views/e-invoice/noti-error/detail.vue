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
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
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
                Mã đơn gộp
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <InputText
                  v-model="notiError.merged_tran_id"
                  class="fb-w-full"
                  :invalid="!!error['merged_tran_id']"
                  placeholder="Nhập mã đơn gộp"
                  size="small"
                  @input="
                    delete error['merged_tran_id'];
                    onFormChange();
                  "
                />
                <Message
                  v-if="error['merged_tran_id']"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ error['merged_tran_id'] }}
                </Message>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
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
                Lý do
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Textarea
                  v-model="notiError.reason"
                  class="fb-w-full"
                  :invalid="!!error['reason']"
                  rows="4"
                  placeholder="Vui lòng nhập lý do"
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
            header: 'STT'
          },
          {
            field: 'code',
            header: 'Ký hiệu số'
          },
          {
            field: 'type',
            header: 'Ngày lập'
          },
          {
            field: 'description',
            header: 'Lý do'
          }
        ]"
        :showGridlines="true"
        :hideIndexRow="true"
        :loading="loadingTable"
      >
        <template #header>
          <div class="fb-flex fb-gap-4">
            <InputText
              v-model="filterField.serial"
              class="fb-w-full md:fb-w-auto"
              placeholder="Nhập ký hiệu"
              size="small"
              showClear
              @input="onFormChange"
            />

            <IconField>
              <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
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
      </FbTable>
    </div>
  </DetailView>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DetailView from '@/components/PageComponent/views/DetailView.vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useGlobalStore } from '@/stores/global.store';
import { validateByFields } from '@/common/utils/validate';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();
const router = useRouter();
const toast = useToast();

const isLoadingInvoiceType = ref(false);
const isLoadingErrorType = ref(false);
const loading = ref(false);
const loadingTable = ref(false);
const error = ref({});

const notiError = ref({
  merged_tran_id: '',
  reason: '',
  type_error: null,
  type_invoice: null
});
const filterField = ref({
  pattern: '',
  serial: '',
  searchValue: ''
});
const items = ref([]);
const invoiceTypeList = computed(() => invoiceStore.invoiceTypeList || []);
const errorTypeList = computed(() => invoiceStore.errorTypeList) || [];

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
      rules: ['required']
    },
    {
      id: 'merged_tran_id',
      rules: ['required']
    },
    {
      id: 'reason',
      rules: ['required']
    },
    {
      id: 'type_invoice',
      rules: ['required']
    }
  ]);

  if (Object.keys(error.value).length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng kiểm tra lại các trường thông tin',
      life: 3000
    });
    return;
  }

  loading.value = true;
  await invoiceService
    .createNotiError(notiError.value)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Tạo thông báo sai sót thành công',
        life: 3000
      });
      router.back();
    })
    .catch((err) => {
      console.error('Error:', err?.message);
      toast.add({
        severity: 'error',
        summary: 'Lỗi hệ thống',
        detail: err?.message || 'Không thể kết nối đến máy chủ',
        life: 3000
      });
    })
    .finally(() => {
      loading.value = false;
    });
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
      serial: filterField.value.serial
    };
    const res = await invoiceService.filterInvoiceByNumbers(payload);
    console.log(res);

    if (res.data?.success) {
      items.value = res.data || [];
    } else {
      console.error('Error:', res?.message);
      // toast.add({
      //   severity: 'error',
      //   summary: 'Lỗi',
      //   detail: res.data?.message || 'Có lỗi xảy ra khi lọc hóa đơn',
      //   life: 3000
      // });
    }
  } catch (err) {
    console.error('Error:', err?.message);
    toast.add({
      severity: 'error',
      summary: 'Lỗi hệ thống',
      detail: err?.message || 'Không thể kết nối đến máy chủ',
      life: 3000
    });
  } finally {
    loadingTable.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>
