<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { getAssetUrl } from '@/common/utils/common';

// Image
import empryIconPath from '@/assets/img/dashboard/empty-status.png';
const emptyIcon = getAssetUrl(empryIconPath);

// Store/Getter
const invoiceStore = useEInoiveStore();

// Hooks
const { getPrimary, getSurface, isDarkTheme } = useLayout();

// State
const pieData = ref(null);
const pieOptions = ref(null);

// Methods
function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  pieData.value = {
    labels: [
      'Hóa đơn hợp lệ',
      'Hóa đơn đã gửi TCTN',
      'Hóa đơn không hợp lệ',
      'Hóa đơn bị từ chối',
      'Hóa đơn tổng hợp',
      'Hóa đơn chưa gửi TCTN',
    ],
    datasets: [
      {
        data: [
          statusInvoices.value?.data?.valid_invoices || 0,
          statusInvoices.value?.data?.sent_invoices || 0,
          statusInvoices.value?.data?.invalid_invoices || 0,
          statusInvoices.value?.data?.rejected_invoices || 0,
          statusInvoices.value?.data?.summarized_invoices || 0,
          statusInvoices.value?.data?.unsend_invoices || 0,
        ],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-green-500'),
          documentStyle.getPropertyValue('--p-primary-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-red-500'),
          documentStyle.getPropertyValue('--p-indigo-500'),
          documentStyle.getPropertyValue('--p-teal-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-green-400'),
          documentStyle.getPropertyValue('--p-primary-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-red-400'),
          documentStyle.getPropertyValue('--p-indigo-400'),
          documentStyle.getPropertyValue('--p-teal-400'),
        ],
      },
    ],
  };

  pieOptions.value = {
    plugins: {
      legend: {
        display: false,
        position: 'right',
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
}

// Computed
const statusInvoices = computed(() => invoiceStore.statusInvoices);
const isEmpty = computed(() => {
  if (statusInvoices.value?.isLoading) return false;
  if (!statusInvoices.value) return true;
  return Object.values(statusInvoices.value?.data || {}).every((v) => v === 0);
});
const legendItems = computed(() => {
  if (!pieData.value) return [];
  return (pieData?.value?.labels || [])
    .map((label, i) => ({
      label,
      color: pieData.value.datasets[0].backgroundColor[i],
      index: i,
      value: pieData.value.datasets[0].data[i],
    }))
    .filter((item) => item.value > 0);
});
const totalValueStatusInvoices = computed(() =>
  legendItems.value.reduce((acc, curr) => acc + curr.value, 0),
);

// onMounted(() => {
//   setColorOptions();
// });
watch(
  [getPrimary, getSurface, isDarkTheme, statusInvoices],
  () => {
    setColorOptions();
  },
  { immediate: true, deep: true },
);
</script>
<template>
  <FbCard title="Trạng thái" class="fb-flex fb-flex-col">
    <div v-if="statusInvoices?.isLoading" class="fb-grid fb-grid-cols-2 fb-gap-4">
      <div class="fb-col-span-1 fb-flex fb-items-center fb-justify-center">
        <Skeleton
          shape="circle"
          size="1rem"
          style="width: 100% !important; aspect-ratio: 1 / 1; height: auto !important"
        ></Skeleton>
      </div>
      <div class="fb-self-center fb-col-span-1">
        <Skeleton width="100%" height="2rem" class="fb-mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem" class="fb-mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem" class="fb-mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem" class="fb-mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem" class="fb-mb-2"></Skeleton>
        <Skeleton width="100%" height="2rem"></Skeleton>
      </div>
    </div>

    <div
      v-else-if="!isEmpty"
      class="fb-flex-col md:fb-flex-row fb-flex fb-items-center fb-justifycenter md:fb-justify-start fb-gap-4"
    >
      <div class="fb-w-48">
        <Chart type="doughnut" :data="pieData" :options="pieOptions" class="fb-w-full fb-h-full" />
      </div>

      <ul class="fb-flex md:fb-flex-col fb-justify-center fb-gap-2 fb-min-w-0 fb-flex-wrap">
        <li
          v-for="item in legendItems"
          :key="item.index"
          class="fb-flex fb-items-start fb-gap-2 fb-text-sm"
        >
          <span
            class="fb-w-3 fb-h-3 fb-rounded-full fb-shrink-0 fb-mt-1.5"
            :style="{ background: item.color }"
          />
          <div>
            <div class="fb-break-words fb-text-muted-color">{{ item.label }}</div>
            <div class="fb-font-medium">
              {{ item.value }} ({{
                ((item.value / totalValueStatusInvoices) * 100).toFixed(2).replace('.00', '')
              }}%)
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="fb-flex-1 fb-flex fb-flex-col fb-justify-center fb-items-center">
      <img :src="emptyIcon" alt="Empty image" class="fb-self-center" />
      <span class="fb-text-muted-color">Chưa có trạng thái</span>
    </div>
  </FbCard>
</template>
