<template>
  <FbTableView :columns="tableColumns" :show-export="false">
    <template #filter>
      <IconField>
        <InputIcon class="!fb-mt-0 !-fb-translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="fb-h-[14px]"
          >
            <path
              d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
              stroke="#A4A7AE"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </InputIcon>
        <InputText v-model="value1" placeholder="Tìm kiếm mã hóa đơn" size="small" />
      </IconField>

      <Select
        v-model="selectedCity"
        :options="cities"
        optionLabel="name"
        placeholder="Select a City"
        class="w-full md:w-56"
        size="small"
      />
    </template>
    <template #guide-text>
      <div></div>
    </template>
  </FbTableView>
</template>

<script setup>
import InputIcon from 'primevue/inputicon';

const tableColumns = [
  { field: 'tran_id', header: 'Mã hóa đơn' },
  { field: 'customer', header: 'Người liên hệ' },
  { field: 'phone_number', header: 'Số điện thoại' },
  { field: 'email', header: 'Email' },
  { field: 'total', header: 'Tổng tiền' },
  { field: 'status', header: 'Trạng thái' }
];

const value1 = ref('');

const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
</script>
