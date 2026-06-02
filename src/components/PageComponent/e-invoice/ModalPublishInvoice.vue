<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Xác nhận"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
    :closable="!isLoading"
  >
    <div class="fb-flex fb-items-center fb-gap-3 fb-py-2">
      <ProgressSpinner
        v-if="isLoading"
        style="width: 2rem; height: 2rem"
        strokeWidth="6"
        class="fb-shrink-0"
      />

      <div v-if="!isLoading" class="fb-flex fb-flex-col fb-gap-3 fb-w-full">
        <div class="fb-text-slate-800 fb-font-medium">
          Vui lòng kiểm tra kỹ thông tin hoá đơn để tránh sai sót trước khi phát hành!
        </div>
        <div
          class="fb-bg-primary-50/50 fb-border fb-border-primary-100 fb-rounded-lg fb-px-3 fb-py-2.5 fb-text-sm fb-text-slate-600"
        >
          Mã đơn:
          <strong class="fb-text-primary-600 fb-break-all">{{ mergedTranIds.join(', ') }}</strong>
        </div>
      </div>

      <span v-else class="fb-font-medium fb-text-slate-700">
        {{ loadingMessage || 'Đang xử lý phát hành hóa đơn...' }}
      </span>
    </div>

    <template #footer>
      <Button label="Huỷ" text severity="secondary" @click="closeDialog" :disabled="isLoading" />
      <Button label="Tiếp tục" @click="onConfirm" :loading="isLoading" />
    </template>
  </Dialog>

  <!-- Dialog Chọn phương thức ký -->
  <Dialog
    v-model:visible="showSignMethodDialog"
    modal
    header="Chọn phương thức ký"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
    :closable="!isLoading"
    @hide="onCancelSignMethod"
  >
    <div class="fb-flex fb-flex-col fb-gap-4 fb-py-4">
      <div class="fb-text-slate-600">
        Hệ thống phát hiện USB Token đang được kết nối. Vui lòng chọn phương thức ký mà bạn muốn sử dụng:
      </div>
      <div class="fb-flex fb-flex-col fb-gap-3">
        <Button 
          label="Ký bằngToken" 
          @click="onSelectSignMethod('TOKEN')" 
        />
        <Button 
          label="Ký bằng HSMs" 
          severity="secondary" 
          outlined
          @click="onSelectSignMethod('HSM')" 
        />
      </div>
    </div>
  </Dialog>

  <!-- Dialog Chọn chữ ký số -->
  <Dialog
    v-model:visible="showCertDialog"
    modal
    header="Chọn chữ ký số"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
    :closable="!isLoading"
    @hide="onCancelCert"
  >
    <div class="fb-flex fb-flex-col fb-gap-4 fb-py-2">
      <div class="fb-text-sm fb-text-slate-500">
        Vui lòng chọn chứng thư số phù hợp từ thiết bị USB Token đang kết nối:
      </div>

      <!-- Danh sách chứng thư số dạng Card List -->
      <div class="fb-flex fb-flex-col fb-gap-3 fb-max-h-[350px] fb-overflow-y-auto fb-pr-1">
        <div
          v-for="cert in certList"
          :key="cert.CertSerial"
          class="fb-relative fb-flex fb-items-start fb-gap-3 fb-p-4 fb-rounded-xl fb-border fb-cursor-pointer fb-transition-all fb-duration-200"
          :class="[
            selectedCertSerial === cert.CertSerial
              ? 'fb-border-primary-500 fb-bg-primary-50/50 fb-shadow-md'
              : 'fb-border-slate-200 fb-bg-white hover:fb-border-slate-300 hover:fb-bg-slate-50/50',
          ]"
          @click="selectedCertSerial = cert.CertSerial"
        >
          <!-- Radio Indicator (Sử dụng SVG thay vì PrimeIcons) -->
          <div
            class="fb-mt-1 fb-flex fb-shrink-0 fb-items-center fb-justify-center fb-w-5 fb-h-5 fb-rounded-full fb-border fb-transition-colors"
            :class="[
              selectedCertSerial === cert.CertSerial
                ? 'fb-border-primary-500 fb-bg-primary-500'
                : 'fb-border-slate-300 fb-bg-white',
            ]"
          >
            <svg
              v-if="selectedCertSerial === cert.CertSerial"
              class="fb-w-3 fb-h-3 fb-text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <!-- Chi tiết chứng thư -->
          <div class="fb-flex fb-flex-col fb-gap-1">
            <span class="fb-font-semibold fb-text-slate-800 fb-leading-snug">
              {{ parseDN(cert.Subject).cn }}
            </span>

            <div
              class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-x-4 fb-gap-y-1 fb-text-xs fb-text-slate-500 fb-mt-1"
            >
              <span v-if="parseDN(cert.Subject).mst" class="fb-flex fb-items-center fb-gap-1">
                <strong class="fb-text-slate-700">MST:</strong>
                {{ parseDN(cert.Subject).mst }}
              </span>
              <span class="fb-flex fb-items-center fb-gap-1">
                <strong class="fb-text-slate-700">Serial:</strong>
                {{ cert.CertSerial }}
              </span>
              <span class="fb-flex fb-items-center fb-gap-1">
                <strong class="fb-text-slate-700">Nhà cung cấp:</strong>
                {{ cert.Owner }}
              </span>
              <span class="fb-flex fb-items-center fb-gap-1">
                <strong class="fb-text-slate-700">Hạn dùng:</strong>
                <span :class="isExpired(cert.ValidTo) ? 'fb-text-red-500 fb-font-medium' : ''">
                  {{ formatDate(cert.ValidTo) }}
                </span>
              </span>
            </div>
          </div>

          <!-- Expired Badge -->
          <div
            v-if="isExpired(cert.ValidTo)"
            class="fb-absolute fb-top-3 fb-right-3 fb-px-2 fb-py-0.5 fb-text-[10px] fb-font-medium fb-rounded-full fb-bg-red-50 fb-text-red-600 fb-border fb-border-red-100"
          >
            Hết hạn
          </div>
        </div>
      </div>

      <!-- Cảnh báo nếu chọn chứng thư hết hạn -->
      <div v-if="isExpiredSelected" class="fb-text-xs fb-text-red-500 fb-mt-1 fb-text-right">
        Chứng thư số đã hết hạn, vui lòng chọn chứng thư khác!
      </div>
    </div>

    <template #footer>
      <div class="fb-flex fb-items-center fb-justify-between fb-w-full">
        <span v-if="isLoading" class="fb-text-sm fb-text-primary-600 fb-italic">
          {{ loadingMessage }}
        </span>
        <span v-else></span>
        <div class="fb-flex fb-gap-2">
          <Button
            label="Huỷ"
            text
            severity="secondary"
            @click="onCancelCert"
            :disabled="isLoading"
          />
          <Button
            label="Xác nhận"
            @click="onConfirmCert"
            :disabled="!selectedCertSerial || isExpiredSelected"
            :loading="isLoading"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { usePublishInvoice } from '@/common/composables/usePublishInvoice';
import { formatDate } from '@/common/utils/common';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mergedTranIds: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:visible', 'success']);

const { publishInvoice, isLoading, loadingMessage } = usePublishInvoice();

// State chọn chữ ký số
const showCertDialog = ref(false);
const certList = ref([]);
const selectedCertSerial = ref(null);
let resolveCertPromise = null;
let rejectCertPromise = null;

// State chọn phương thức ký
const showSignMethodDialog = ref(false);
let resolveSignMethodPromise = null;
let rejectSignMethodPromise = null;

const closeDialog = () => {
  if (isLoading.value) return;
  emit('update:visible', false);
};

// Trích xuất thông tin hữu ích từ chuỗi DN (Subject/Issuer)
const parseDN = (dnString) => {
  if (!dnString) return { cn: 'Chưa xác định', mst: '', org: '', raw: '' };

  // DN format: "CN=Tên, O=Tổ chức, C=Quốc gia..." hoặc tương tự
  const parts = dnString.split(',').reduce((acc, part) => {
    const indexOfEqual = part.indexOf('=');
    if (indexOfEqual !== -1) {
      const key = part.substring(0, indexOfEqual).trim().toUpperCase();
      const val = part.substring(indexOfEqual + 1).trim();
      acc[key] = val;
    }
    return acc;
  }, {});

  const cn = parts['CN'] || parts['O'] || dnString;

  let mst = '';
  const mstPart =
    dnString.match(/MST\s*:\s*([0-9a-zA-Z\-]+)/i) ||
    dnString.match(/0\.9\.2342\.19200300\.100\.1\.1\s*=\s*MST:([0-9a-zA-Z\-]+)/i);
  if (mstPart && mstPart[1]) {
    mst = mstPart[1];
  } else {
    for (const key in parts) {
      if (key.includes('MST') || key.includes('TAX')) {
        mst = parts[key];
        break;
      }
    }
  }

  return {
    cn,
    mst,
    org: parts['O'] || '',
    raw: dnString,
  };
};

const isExpired = (validTo) => {
  if (!validTo) return false;
  return new Date(validTo) < new Date();
};

const isExpiredSelected = computed(() => {
  const selected = certList.value.find((c) => c.CertSerial === selectedCertSerial.value);
  return selected ? isExpired(selected.ValidTo) : false;
});

// Callback nhận từ composable để mở Dialog chọn chữ ký số
const handleSelectCert = (certs) => {
  return new Promise((resolve, reject) => {
    certList.value = certs;
    if (certs && certs.length > 0) {
      // Ưu tiên chọn chứng thư chưa hết hạn đầu tiên
      const activeCert = certs.find((c) => !isExpired(c.ValidTo));
      selectedCertSerial.value = activeCert ? activeCert.CertSerial : certs[0].CertSerial;
    } else {
      selectedCertSerial.value = null;
    }
    showCertDialog.value = true;
    resolveCertPromise = resolve;
    rejectCertPromise = reject;
  });
};

const onConfirmCert = () => {
  if (selectedCertSerial.value && resolveCertPromise) {
    const resolve = resolveCertPromise;
    resolveCertPromise = null;
    rejectCertPromise = null;
    resolve(selectedCertSerial.value);
    // Lưu ý: Không đóng dialog ngay, để dialog hiển thị trạng thái loading ký số.
  }
};

const onCancelCert = () => {
  if (rejectCertPromise) {
    rejectCertPromise(new Error('User cancelled certificate selection'));
    resolveCertPromise = null;
    rejectCertPromise = null;
  }
  showCertDialog.value = false;
};

// --- LOGIC PHƯƠNG THỨC KÝ ---
const handleSelectSignMethod = () => {
  return new Promise((resolve, reject) => {
    showSignMethodDialog.value = true;
    resolveSignMethodPromise = resolve;
    rejectSignMethodPromise = reject;
  });
};

const onSelectSignMethod = (method) => {
  if (resolveSignMethodPromise) {
    resolveSignMethodPromise(method);
    resolveSignMethodPromise = null;
    rejectSignMethodPromise = null;
  }
  showSignMethodDialog.value = false;
};

const onCancelSignMethod = () => {
  if (rejectSignMethodPromise) {
    rejectSignMethodPromise(null); // Resolve null để báo hủy
    resolveSignMethodPromise = null;
    rejectSignMethodPromise = null;
  }
  showSignMethodDialog.value = false;
};

// --- MAIN LOGIC ---
const onConfirm = async () => {
  // BƯỚC 1 — CONFIRM DIALOG - Tiếp tục
  // Truyền handleSelectCert và handleSelectSignMethod làm callback
  const success = await publishInvoice(props.mergedTranIds, handleSelectCert, handleSelectSignMethod);

  // Đóng dialog chọn chữ ký số sau khi quy trình kết thúc (thành công hoặc thất bại)
  showCertDialog.value = false;

  if (success) {
    emit('success');
    closeDialog();
  }
};
</script>
