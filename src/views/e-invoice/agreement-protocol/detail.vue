<template>
  <DetailView title="Tạo biên bản thỏa thuận">
    <template #header-actions>
      <Button label="Lưu lại" raised size="small" />
    </template>
    <div class="fb-px-10">
      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-w-full"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-flex fb-flex-col fb-gap-4">
          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-32 fb-text-sm fb-font-medium fb-text-gray-700">
              Mẫu số
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.formTemplate"
                class="fb-w-full"
                placeholder="Nhập mẫu số"
                size="small"
              />
            </div>
          </div>

          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-32 fb-text-sm fb-font-medium fb-text-gray-700">
              Ký hiệu
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.symbol"
                class="fb-w-full"
                placeholder="Nhập ký hiệu"
                size="small"
              />
            </div>
          </div>

          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-32 fb-text-sm fb-font-medium fb-text-gray-700">
              Số hóa đơn
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.invoiceNumber"
                class="fb-w-full"
                placeholder="Nhập số hóa đơn"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DetailView>
</template>

<script setup>
import { reactive } from 'vue';
import DetailView from '@/components/PageComponent/views/DetailView.vue';

const agreement = reactive({
  formTemplate: '',
  symbol: '',
  invoiceNumber: ''
});
</script>
