<template>
  <section id="summary">
    <div class="fb-grid fb-grid-cols-12 fb-gap-6">
      <!-- Số lượng hóa đơn đã mua -->
      <div class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-4">
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs">
          <div class="fb-flex fb-justify-between">
            <span class="fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
              Số lượng hóa đơn đã mua
            </span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z"
                fill="#D1E9FF"
              />
              <path
                d="M17.3334 15.3333H13.3334M14.6667 18H13.3334M18.6667 12.6666H13.3334M21.3334 12.5333V19.4666C21.3334 20.5868 21.3334 21.1468 21.1154 21.5746C20.9237 21.951 20.6177 22.2569 20.2414 22.4487C19.8136 22.6666 19.2535 22.6666 18.1334 22.6666H13.8667C12.7466 22.6666 12.1866 22.6666 11.7588 22.4487C11.3824 22.2569 11.0765 21.951 10.8847 21.5746C10.6667 21.1468 10.6667 20.5868 10.6667 19.4666V12.5333C10.6667 11.4132 10.6667 10.8532 10.8847 10.4253C11.0765 10.049 11.3824 9.74305 11.7588 9.5513C12.1866 9.33331 12.7466 9.33331 13.8667 9.33331H18.1334C19.2535 9.33331 19.8136 9.33331 20.2414 9.5513C20.6177 9.74305 20.9237 10.049 21.1154 10.4253C21.3334 10.8532 21.3334 11.4132 21.3334 12.5333Z"
                stroke="#0086C9"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Skeleton v-if="totalQuantityInvoices?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(totalQuantityInvoices?.data?.total_purchased || 0) }}
          </div>
        </div>
      </div>

      <!-- Số lượng hóa đơn đã sử dụng -->
      <div class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-4">
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs">
          <div class="fb-flex fb-justify-between">
            <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
              Số lượng hóa đơn đã sử dụng
            </span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z"
                fill="#FEF0C7"
              />
              <path
                d="M21.3334 14.3333V12.5333C21.3334 11.4132 21.3334 10.8532 21.1154 10.4253C20.9237 10.049 20.6177 9.74305 20.2414 9.5513C19.8136 9.33331 19.2535 9.33331 18.1334 9.33331H13.8667C12.7466 9.33331 12.1866 9.33331 11.7588 9.5513C11.3824 9.74305 11.0765 10.049 10.8847 10.4253C10.6667 10.8532 10.6667 11.4132 10.6667 12.5333V19.4666C10.6667 20.5868 10.6667 21.1468 10.8847 21.5746C11.0765 21.951 11.3824 22.2569 11.7588 22.4487C12.1866 22.6666 12.7466 22.6666 13.8667 22.6666H17.3334M17.3334 15.3333H13.3334M14.6667 18H13.3334M18.6667 12.6666H13.3334M19.0001 18.0015C19.1175 17.6676 19.3494 17.386 19.6546 17.2066C19.9597 17.0273 20.3185 16.9617 20.6674 17.0216C21.0163 17.0814 21.3327 17.2628 21.5607 17.5336C21.7887 17.8044 21.9134 18.1471 21.9129 18.5011C21.9129 19.5004 20.414 20 20.414 20M20.4333 22H20.44"
                stroke="#DC6803"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Skeleton v-if="totalQuantityInvoices?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(totalQuantityInvoices?.data?.total_used || 0) }}
          </div>
        </div>
      </div>

      <!-- Số lượng hóa đơn còn lại -->
      <div class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-4">
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs">
          <div class="fb-flex fb-justify-between">
            <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
              Số lượng hóa đơn còn lại
            </span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z"
                fill="#DCFAE6"
              />
              <path
                d="M17.3334 15.3333H13.3334M14.6667 18H13.3334M18.6667 12.6666H13.3334M21.3334 16V12.5333C21.3334 11.4132 21.3334 10.8532 21.1154 10.4253C20.9237 10.049 20.6177 9.74305 20.2414 9.5513C19.8136 9.33331 19.2535 9.33331 18.1334 9.33331H13.8667C12.7466 9.33331 12.1866 9.33331 11.7588 9.5513C11.3824 9.74305 11.0765 10.049 10.8847 10.4253C10.6667 10.8532 10.6667 11.4132 10.6667 12.5333V19.4666C10.6667 20.5868 10.6667 21.1468 10.8847 21.5746C11.0765 21.951 11.3824 22.2569 11.7588 22.4487C12.1866 22.6666 12.7466 22.6666 13.8667 22.6666H16.0001M18.6667 18.6666L22.0001 22M22.0001 18.6666L18.6667 22"
                stroke="#079455"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Skeleton v-if="totalQuantityInvoices?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(totalQuantityInvoices?.data?.total || 0) }}
          </div>
        </div>
      </div>
    </div>

    <div class="fb-col-span-12 fb-mb-5 fb-mt-8 fb-flex fb-items-center fb-gap-4">
      <span class="fb-text-lg fb-font-semibold">Báo cáo thống kê</span>
      <slot name="date-filter"></slot>
    </div>

    <div class="fb-grid fb-grid-cols-12 fb-gap-6">
      <!-- Tổng số hóa đơn -->
      <div
        class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-3 fb-cursor-pointer"
        @click="navigateTo('/e-invoice/invoice-manage', { invoiceType: '1' })"
      >
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs hover:fb-shadow-md hover:fb-border-gray-100 fb-transition-colors fb-duration-200">
          <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
            Tổng số hóa đơn
          </span>
          <Skeleton v-if="statisticInvoice?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(statisticInvoice?.data?.total_invoices || 0) }}
          </div>
        </div>
      </div>

      <!-- Hóa đơn chờ xử lý -->
      <div
        class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-3 fb-cursor-pointer"
        @click="navigateTo('/e-invoice/invoice-manage', { invoiceType: '2,3' })"
      >
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs hover:fb-shadow-md hover:fb-border-gray-100 fb-transition-colors fb-duration-200">
          <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
            Hóa đơn chờ xử lý
          </span>
          <Skeleton v-if="statisticInvoice?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(statisticInvoice?.data?.pending_invoices || 0) }}
          </div>
        </div>
      </div>

      <!-- Hóa đơn lỗi -->
      <div
        class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-3 fb-cursor-pointer"
        @click="navigateTo('/e-invoice/invoice-manage', { invoiceType: '2,3' })"
      >
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs hover:fb-shadow-md hover:fb-border-gray-100 fb-transition-colors fb-duration-200">
          <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
            Hóa đơn lỗi
          </span>
          <Skeleton v-if="statisticInvoice?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(statisticInvoice?.data?.error_invoices || 0) }}
          </div>
        </div>
      </div>

      <!-- Hóa đơn chưa xuất VAT -->
      <div
        class="fb-col-span-12 lg:fb-col-span-6 xl:fb-col-span-3 fb-cursor-pointer"
        @click="navigateTo('/e-invoice/sale-order')"
      >
        <div class="card fb-mb-0 fb-border fb-border-gray-200 fb-shadow-xs hover:fb-shadow-md hover:fb-border-gray-100 fb-transition-colors fb-duration-200">
          <span class="fb-block fb-text-muted-color fb-text-sm !fb-font-semibold fb-mb-2">
            Hóa đơn chưa xuất VAT
          </span>
          <Skeleton v-if="statisticInvoice?.isLoading" width="70%" height="2rem"></Skeleton>
          <div v-else class="dark:fb-text-surface-0 fb-font-semibold fb-text-3xl">
            {{ formatNumber(statisticInvoice?.data?.unsync_vat_invoices || 0) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { formatNumber } from '@/common/utils/common';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// Store/Getter
const invoiceStore = useEInoiveStore();
const statisticInvoice = computed(() => invoiceStore.statisticInvoice);
const totalQuantityInvoices = computed(() => invoiceStore.totalQuantityInvoices);

// Router
const router = useRouter();

// Methods
const navigateTo = (path, query = {}) => {
  router.push({
    path,
    query,
  });
};
</script>
