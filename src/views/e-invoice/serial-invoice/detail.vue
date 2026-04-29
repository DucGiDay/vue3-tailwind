<template>
  <DetailView title="Thêm ký hiệu hóa đơn" :handleBack="handleBack">
    <template #header-actions>
      <Button label="Lưu lại" :loading="loading" raised size="small" @click="handleSave" />
    </template>
    <FbLoading :show="loading" :fullScreen="true" />
    <div class="md:fb-px-10">
      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-w-full"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-flex fb-flex-col fb-gap-6">
          <!-- Mã số thuế -->
          <div class="fb-flex fb-flex-col fb-gap-2">
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">
              Mã số thuế
              <span class="fb-text-error">*</span>
            </label>
            <Select
              v-model="form.tax_code"
              :options="taxStoreList"
              optionLabel="tax_code"
              optionValue="tax_code"
              placeholder="Chọn mã số thuế"
              size="small"
              class="fb-w-full"
              :invalid="!!error.tax_code"
              :loading="isLoadingTaxStores"
              @change="onTaxCodeChange"
            />
            <Message v-if="error.tax_code" severity="error" size="small" variant="simple">
              {{ error.tax_code }}
            </Message>
          </div>

          <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-6">
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">
                Mẫu hóa đơn
                <span class="fb-text-error">*</span>
              </label>
              <Select
                v-model="form.template_obj"
                :options="serialInvoiceTemplate"
                optionLabel="Name"
                placeholder="Chọn mẫu hóa đơn"
                size="small"
                class="fb-w-full"
                :invalid="!!error.template_obj"
                :disabled="!serialInvoiceTemplate?.length"
                :loading="isLoadingTemplate"
                @change="onTemplateChange"
              />
              <Message v-if="error.template_obj" severity="error" size="small" variant="simple">
                {{ error.template_obj }}
              </Message>
            </div>

            <!-- Ký hiệu hóa đơn -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">
                Ký hiệu hóa đơn
                <span class="fb-text-error">*</span>
              </label>
              <InputText
                v-model="form.serial"
                placeholder="Nhập ký hiệu"
                size="small"
                class="fb-w-full"
                :invalid="!!error.serial"
                @input="delete error.serial"
              />
              <Message v-if="error.serial" severity="error" size="small" variant="simple">
                {{ error.serial }}
              </Message>
            </div>

            <!-- Mẫu số -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">
                Mẫu số
                <span class="fb-text-error">*</span>
              </label>
              <InputText
                v-model="form.pattern"
                placeholder="Nhập mẫu số"
                size="small"
                class="fb-w-full"
                :invalid="!!error.pattern"
                @input="delete error.pattern"
              />
              <Message v-if="error.pattern" severity="error" size="small" variant="simple">
                {{ error.pattern }}
              </Message>
            </div>

            <!-- Dải số MTT -->
            <div class="fb-flex fb-flex-col fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">Dải số MTT</label>
              <InputNumber
                v-model="form.start_no"
                placeholder="Nhập dải số MTT"
                size="small"
                class="fb-w-full"
                :useGrouping="false"
              />
            </div>
          </div>

          <!-- Ghi chú -->
          <div class="fb-flex fb-flex-col fb-gap-2">
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">
              Ghi chú
              <span class="fb-text-error">*</span>
            </label>
            <Textarea
              v-model="form.note"
              rows="3"
              placeholder="Nhập ghi chú"
              class="fb-w-full"
              :invalid="!!error.note"
              @input="delete error.note"
            />
            <Message v-if="error.note" severity="error" size="small" variant="simple">
              {{ error.note }}
            </Message>
          </div>
        </div>
      </div>
    </div>
  </DetailView>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { validateByFields } from '@/common/utils/validate';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import FbLoading from '@/components/Common/FbLoading.vue';

const router = useRouter();
const toast = useToast();
const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();

const loading = ref(false);
const isLoadingTaxStores = ref(false);
const isLoadingTemplate = ref(false);
const error = ref({});

const form = reactive({
  tax_code: '',
  pattern: '', // mẫu số
  template_obj: null, // đối tượng mẫu hóa đơn được chọn từ list
  serial: '', // ký hiệu
  start_no: null, // dải hóa đơn
  note: '',
  register_id: '',
  register_name: '',
  is_pos: true
});

const taxStoreList = computed(() => invoiceStore.listTaxStores.data || []);
const serialInvoiceTemplate = computed(() => invoiceStore.serialInvoiceTemplate || []);

const onTaxCodeChange = async () => {
  delete error.value.tax_code;
  form.template_obj = null;
  form.register_id = '';
  form.register_name = '';

  if (!form.tax_code) return;

  try {
    isLoadingTemplate.value = true;
    await invoiceStore.getSerialInvoiceTemplate({
      tax_code: form.tax_code
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: err?.message || '',
      life: 3000
    });
  } finally {
    isLoadingTemplate.value = false;
  }
};

const onTemplateChange = () => {
  delete error.value.template_obj;
  if (form.template_obj) {
    form.register_id = form.template_obj.Value ? String(form.template_obj.Value) : '';
    form.register_name = form.template_obj.Name || '';
  } else {
    form.register_id = '';
    form.register_name = '';
  }
};

const handleSave = async () => {
  error.value = validateByFields(form, [
    { id: 'tax_code', rules: ['required'] },
    { id: 'template_obj', rules: ['required'], message: 'Vui lòng chọn template' },
    { id: 'pattern', rules: ['required'] },
    { id: 'serial', rules: ['required'] },
    { id: 'note', rules: ['required'] }
  ]);

  if (Object.keys(error.value).length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng kiểm tra lại các trường thông tin',
      life: 3000
    });
    return;
  }

  const payload = {
    tax_code: form.tax_code,
    pattern: form.pattern,
    serial: form.serial,
    start_no: form.start_no || 0,
    note: form.note,
    register_id: form.register_id,
    register_name: form.register_name,
    is_pos: form.is_pos,
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid
  };

  loading.value = true;
  try {
    await invoiceService.createSerialInvoice(payload);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Thêm ký hiệu hóa đơn thành công',
      life: 3000
    });
    router.back();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: err?.message || ''
    });
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  router.push({ path: '/e-invoice/serial-invoice' });
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

onMounted(async () => {
  getListStoreGroupByTaxCode();
});
</script>
