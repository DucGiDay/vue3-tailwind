<template>
  <DetailView title="Cấu hình thời gian gửi" :handleBack="handleBack">
    <div class="fb-px-10">
      <div class="fb-flex fb-justify-end">
        <Button severity="secondary" raised class="fb-text-gray-700" @click="handleCreate">
          + Tạo cấu hình
        </Button>
      </div>

      <Dialog
        v-model:visible="showDialog"
        modal
        :header="isEdit ? 'Cập nhật cấu hình thời gian' : 'Tạo cấu hình thời gian'"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '95vw' }"
      >
        <div class="fb-grid fb-grid-cols-1 fb-gap-6 fb-mt-2">
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
                  disabled
                  :invalid="!!error.tax_code"
                  :loading="isLoadingTaxStores"
                  @change="onTaxCodeChange"
                />
                <Message v-if="error.tax_code" severity="error" size="small" variant="simple">
                  {{ error.tax_code }}
                </Message>
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Trạng thái
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="form.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="fb-w-full"
                  placeholder="Chọn trạng thái"
                  size="small"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-2 md:fb-gap-4">
              <label
                class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700 fb-pt-2"
              >
                Thời gian tạo hóa đơn
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-flex fb-flex-col fb-gap-3">
                <div
                  v-for="(slot, index) in form.package_time_slots"
                  :key="index"
                  class="fb-flex fb-flex-col fb-gap-1"
                >
                  <div class="fb-flex fb-items-center fb-justify-between fb-gap-2">
                    <DatePicker
                      v-model="slot.start"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:mm"
                      size="small"
                      class="fb-w-full"
                    />
                    <span>-</span>
                    <DatePicker
                      v-model="slot.end"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:mm"
                      size="small"
                      class="fb-w-full"
                    />
                    <Button
                      v-if="form.package_time_slots.length > 1"
                      severity="danger"
                      variant="text"
                      size="small"
                      @click="removePackageSlot(index)"
                    >
                      <span>
                        <IconTrash />
                      </span>
                    </Button>
                  </div>
                </div>
                <Button
                  size="small"
                  variant="text"
                  class="fb-w-fit !fb-p-0"
                  @click="addPackageSlot"
                >
                  + Thêm thời gian
                </Button>
                <Message v-if="error.createTime" severity="error" size="small" variant="simple">
                  {{ error.createTime }}
                </Message>
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-2 md:fb-gap-4">
              <label
                class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700 fb-pt-2"
              >
                Thời gian ký
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-flex fb-flex-col fb-gap-3">
                <div
                  v-for="(slot, index) in form.send_time_slots"
                  :key="index"
                  class="fb-flex fb-flex-col fb-gap-1"
                >
                  <div class="fb-flex fb-items-center fb-justify-between fb-gap-2">
                    <DatePicker
                      v-model="slot.start"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:mm"
                      size="small"
                      class="fb-w-full"
                    />
                    <span>-</span>
                    <DatePicker
                      v-model="slot.end"
                      timeOnly
                      hourFormat="24"
                      placeholder="HH:mm"
                      size="small"
                      class="fb-w-full"
                    />
                    <Button
                      v-if="form.send_time_slots.length > 1"
                      severity="danger"
                      variant="text"
                      size="small"
                      @click="removeSendSlot(index)"
                    >
                      <span>
                        <IconTrash />
                      </span>
                    </Button>
                  </div>
                </div>
                <Button size="small" variant="text" class="fb-w-fit !fb-p-0" @click="addSendSlot">
                  + Thêm thời gian
                </Button>
                <Message v-if="error.signTime" severity="error" size="small" variant="simple">
                  {{ error.signTime }}
                </Message>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <!-- <Button
            label="Test nhanh"
            severity="info"
            outlined
            size="small"
            @click="handleQuickTest"
          /> -->

          <Button label="Lưu lại" size="small" :loading="loadingSave" @click="handleSave" />
        </template>
      </Dialog>

      <FbTable
        class="fb-mt-5"
        :items="items"
        :columns="CONFIG_TIME_TABLE_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
        :loading="loadingTable"
      >
        <template #no="{ index }">
          {{ index + 1 }}
        </template>

        <template #is_enabled="{ record }">
          <span
            class="fb-px-2 fb-py-1 fb-rounded-2xl fb-text-xs"
            :class="{
              'fb-bg-success-100 fb-text-success-600': record,
              'fb-bg-gray-100 fb-text-gray-800': !record,
            }"
          >
            {{ record ? 'Đang sử dụng' : 'Chưa sử dụng' }}
          </span>
        </template>

        <template #package_time_slots="{ record }">
          <div class="fb-flex fb-flex-col fb-gap-2">
            <div v-for="item in record" :key="item">{{ item?.start }} - {{ item?.end }}</div>
          </div>
        </template>

        <template #send_time_slots="{ record }">
          <div class="fb-flex fb-flex-col fb-gap-2">
            <div v-for="item in record" :key="item">{{ item?.start }} - {{ item?.end }}</div>
          </div>
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-gap-1 fb-justify-center">
            <Button size="small" variant="text" @click="handleEdit(row)">
              <IconEdit class="fb-text-primary" color="currentColor" />
            </Button>
            <Button size="small" variant="text" severity="danger" @click="handleDelete(row)">
              <IconTrash />
            </Button>
          </div>
        </template>
      </FbTable>
    </div>
  </DetailView>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

// Components & Icons
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import IconEdit from '@/components/Common/Icon/IconEdit.vue';
import IconTrash from '@/components/Common/Icon/IconTrash.vue';

// Services & Stores
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import { useGlobalStore } from '@/stores/global.store';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { CONFIG_TIME_TABLE_COLUMNS } from '@/common/constant/e-invoice-column.constant';

// Injected Services

const statusOptions = [
  { label: 'Chưa sử dụng', value: false },
  { label: 'Đang sử dụng', value: true },
];

// Injected Services
const router = useRouter();
const toast = useToast();
const globalStore = useGlobalStore();
const invoiceStore = useEInoiveStore();

// State
const items = ref([]);
const showDialog = ref(false);
const isEdit = ref(false);
const loadingSave = ref(false);
const loadingTable = ref(false);
const isLoadingTaxStores = ref(false);
const error = ref({});

const form = ref({
  tax_code: invoiceStore.currentTaxCode || null,
  status: false,
  package_time_slots: [{ start: new Date(), end: new Date() }],
  send_time_slots: [{ start: new Date(), end: new Date() }],
});

// Computed
const taxStoreList = computed(() => invoiceStore.listTaxStores.data || []);

// Lifecycle
onMounted(() => {
  getData();
  getListStoreGroupByTaxCode();
});

// API / Data Fetching
const getData = async () => {
  loadingTable.value = true;
  try {
    const res = await invoiceService.getListPosConfigTime({
      company_uid: globalStore?.currentUser?.company_uid,
      tax_code: invoiceStore.currentTaxCode,
    });
    items.value = res?.data?.configs || [];
  } catch (error) {
    console.error('Error fetching config time:', error);
  } finally {
    loadingTable.value = false;
  }
};

const getListStoreGroupByTaxCode = async () => {
  if (taxStoreList.value && taxStoreList.value.length) return;
  isLoadingTaxStores.value = true;
  const payload = {
    company_uid: globalStore?.currentUser?.company_uid,
  };
  await invoiceStore.getListStoreGroupByTaxCode(payload);
  isLoadingTaxStores.value = false;
};

// Form Actions / CRUD
const handleCreate = () => {
  isEdit.value = false;
  form.value = {
    tax_code: invoiceStore.currentTaxCode || null,
    status: true,
    package_time_slots: [{ start: new Date(), end: new Date() }],
    send_time_slots: [{ start: new Date(), end: new Date() }],
  };
  showDialog.value = true;
};

const handleEdit = (row) => {
  isEdit.value = true;
  form.value = {
    id: row.id,
    tax_code: row.tax_code,
    status: row.is_enabled,
    package_time_slots: row.package_time_slots.map((s) => ({
      start: stringToDate(s.start),
      end: stringToDate(s.end),
    })),
    send_time_slots: row.send_time_slots.map((s) => ({
      start: stringToDate(s.start),
      end: stringToDate(s.end),
    })),
  };
  showDialog.value = true;
};

const handleSave = async () => {
  error.value = {};

  if (!form.value.tax_code) {
    error.value.tax_code = 'Vui lòng chọn mã số thuế';
  }

  const hasEmptyPackage = form.value.package_time_slots.some((s) => !s.start || !s.end);
  if (hasEmptyPackage) {
    error.value.createTime = 'Vui lòng chọn đầy đủ thời gian tạo';
  }

  const hasEmptySend = form.value.send_time_slots.some((s) => !s.start || !s.end);
  if (hasEmptySend) {
    error.value.signTime = 'Vui lòng chọn đầy đủ thời gian ký';
  }

  if (form.value.status === null) {
    toast.add({ severity: 'warn', summary: 'Vui lòng chọn trạng thái', life: 3000 });
    return;
  }

  if (Object.keys(error.value).length > 0) return;

  const payload = {
    tax_code: form.value.tax_code,
    company_uid: globalStore?.currentUser?.company_uid,
    package_time_slots: form.value.package_time_slots.map((s) => ({
      start: moment(s.start).format('HH:mm'),
      end: moment(s.end).format('HH:mm'),
    })),
    send_time_slots: form.value.send_time_slots.map((s) => ({
      start: moment(s.start).format('HH:mm'),
      end: moment(s.end).format('HH:mm'),
    })),
    is_enabled: form.value.status,
  };

  loadingSave.value = true;
  try {
    if (isEdit.value) {
      await invoiceService.updateConfigTimePos(form.value.id, payload);
    } else {
      await invoiceService.createConfigTimePos(payload);
    }
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: isEdit.value ? 'Cập nhật cấu hình thành công' : 'Tạo cấu hình thời gian thành công',
      life: 3000,
    });
    showDialog.value = false;
    getData();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: err?.message || 'Có lỗi xảy ra',
      life: 5000,
    });
  } finally {
    loadingSave.value = false;
  }
};

const handleDelete = async (row) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa cấu hình này không?')) return;

  try {
    loadingTable.value = true;
    await invoiceService.deleteConfigTimePos(row.id);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Xóa cấu hình thành công',
      life: 3000,
    });
    getData();
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: err?.message || 'Có lỗi xảy ra',
      life: 5000,
    });
  } finally {
    loadingTable.value = false;
  }
};

// Helpers
const onTaxCodeChange = () => {
  delete error.value.tax_code;
};

const handleBack = () => {
  router.push('/e-invoice/pos-invoice');
};

const stringToDate = (timeStr) => {
  if (!timeStr) return new Date();
  const [hours, minutes] = timeStr.split(':');
  const d = new Date();
  d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return d;
};

// Slot Management
const addPackageSlot = () => {
  form.value.package_time_slots.push({ start: new Date(), end: new Date() });
};

const removePackageSlot = (index) => {
  form.value.package_time_slots.splice(index, 1);
};

const addSendSlot = () => {
  form.value.send_time_slots.push({ start: new Date(), end: new Date() });
};

const removeSendSlot = (index) => {
  form.value.send_time_slots.splice(index, 1);
};

// Testing Helpers
const handleQuickTest = () => {
  if (taxStoreList.value.length > 0) {
    form.value.tax_code = taxStoreList.value[0].tax_code;
    onTaxCodeChange();
  }
  form.value.status = true;

  const now = new Date();
  const t1 = new Date(now);
  t1.setHours(9, 0, 0);
  const t2 = new Date(now);
  t2.setHours(10, 0, 0);
  const t3 = new Date(now);
  t3.setHours(11, 30, 0);
  const t4 = new Date(now);
  t4.setHours(12, 0, 0);

  form.value.package_time_slots = [
    { start: t1, end: t2 },
    { start: t3, end: t4 },
  ];

  const s1 = new Date(now);
  s1.setHours(9, 0, 0);
  const s2 = new Date(now);
  s2.setHours(9, 30, 0);
  const s3 = new Date(now);
  s3.setHours(23, 0, 0);
  const s4 = new Date(now);
  s4.setHours(23, 45, 0);

  form.value.send_time_slots = [
    { start: s1, end: s2 },
    { start: s3, end: s4 },
  ];
};
</script>
