<template>
  <DetailView title="Tạo loại sai sót">
    <template #header-actions>
      <Button label="Lưu lại" raised size="small" />
    </template>
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
                Mẫu số
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <InputText
                  v-model="errorType.code"
                  class="fb-w-full"
                  placeholder="Nhập mẫu số"
                  size="small"
                />
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                Loại HDDT
              </label>
              <div class="fb-w-full md:fb-w-2/3">
                <Select
                  v-model="errorType.type"
                  class="fb-w-full"
                  placeholder="Chọn loại hóa đơn"
                  size="small"
                />
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div
              class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-start fb-gap-2 md:fb-gap-4 fb-h-full"
            >
              <label
                class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700 fb-pt-2"
              >
                Lý do
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-flex-1">
                <Textarea
                  v-model="errorType.description"
                  class="fb-w-full fb-h-full"
                  rows="5"
                  placeholder="Vui lòng nhập lý do"
                  style="min-height: 110px"
                  size="small"
                  maxlength="255"
                />
                <small class="fb-text-gray-500 fb-block fb-text-left">
                  Tối đa {{ errorType.description.length }}/255 ký tự
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FbTable
        class="fb-mt-5"
        :columns="[
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
      >
        <template #header>
          <div class="fb-flex fb-gap-4">
            <Select
              v-model="errorType.type"
              class="fb-w-full md:fb-w-auto"
              placeholder="Chọn loại hóa đơn"
              size="small"
            />
            <IconField>
              <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
                <IconSearch />
              </InputIcon>
              <InputText
                :modelValue="searchValue"
                placeholder="Tìm kiếm số hóa đơn theo ký hiệu, Ví dụ: 0123, 0124"
                class="fb-w-full md:fb-w-96"
                size="small"
                @input="onInput"
              />
            </IconField>
          </div>
        </template>
      </FbTable>
    </div>
  </DetailView>
</template>

<script setup>
import { reactive } from 'vue';
import DetailView from '@/components/PageComponent/views/DetailView.vue';

const errorType = reactive({
  code: '',
  type: null,
  description: ''
});
</script>
