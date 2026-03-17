<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Thanh toán đơn hàng"
    :style="{ width: '75vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '90vw' }"
    v-bind="$attrs"
    @hide="onHideDialog"
  >
    <div v-if="isLoading" class="fb-flex fb-justify-center">
      <ProgressSpinner class="fb-stroke-primary" />
    </div>
    <PayingComponent v-else :item="item" :qrCode="qrCode" />
    <template #footer>
      <Button
        type="button"
        label="Đóng lại"
        raised
        severity="secondary"
        @click="visible = false"
      ></Button>
    </template>
  </Dialog>
</template>
<script setup>
import PayingComponent from '@/components/PageComponent/extend-license/PayingComponent.vue';
import { useExtendLicenseStore } from '@/stores/extend-license.store';
import { setCookie, getCookie } from '@/common/ulties';

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['success', 'hide']);
const visible = defineModel('visible', { default: false });

// Stores
const extendLicenseStore = useExtendLicenseStore();

// States
const isLoading = ref(false);
const qrCode = ref({});

// Watchers
watch(
  () => visible,
  async (newVal) => {
    if (newVal) {
      await getQRCode();
    }
  },
  { deep: true }
);

// Methods
const getQRCode = async () => {
  // 1. Kiểm tra cookie trước (key là roCode)
  const cachedQRCode = getCookie(props.item?.roCode);
  if (cachedQRCode) {
    qrCode.value = { data: { qrCodeUrl: cachedQRCode } };
    return;
  }
  const payload = {
    companyId: props.item?.companyId,
    amount: props.item?.amount || 0,
    tranId: props.item?.roCode,
    paymentMethod: 'MOMO_QR',
    returnUrl: 'https://fabidev.ipos.vn/shop/extend-license-status'
  };
  isLoading.value = true;
  const response = await extendLicenseStore.getQRPayment(payload);
  qrCode.value = response;

  // Nếu thành công thì lưu vào cookie (100 phút = 1 giờ 40 phút)
  if (!response.error && response.data?.qrCodeUrl) {
    setCookie(props.item?.roCode, response.data.qrCodeUrl, 100);
  }
  
  isLoading.value = false;
};

const onHideDialog = () => {
  emit('hide');
};
</script>
