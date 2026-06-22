<template>
  <div class="fb-flex fb-justify-center fb-w-full fb-py-4">
    <!-- === CÓ YÊU CẦU THANH TOÁN === -->
    <template v-if="isRequirePayment">
      <!-- STEP 0: QR Thanh toán -->
      <div v-if="step === 0" class="fb-container fb-mx-auto">
        <!-- Toggle Tabs -->
        <div class="fb-flex fb-justify-center fb-mb-6">
          <div
            class="fb-flex fb-bg-white fb-border fb-border-gray-200 fb-rounded-lg fb-p-1 fb-shadow-sm"
          >
            <Button
              size="small"
              class="fb-flex fb-items-center fb-gap-2 fb-px-6 fb-py-2 fb-rounded-md fb-font-medium fb-text-sm fb-transition-colors fb-border-0 fb-cursor-pointer"
              :severity="activeTab === 'qr' ? 'primary' : 'secondary'"
              :variant="activeTab === 'qr' ? 'filled' : 'text'"
              @click="activeTab = 'qr'"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 6.5H6.51M17.5 6.5H17.51M6.5 17.5H6.51M13 13H13.01M17.5 17.5H17.51M17 21H21V17M14 16.5V21M21 14H16.5M15.6 10H19.4C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3H15.6C15.0399 3 14.7599 3 14.546 3.10899C14.3578 3.20487 14.2049 3.35785 14.109 3.54601C14 3.75992 14 4.03995 14 4.6V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10ZM4.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4V4.6C10 4.03995 10 3.75992 9.89101 3.54601C9.79513 3.35785 9.64215 3.20487 9.45399 3.10899C9.24008 3 8.96005 3 8.4 3H4.6C4.03995 3 3.75992 3 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3 3.75992 3 4.03995 3 4.6V8.4C3 8.96005 3 9.24008 3.10899 9.45399C3.20487 9.64215 3.35785 9.79513 3.54601 9.89101C3.75992 10 4.03995 10 4.6 10ZM4.6 21H8.4C8.96005 21 9.24008 21 9.45399 20.891C9.64215 20.7951 9.79513 20.6422 9.89101 20.454C10 20.2401 10 19.9601 10 19.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14H4.6C4.03995 14 3.75992 14 3.54601 14.109C3.35785 14.2049 3.20487 14.3578 3.10899 14.546C3 14.7599 3 15.0399 3 15.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Quét mã QR
            </Button>
            <Button
              size="small"
              class="fb-flex fb-items-center fb-gap-2 fb-px-6 fb-py-2 fb-rounded-md fb-font-medium fb-text-sm fb-transition-colors fb-border-0 fb-cursor-pointer"
              :severity="activeTab === 'transfer' ? 'primary' : 'secondary'"
              :variant="activeTab === 'transfer' ? 'filled' : 'text'"
              @click="activeTab = 'transfer'"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16667 7.4992V14.1659M7.91667 7.4992V14.1659M12.0833 7.4992V14.1659M15.8333 7.4992V14.1659M2.5 15.4992L2.5 16.1659C2.5 16.6326 2.5 16.8659 2.59083 17.0442C2.67072 17.201 2.79821 17.3285 2.95501 17.4084C3.13327 17.4992 3.36662 17.4992 3.83333 17.4992H16.1667C16.6334 17.4992 16.8667 17.4992 17.045 17.4084C17.2018 17.3285 17.3293 17.201 17.4092 17.0442C17.5 16.8659 17.5 16.6326 17.5 16.1659V15.4992C17.5 15.0325 17.5 14.7991 17.4092 14.6209C17.3293 14.4641 17.2018 14.3366 17.045 14.2567C16.8667 14.1659 16.6334 14.1659 16.1667 14.1659H3.83333C3.36662 14.1659 3.13327 14.1659 2.95501 14.2567C2.79821 14.3366 2.67072 14.4641 2.59083 14.6209C2.5 14.7991 2.5 15.0325 2.5 15.4992ZM9.71076 2.56348L3.54409 3.93385C3.17154 4.01664 2.98527 4.05803 2.84622 4.15821C2.72358 4.24656 2.62727 4.36662 2.56762 4.50551C2.5 4.66297 2.5 4.85379 2.5 5.23543L2.5 6.16587C2.5 6.63258 2.5 6.86593 2.59083 7.04419C2.67072 7.201 2.79821 7.32848 2.95501 7.40837C3.13327 7.4992 3.36662 7.4992 3.83333 7.4992H16.1667C16.6334 7.4992 16.8667 7.4992 17.045 7.40837C17.2018 7.32848 17.3293 7.201 17.4092 7.04419C17.5 6.86594 17.5 6.63258 17.5 6.16587V5.23543C17.5 4.85379 17.5 4.66297 17.4324 4.50551C17.3727 4.36662 17.2764 4.24656 17.1538 4.15821C17.0147 4.05803 16.8285 4.01664 16.4559 3.93385L10.2892 2.56348C10.1813 2.53949 10.1273 2.5275 10.0728 2.52272C10.0244 2.51847 9.97564 2.51847 9.9272 2.52272C9.87267 2.5275 9.8187 2.53949 9.71076 2.56348Z"
                  stroke="currentColor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              Chuyển khoản
            </Button>
          </div>
        </div>

        <!-- VIEW QR -->
        <div v-if="activeTab === 'qr'" class="fb-flex fb-flex-col md:fb-flex-row fb-gap-4">
          <!-- CỘT TRÁI: Thông tin đơn hàng -->
          <div class="md:fb-w-5/12 fb-bg-[#fdfdfd] fb-pr-3">
            <div class="fb-p-4 fb-border fb-border-gray-200 fb-rounded-xl fb-shadow-sm fb-bg-white">
              <h5 class="fb-font-semibold fb-text-[18px] fb-mb-4">Thông tin đơn hàng</h5>

              <div class="fb-pb-3 fb-border-b fb-border-gray-200">
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

              <div class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200">
                <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Mã PYC</p>
                <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">{{ item.roCode }}</p>
              </div>

              <div class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200">
                <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Tên gói</p>
                <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">{{ subscriptionName }}</p>
              </div>

              <!-- Người giới thiệu -->
              <div v-if="item?.ref" class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200">
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
                  <p class="fb-font-medium fb-text-base fb-mb-0 fb-uppercase">{{ item.ref }}</p>
                </div>
              </div>

              <!-- Số tiền -->
              <div class="fb-mt-4">
                <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Số tiền</p>
                <p class="fb-font-bold fb-text-[24px] fb-text-[#0262ad] fb-mt-2 fb-mb-0">
                  {{ formatCurrency(item?.amount || 0) }}
                </p>
              </div>
            </div>

            <!-- Countdown -->
            <div class="fb-mt-4">
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
                    class="fb-flex fb-flex-col fb-items-center fb-bg-white fb-px-3 fb-py-2 fb-rounded-lg fb-min-w-[64px]"
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
            class="md:fb-w-7/12 fb-rounded-xl fb-px-3 fb-py-4 fb-text-center fb-flex fb-flex-col fb-justify-center fb-gap-4"
            style="background: linear-gradient(180deg, #6f4bff 4.71%, #0560a6 78.37%)"
          >
            <div>
              <h4 class="fb-text-white fb-font-semibold fb-text-xl">Quét mã QR để thanh toán</h4>
              <div
                class="fb-bg-white fb-rounded-lg fb-mx-auto fb-mt-4 fb-p-2 fb-flex fb-items-center fb-w-fit"
              >
                <img :src="logoMomoText" alt="" style="height: 17px" />
                <img :src="logoMomoText" alt="" style="height: 17px" />
                <img :src="logoVietqrText" alt="" class="fb-ml-1" style="height: 20px" />
                <img :src="logoNapasText" alt="" class="fb-ml-1" style="height: 25px" />
              </div>
            </div>

            <!-- QR wrapper -->
            <div
              v-if="qrCode.data"
              class="fb-mx-auto fb-bg-white fb-relative fb-rounded-2xl fb-mt-4 fb-p-6 fb-w-fit"
            >
              <QrcodeVue :value="qrCode.data?.qrCodeUrl || ''" :size="307" level="H" />

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
                <strong class="fb-text-[#fec84b] fb-font-semibold fb-text-[18px]">19004766</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- VIEW CHUYỂN KHOẢN -->
        <div v-else-if="activeTab === 'transfer'" class="fb-max-w-xl fb-mx-auto fb-w-full">
          <div class="fb-bg-white fb-p-6 fb-border fb-border-gray-200 fb-rounded-xl fb-shadow-sm">
            <h5 class="fb-font-semibold fb-text-[18px] fb-mb-4">Thông tin đơn hàng</h5>

            <div class="fb-pb-3 fb-border-b fb-border-gray-200">
              <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Ngân hàng</p>
              <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">
                Techcombank chi nhánh Hoàng Quốc Việt, Hà Nội
              </p>
            </div>

            <div
              class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200 fb-flex fb-justify-between fb-items-center"
            >
              <div>
                <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Số tài khoản</p>
                <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">11722990944013</p>
              </div>
              <Button
                size="small"
                severity="secondary"
                variant="text"
                @click="handleCopy('11722990944013')"
              >
                <IconCopy color="currentColor" />
              </Button>
            </div>

            <div class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200">
              <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Tên chủ tài khoản</p>
              <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">Công ty Cổ phần iPOS.VN</p>
            </div>

            <div
              class="fb-mt-4 fb-pb-3 fb-border-b fb-border-gray-200 fb-flex fb-justify-between fb-items-center"
            >
              <div>
                <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Nội dung chuyển khoản</p>
                <p class="fb-font-medium fb-text-base fb-mt-2 fb-mb-0">
                  TT{{ item?.roCode || '' }}
                </p>
              </div>
              <Button
                size="small"
                severity="secondary"
                variant="text"
                @click="handleCopy(`TT${item?.roCode || ''}`)"
              >
                <IconCopy color="currentColor" />
              </Button>
            </div>

            <div class="fb-mt-4">
              <p class="fb-text-gray-500 fb-mb-0 fb-text-sm">Số tiền</p>
              <p class="fb-font-bold fb-text-[24px] fb-text-[#0262ad] fb-mt-2 fb-mb-0">
                {{ formatCurrency(item?.amount || 0) }} ₫
              </p>
            </div>
          </div>

          <p class="fb-mt-6 fb-mb-0 fb-text-[#f7941d] fb-text-sm fb-font-medium fb-text-center">
            Lưu ý: Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận đơn hàng
          </p>
        </div>
      </div>

      <!-- STEP 1: Thành công -->
      <template v-else-if="step === 1">
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
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';
import { useToast } from 'primevue/usetoast';
import { extendLicenseService } from '@/api/services/extend-license/extend-license.service';
import { formatCurrency, getAssetUrl } from '@/common/utils/common';
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
  item: { type: Object, default: () => ({}) },
});

// ── Emits ──────────────────────────────────────────────────────────────
const emit = defineEmits(['success']);

// ── Store / Route ──────────────────────────────────────────────────────
const toast = useToast();

// ── State ──────────────────────────────────────────────────────────────
const QR_TTL_SECONDS = 15 * 60; // 15 phút = 900 giây
const step = ref(0); // 0: QR | 1: Thành công | 2: Hết hạn
const activeTab = ref('qr'); // qr | transfer

/**
 * Tính số giây còn lại dựa trên createdAt (timestamp ms).
 * Nếu không có createdAt → dùng full TTL.
 */
function calcTimeLeft() {
  const createdAt = props.qrCode?.data?.createdAt;
  if (!createdAt) return QR_TTL_SECONDS;
  const elapsedSeconds = Math.floor((Date.now() - createdAt) / 1000);
  return Math.max(0, QR_TTL_SECONDS - elapsedSeconds);
}

const timeLeft = ref(calcTimeLeft());
let timer = null;

// ── Computed ───────────────────────────────────────────────────────────
const displayMinutes = computed(() => String(Math.floor(timeLeft.value / 60)).padStart(2, '0'));
const displaySeconds = computed(() => String(timeLeft.value % 60).padStart(2, '0'));

const countdownUnits = computed(() => ({
  Phút: displayMinutes.value,
  Giây: displaySeconds.value,
}));

const subscriptionName = computed(
  () => (props.item?.details || []).find((e) => e.serviceType === 'combo')?.serviceName,
);

// ── Methods ────────────────────────────────────────────────────────────
function startCountdown() {
  timer = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
    }
    if (timeLeft.value % 30 === 0 || timeLeft.value === 0) {
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
    paymentMethod: 'MOMO_QR',
  };
  try {
    const [response, resDep] = await Promise.all([
      extendLicenseService.checkPayment(payload),
      extendLicenseService.checkPaymentDeposit({
        id: props.item?._id,
        roCode: props.item?.roCode,
      }),
    ]);

    const isResponseSuccess =
      response?.success &&
      (response?.data?.state === 'SUCCESS' || response?.data?.data?.state === 'SUCCESS');
    const isResDepSuccess =
      resDep?.success &&
      (resDep?.data?.status === 'SUCCESS' || resDep?.data?.data?.status === 'SUCCESS');

    if (isResponseSuccess || isResDepSuccess) {
      clearInterval(timer);
      step.value = 1;
      let successData = null;
      if (isResponseSuccess) {
        successData = response?.data?.state === 'SUCCESS' ? response?.data : response?.data?.data;
      } else if (isResDepSuccess) {
        successData = resDep?.data?.status === 'SUCCESS' ? resDep?.data : resDep?.data?.data;
      }
      emit('success', successData);
    } else if (timeLeft.value <= 0) {
      clearInterval(timer);
      step.value = 2;
    } else if (!response?.success && !resDep?.success) {
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
