<template>
  <DetailView title="Cấu hình thời gian gửi" :handleBack="handleBack">
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
                Trạng thái <span class="fb-text-error">*</span>
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
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Thời gian tạo hóa đơn
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-flex fb-items-center fb-gap-2">
                <InputText
                  type="time"
                  step="1"
                  v-model="form.createTimeFrom"
                  class="fb-w-full"
                  size="small"
                />
                <span>-</span>
                <InputText
                  type="time"
                  step="1"
                  v-model="form.createTimeTo"
                  class="fb-w-full"
                  size="small"
                />
              </div>
            </div>
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Thời gian ký
              </label>
              <div class="fb-w-full md:fb-w-2/3 fb-flex fb-items-center fb-gap-2">
                <InputText
                  type="time"
                  step="1"
                  v-model="form.signTimeFrom"
                  class="fb-w-full"
                  size="small"
                />
                <span>-</span>
                <InputText
                  type="time"
                  step="1"
                  v-model="form.signTimeTo"
                  class="fb-w-full"
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
                placeholder="Tìm kiếm thời gian tạo"
                class="fb-w-full md:fb-w-96"
                size="small"
              />
            </IconField>
          </div>
        </template>
        
        <template #no="{ index }">
          {{ index + 1 }}
        </template>
        
        <template #status="{ record }">
          <span
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
            :class="{
              'fb-bg-green-100 fb-text-green-800': record.status === 'active',
              'fb-bg-gray-100 fb-text-gray-800': record.status === 'inactive'
            }"
          >
            {{ record.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
          </span>
        </template>

        <template #action="{ row }">
          <div class="fb-flex fb-gap-2 fb-justify-center">
            <Button size="small" variant="text">
              <i class="pi pi-pencil !fb-text-primary"></i>
            </Button>
            <Button size="small" variant="text" severity="danger">
              <i class="pi pi-trash !fb-text-error"></i>
            </Button>
          </div>
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
  status: null,
  createTimeFrom: null,
  createTimeTo: null,
  signTimeFrom: null,
  signTimeTo: null
});

const statusOptions = [
  { label: 'Chưa sử dụng', value: 'inactive' },
  { label: 'Đang sử dụng', value: 'active' }
];

const searchValue = ref('');

const TABLE_COLUMNS = [
  { field: 'no', header: 'STT' },
  { field: 'create_time', header: 'Thời gian tạo' },
  { field: 'sign_time', header: 'Thời gian ký' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'action', header: 'Thao tác' }
];

const items = ref([
  {
    create_time: '08:00',
    sign_time: '18:00',
    status: 'active'
  }
]);

const handleBack = () => {
  router.push('/e-invoice/pos-invoice');
};

const handleSave = async () => {
  if (!form.value.status) {
    toast.add({ severity: 'warn', summary: 'Vui lòng chọn trạng thái', life: 3000 });
    return;
  }
  loading.value = true;
  await invoiceService.updatePosConfigTime(form.value);
  toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật cấu hình thời gian thành công', life: 3000 });
  loading.value = false;
  router.back();
};
</script>
