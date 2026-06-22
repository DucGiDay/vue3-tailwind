<template>
  <Dialog
    v-model:visible="visible"
    modal
    maximizable
    header="Thanh toán đơn hàng"
    :style="{ width: '85vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '90vw' }"
    @hide="onHideDialog"
  >
    <div v-if="isLoading" class="fb-flex fb-justify-center fb-items-center fb-min-h-52">
      <ProgressSpinner class="fb-stroke-primary" />
    </div>
    <PayingComponent v-else :item="item" :qrCode="qrCode" />

    <!-- <template #footer>
      <Button
        type="button"
        label="Đóng lại"
        raised
        severity="secondary"
        @click="visible = false"
      ></Button>
    </template> -->
  </Dialog>
</template>
<script setup>
import PayingComponent from '@/components/PageComponent/extend-license/PayingComponent.vue';
import { useExtendLicenseStore } from '@/stores/extend-license.store';
import { setCookie, getCookie } from '@/common/utils/common';

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['success', 'hide']);
const visible = defineModel('visible', { default: false });

// Stores
const extendLicenseStore = useExtendLicenseStore();

// States
const isLoading = ref(false);
const qrCode = ref({});

// Watchers
watch(visible, async (newVal) => {
  if (newVal) await getQRCode();
});

const QR_TTL_MINUTES = 15; // 15 phút
// Methods
const getQRCode = async () => {
  // 1. Kiểm tra cookie trước (key là roCode)
  const cached = getCookie(props.item?.roCode);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      qrCode.value = { data: { qrCodeUrl: parsed.qrCodeUrl, createdAt: parsed.createdAt } };
    } catch {
      // fallback nếu cookie cũ chỉ lưu plain string
      qrCode.value = { data: { qrCodeUrl: cached } };
    }
    return;
  }
  const payload = {
    companyId: props.item?.companyId,
    amount: props.item?.amount || 0,
    tranId: props.item?.roCode,
    paymentMethod: 'MOMO_QR',
    orderExpireTime: 15,
    returnUrl: 'https://fabidev.ipos.vn/shop/extend-license-status',
  };
  isLoading.value = true;
  const response = await extendLicenseStore.getQRPayment(payload);
  qrCode.value = response;

  // Nếu thành công thì lưu vào cookie kèm thời điểm bắt đầu
  if (!response.error && response.data?.qrCodeUrl) {
    const payload = JSON.stringify({
      qrCodeUrl: response.data.qrCodeUrl,
      createdAt: Date.now(), // timestamp ms
    });
    setCookie(props.item?.roCode, payload, QR_TTL_MINUTES);
    // Gắn createdAt vào qrCode để PayingComponent tính countdown
    qrCode.value = { ...response, data: { ...response.data, createdAt: Date.now() } };
  }

  isLoading.value = false;
};

const onHideDialog = () => {
  emit('hide');
};
</script>
