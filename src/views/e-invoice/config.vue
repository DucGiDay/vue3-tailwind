<script setup>
// State
const radioValue = ref(null);
</script>

<template>
  <div :class="['fb-flex fb-justify-between fb-items-center fb-mb-8']">
    <div class="fb-flex fb-items-center fb-space-x-3">
      <h4 class="!fb-m-0">Cấu hình</h4>
    </div>
    <Button>lưu lại</Button>
  </div>

  <Fluid>
    <FbCard class="fb-space-y-6 !fb-py-6 !fb-px-5">
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="name3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Tên cửa hàng
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="name3" type="text" />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Email
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="email3" type="text" />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Tài khoản
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="email3" type="text" />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Mã số thuế
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="email3" type="text" />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Ký hiệu
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="email3" type="text" />
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Mẫu hóa đơn
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
            <div class="fb-flex fb-items-center">
              <RadioButton id="option1" name="option" value="1" v-model="radioValue" />
              <label for="option1" class="fb-leading-none fb-ml-2">Version 1</label>
            </div>
            <div class="fb-flex fb-items-center">
              <RadioButton id="option2" name="option" value="2" v-model="radioValue" />
              <label for="option2" class="fb-leading-none fb-ml-2">Version 2</label>
            </div>
          </div>
        </div>
      </div>
      <div class="fb-grid fb-grid-cols-12 fb-gap-1">
        <label for="email3" class="fb-flex fb-items-center fb-col-span-12 md:fb-col-span-3">
          Phiên bản
        </label>
        <div class="fb-col-span-12 md:fb-col-span-9">
          <InputText id="email3" type="text" />
        </div>
      </div>
    </FbCard>
  </Fluid>
</template>
