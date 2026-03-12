<template>
  <div class="fb-pb-4">
    <div>
      <!-- === CÓ YÊU CẦU THANH TOÁN === -->
      <template v-if="isRequirePayment">
        <!-- STEP 0: QR Thanh toán -->
        <div v-if="step === 0" class="fb-container">
          <div class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
            <!-- CỘT TRÁI: Thông tin đơn hàng -->
            <div class="md:fb-w-5/12 fb-bg-[#fdfdfd] fb-pr-3">
              <div class="fb-p-3 fb-border fb-border-gray-200 fb-rounded-xl fb-shadow-sm">
                <h5 class="fb-font-semibold fb-text-[18px] fb-mb-0">Thông tin đơn hàng</h5>

                <!-- Chuyển khoản nhiều đơn -->
                <template v-if="isExtendMultiple">
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Ngân hàng</p>
                    <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">
                      Techcombank chi nhánh Hoàng Quốc Việt, Hà Nội
                    </p>
                  </div>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Số tài khoản</p>
                    <button
                      class="fb-mt-2 fb-flex fb-items-center fb-gap-2 fb-bg-[#0560a6] fb-text-white fb-px-3 fb-py-1 fb-rounded-md fb-text-base fb-font-medium fb-cursor-pointer fb-border-0"
                      @click="handleCopy('11722990944013')"
                    >
                      <span>11722990944013</span>
                      icon-copy
                    </button>
                  </div>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Tên chủ tài khoản</p>
                    <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">
                      Công ty Cổ phần iPOS.VN
                    </p>
                  </div>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Nội dung chuyển khoản</p>
                    <button
                      class="fb-mt-2 fb-flex fb-items-center fb-gap-2 fb-bg-[#0560a6] fb-text-white fb-px-3 fb-py-1 fb-rounded-md fb-text-base fb-font-medium fb-cursor-pointer fb-border-0"
                      @click="handleCopy(tranIdPreview)"
                    >
                      <span>{{ tranIdPreview }}</span>
                      icon-copy
                    </button>
                  </div>
                </template>

                <!-- Thanh toán đơn lẻ -->
                <template v-else>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Nhà cung cấp</p>
                    <div class="fb-flex fb-items-center fb-mt-2 fb-gap-2">
                      <img
                        :src="logoIposText"
                        alt=""
                        class="fb-w-8 fb-h-8 fb-object-cover fb-rounded-lg"
                      />
                      <p class="fb-font-medium fb-text-base fb-mb-0">Công ty cổ phần IPOS.vn</p>
                    </div>
                  </div>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Mã hóa đơn</p>
                    <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">{{ item.roCode }}</p>
                  </div>
                  <div class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                    <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Dịch vụ</p>
                    <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">
                      {{ subscriptionName }}
                    </p>
                  </div>
                </template>

                <!-- Người giới thiệu -->
                <div v-if="item?.ref" class="fb-mt-3 fb-pb-3 fb-border-b fb-border-gray-200">
                  <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Người giới thiệu</p>
                  <div class="fb-flex fb-items-center fb-mt-2 fb-gap-2">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.8337 17.5V15.8333C18.8337 14.2801 17.7713 12.9751 16.3337 12.605M13.417 2.7423C14.6386 3.23679 15.5003 4.43443 15.5003 5.83333C15.5003 7.23224 14.6386 8.42988 13.417 8.92437M14.667 17.5C14.667 15.9469 14.667 15.1703 14.4133 14.5577C14.0749 13.741 13.426 13.092 12.6093 12.7537C11.9967 12.5 11.2201 12.5 9.66699 12.5H7.16699C5.61385 12.5 4.83728 12.5 4.22471 12.7537C3.40795 13.092 2.75904 13.741 2.42073 14.5577C2.16699 15.1703 2.16699 15.9469 2.16699 17.5M11.7503 5.83333C11.7503 7.67428 10.2579 9.16667 8.41699 9.16667C6.57604 9.16667 5.08366 7.67428 5.08366 5.83333C5.08366 3.99238 6.57604 2.5 8.41699 2.5C10.2579 2.5 11.7503 3.99238 11.7503 5.83333Z"
                        stroke="url(#grad_ref)"
                        stroke-width="1.66667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="grad_ref"
                          x1="2.167"
                          y1="2.5"
                          x2="17.084"
                          y2="19.075"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B01EFF" />
                          <stop offset="1" stop-color="#E1467C" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <p class="fb-font-medium fb-text-base fb-mb-0">{{ item.ref }}</p>
                  </div>
                </div>

                <!-- Số tiền -->
                <div class="fb-mt-3">
                  <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Số tiền</p>
                  <p class="fb-font-bold fb-text-[24px] fb-text-[#0262ad] fb-mt-2 fb-mb-0">
                    {{ formatCurrency(item?.amount || 0) }}
                  </p>
                </div>
              </div>

              <!-- Lưu ý chuyển khoản -->
              <p
                v-if="isExtendMultiple"
                class="fb-mt-3 fb-mb-0 fb-text-[#f7941d] fb-text-base fb-font-medium"
              >
                Lưu ý: Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận đơn hàng
              </p>

              <!-- Countdown -->
              <div class="fb-mt-3">
                <div
                  class="fb-p-3 fb-rounded-xl fb-border fb-border-[#6a11cb] fb-text-center"
                  style="
                    background: linear-gradient(
                      270deg,
                      rgba(106, 17, 203, 0.17) 0%,
                      rgba(37, 117, 252, 0.17) 100%
                    );
                  "
                >
                  <p class="fb-font-bold fb-text-base fb-text-[#0262ad] fb-text-center fb-mb-2">
                    Đơn hàng sẽ hết hạn sau
                  </p>
                  <div class="fb-flex fb-justify-center fb-gap-2">
                    <div
                      v-for="(value, label) in countdownUnits"
                      :key="label"
                      class="fb-flex fb-flex-col fb-items-center fb-bg-white fb-px-3 fb-py-2 fb-rounded-lg fb-min-w-[56px]"
                    >
                      <p
                        class="fb-font-bold fb-text-[18px] fb-mb-0"
                        style="
                          background: linear-gradient(270deg, #6a11cb 0%, #2575fc 100%);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          background-clip: text;
                        "
                      >
                        {{ value }}
                      </p>
                      <p
                        class="fb-mb-0 fb-text-sm"
                        style="
                          background: linear-gradient(270deg, #6a11cb 0%, #2575fc 100%);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          background-clip: text;
                        "
                      >
                        {{ label }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CỘT PHẢI: QR Code -->
            <div
              class="md:fb-w-7/12 fb-rounded-xl fb-px-3 fb-py-4 fb-text-center fb-flex fb-flex-col fb-justify-between"
              style="background: linear-gradient(180deg, #6f4bff 4.71%, #0560a6 78.37%)"
            >
              <div>
                <h4 class="fb-text-white fb-font-semibold fb-text-xl">Quét mã QR để thanh toán</h4>
                <div
                  class="fb-bg-white fb-rounded-lg fb-mx-auto fb-mt-4 fb-p-2 fb-flex fb-items-center fb-gap-1 fb-w-fit"
                >
                  <img :src="logoMomoText" alt="" style="height: 17px" />
                  <img :src="logoMomoText" alt="" style="height: 17px" />
                  <img :src="logoVietqrText" alt="" class="fb-ml-1" style="height: 20px" />
                  <img :src="logoNapasText" alt="" style="height: 25px" />
                </div>
              </div>

              <!-- QR wrapper -->
              <div
                v-if="qrCode.data"
                class="fb-mx-auto fb-bg-white fb-relative fb-rounded-2xl fb-mt-4 fb-p-4 fb-w-fit"
              >
                <QrcodeVue :value="qrCode.data?.qrCodeUrl || ''" :size="237" level="H" />

                <!-- Logo giữa QR -->
                <div
                  class="fb-absolute fb-top-1/2 fb-left-1/2 -fb-translate-x-1/2 -fb-translate-y-1/2 fb-w-[45px] fb-h-[45px] fb-bg-white fb-rounded-md fb-flex fb-items-center fb-justify-center"
                >
                  <img :src="logoMomo" alt="" class="fb-w-10 fb-h-10" />
                </div>

                <!-- 4 góc decoration -->
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="fb-absolute fb-top-3 fb-left-3"
                >
                  <path
                    d="M24.6252 1.75171H6.78519C4.04586 1.75171 1.8252 3.97238 1.8252 6.71171V24.5517"
                    stroke="url(#g1)"
                    stroke-width="2.48"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="g1"
                      x1="13.225"
                      y1="1.752"
                      x2="13.225"
                      y2="24.552"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#6F4BFF" />
                      <stop offset="1" stop-color="#0560A6" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="fb-absolute fb-top-3 fb-right-3"
                >
                  <path
                    d="M1.37578 1.75171H19.2158C21.9551 1.75171 24.1758 3.97238 24.1758 6.71171V24.5517"
                    stroke="url(#g2)"
                    stroke-width="2.48"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="g2"
                      x1="12.776"
                      y1="1.752"
                      x2="12.776"
                      y2="24.552"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#6F4BFF" />
                      <stop offset="1" stop-color="#0560A6" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="fb-absolute fb-bottom-3 fb-left-3"
                >
                  <path
                    d="M24.6252 24.2517H6.78519C4.04586 24.2517 1.8252 22.031 1.8252 19.2917V1.45171"
                    stroke="url(#g3)"
                    stroke-width="2.48"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="g3"
                      x1="13.225"
                      y1="24.252"
                      x2="13.225"
                      y2="1.452"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#6F4BFF" />
                      <stop offset="1" stop-color="#0560A6" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="fb-absolute fb-bottom-3 fb-right-3"
                >
                  <path
                    d="M1.37578 24.2517H19.2158C21.9551 24.2517 24.1758 22.031 24.1758 19.2917V1.45171"
                    stroke="url(#g4)"
                    stroke-width="2.48"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="g4"
                      x1="12.776"
                      y1="24.252"
                      x2="12.776"
                      y2="1.452"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#6F4BFF" />
                      <stop offset="1" stop-color="#0560A6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div v-else class="fb-text-white">
                {{ qrCode?.error?.message }}
              </div>

              <div>
                <p class="fb-text-center fb-text-white fb-text-base fb-mt-4">
                  Sử dụng ứng dụng
                  <strong class="fb-font-semibold fb-text-[18px]">MoMo</strong>
                  hoặc ứng dụng
                  <strong class="fb-font-semibold fb-text-[18px]">ngân hàng</strong>
                  để quét mã
                </p>
                <p class="fb-text-center fb-text-white fb-text-base">
                  Nếu gặp khó khăn hoặc lỗi trong quá trình thanh toán vui lòng liên hệ
                  <strong class="fb-text-[#fec84b] fb-font-semibold fb-text-[18px]">
                    19004766
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 1: Thành công -->
        <template v-else-if="step === 1">
          <div class="fb-text-center">
            <i class="fal fa-check-circle fb-text-green-500 fb-text-5xl"></i>
            <h3 class="fb-mt-3 fb-mb-2 fb-text-xl fb-font-semibold">
              {{
                $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--EXTEND_LICENSE_SUCCESS')
              }}
            </h3>
            <p class="fb-mb-3 fb-text-gray-500">
              {{ $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--GUIDELINE') }}
            </p>
            <p class="fb-mb-5">
              {{ $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--ORDER_CODE') }}:
              {{ item?.roCode }}
            </p>
          </div>
        </template>

        <!-- STEP 2: QR hết hạn -->
        <div v-else class="fb-text-center">
          <i class="fal fa-times-circle fb-text-red-500 fb-text-5xl"></i>
          <h3 class="fb-mt-3 fb-mb-2 fb-text-xl fb-font-semibold">QR thanh toán đã hết hạn</h3>
          <p class="fb-font-semibold">
            {{ $t('ANNOUNCE_CREATE_ORDER_SUCCESS--TRAN_ID') }}: {{ item?.roCode }}
          </p>
          <RouterLink to="/micro/extend-license/extend-license-history">
            Quay về trang danh sách
          </RouterLink>
        </div>
      </template>

      <!-- === KHÔNG YÊU CẦU THANH TOÁN === -->
      <template v-else>
        <div class="fb-text-center">
          <i class="fal fa-check-circle fb-text-green-500 fb-text-5xl"></i>
          <h3 class="fb-mt-3 fb-mb-2 fb-text-xl fb-font-semibold">
            {{ $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--EXTEND_LICENSE_SUCCESS') }}
          </h3>
          <p class="fb-mb-3 fb-text-gray-500">
            {{ $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--GUIDELINE') }}
          </p>
          <p class="fb-mb-5">
            {{ $t('EXTEND_STORE_LICENSE--ANNOUNCE_CREATE_ORDER_SUCCESS--ORDER_CODE') }}:
            {{ item?.roCode }}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';
import { useToast } from 'primevue/usetoast';
import { extendLicenseService } from '@/api/services/extend-license/extend-license.service';
import { formatCurrency, getAssetUrl } from '@/common/ulties';
import logoIposTextPath from '@/assets/img/logo/logo-ipos-text.png';
import logoMomoTextPath from '@/assets/img/logo/logo-momo-text.png';
import logoVietqrTextPath from '@/assets/img/logo/logo-vietqr-text.png';
import logoNapasTextPath from '@/assets/img/logo/logo-napas-text.png';
import logoMomoPath from '@/assets/img/logo/logo-momo.png';
const logoIposText = getAssetUrl(logoIposTextPath);
const logoMomoText = getAssetUrl(logoMomoTextPath);
const logoVietqrText = getAssetUrl(logoVietqrTextPath);
const logoNapasText = getAssetUrl(logoNapasTextPath);
const logoMomo = getAssetUrl(logoMomoPath);

// ── Props ──────────────────────────────────────────────────────────────
const props = defineProps({
  qrCode: { type: Object, default: () => ({}) },
  tranIdPreview: { type: String, default: null }, // Nội dung chuyển khoản
  isRequirePayment: { type: Boolean, default: true },
  isExtendMultiple: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) }
});

// ── Emits ──────────────────────────────────────────────────────────────
const emit = defineEmits(['success']);

// ── Store / Route ──────────────────────────────────────────────────────
const toast = useToast();

// ── State ──────────────────────────────────────────────────────────────
const step = ref(0); // 0: QR | 1: Thành công | 2: Hết hạn
const timeLeft = ref(3600);
let timer = null;

// ── Computed ───────────────────────────────────────────────────────────
const displayHours = computed(() => String(Math.floor(timeLeft.value / 3600)).padStart(2, '0'));
const displayMinutes = computed(() =>
  String(Math.floor((timeLeft.value % 3600) / 60)).padStart(2, '0')
);
const displaySeconds = computed(() => String(timeLeft.value % 60).padStart(2, '0'));

const countdownUnits = computed(() => ({
  Giờ: displayHours.value,
  Phút: displayMinutes.value,
  Giây: displaySeconds.value
}));

const subscriptionName = computed(
  () => (props.item?.details || []).find((e) => e.serviceType === 'combo')?.serviceName
);

// ── Methods ────────────────────────────────────────────────────────────
function startCountdown() {
  timer = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
    }
    if (timeLeft.value % 2 === 0 || timeLeft.value === 0) {
      await checkPayment();
    }
  }, 1000);
}

async function checkPayment() {
  const payload = {
    companyId: props.item?.companyId,
    brandId: props.item?.brandId,
    storeId: props.item?.storeId,
    tranId: props.item?.roCode,
    paymentMethod: 'MOMO_QR'
  };
  try {
    const response = await extendLicenseService.checkPayment(payload);
    if (response.success) {
      if (response?.data?.data?.state === 'SUCCESS') {
        clearInterval(timer);
        step.value = 1;
        emit('success');
      } else if (timeLeft.value <= 0) {
        clearInterval(timer);
        step.value = 2;
      }
    } else {
      clearInterval(timer);
    }
  } catch (error) {
    console.error(error?.message);
    clearInterval(timer);
  }
}

async function handleCopy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ severity: 'success', summary: 'Sao chép thành công!', life: 2000 });
  } catch {
    toast.add({ severity: 'error', summary: 'Trình duyệt không hỗ trợ sao chép!', life: 2000 });
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(() => {
  if (!props.qrCode?.error) {
    startCountdown();
  }
});
onBeforeUnmount(() => clearInterval(timer));
</script>
