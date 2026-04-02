<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Chi tiết hóa đơn"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="fb-col-span-12 fb-mb-4 fb-text-sm fb-font-semibold">Thông tin người mua</div>
    <Fluid class="fb-grid fb-grid-cols-12 fb-gap-5 fb-font-medium">
      <div class="fb-col-span-4 fb-text-muted-color">Mã hóa đơn</div>
      <div class="fb-col-span-8">{{ item.roCode }}</div>
      <div class="fb-col-span-4 fb-text-muted-color">Người nhận</div>
      <div class="fb-col-span-8">{{ item.contactName }}</div>
      <div class="fb-col-span-4 fb-text-muted-color">Số điện thoại</div>
      <div class="fb-col-span-8">{{ item.contactPhone }}</div>
      <div class="fb-col-span-4 fb-text-muted-color">Email</div>
      <div class="fb-col-span-8">{{ item.companyTaxEmail }}</div>
      <div class="fb-col-span-4 fb-text-muted-color">Trạng thái</div>
      <div class="fb-col-span-8">{{ item.status }}</div>
    </Fluid>
    <Divider class="!fb-my-8" />
    <div class="fb-col-span-12 fb-mb-4 fb-text-sm fb-font-semibold">Thông tin dịch vụ</div>
    <Fluid class="fb-grid fb-grid-cols-12 fb-gap-5 fb-font-medium">
      <div class="fb-col-span-4 fb-text-muted-color">{{ getServiceName(item) }}</div>
      <div class="fb-col-span-8">{{ formatCurrency(item.amount) }}</div>
      <div class="fb-col-span-4 fb-text-muted-color">Giảm giá</div>
      <div class="fb-col-span-8">{{ formatCurrency(item.discountAmount) }}</div>
      <div class="fb-col-span-4 fb-text-base fb-font-semibold">Tổng tiền</div>
      <div class="fb-col-span-8 fb-text-base fb-font-semibold">
        {{ formatCurrency(item.remainAmount) }}
      </div>
    </Fluid>

    <template #footer>
      <div class="fb-flex fb-justify-between fb-gap-2 fb-flex-grow">
        <Button type="button" variant="text" severity="danger" @click="onDeleteItem" size="small">
          <IconTrash />
          Hủy đơn
        </Button>
        <div class="fb-flex fb-justify-end fb-gap-2">
          <Button
            type="button"
            label="Đóng lại"
            raised
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button type="button" label="Thanh toán lại" raised @click="onRePaid"></Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { formatCurrency } from '@/common/ulties';

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['delete-item', 'repaid-item']);
const visible = defineModel('visible', { default: false });

// Methods
const getServiceName = (item) => {
  return (item?.details || []).find((e) => e.serviceType === 'combo')?.serviceName;
};
const onDeleteItem = () => {
  emit('delete-item', props.item);
  closeModal();
};
const onRePaid = () => {
  emit('repaid-item', props.item);
  closeModal();
};

const closeModal = () => {
  visible.value = false;
};
</script>
