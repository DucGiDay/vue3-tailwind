<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import moment from 'moment';
import { getAssetUrl } from '@/common/utils/common';

// Image
import empryIconPath from '@/assets/img/dashboard/empty-daily.png';
const emptyIcon = getAssetUrl(empryIconPath);

// Store/Getter
const invoiceStore = useEInoiveStore();

// Computed
const dailyStatistics = computed(() => invoiceStore.dailyStatistics);
const isEmpty = computed(() => invoiceStore.dailyStatisticsInvoice.every((v) => v === 0));

// Hooks
const { getPrimary, getSurface, isDarkTheme } = useLayout();

// State
const chartData = ref(null);
const chartOptions = ref(null);
const showChart = ref(true);

// Methods
function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: invoiceStore.dailyStatisticsDate,
    datasets: [
      {
        type: 'bar',
        label: 'Subscriptions',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
        data: invoiceStore.dailyStatisticsInvoice,
        barThickness: 70,
      },
    ],
  };
}

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const borderColor = documentStyle.getPropertyValue('--surface-border');
  const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textMutedColor,
          callback: function (_, index) {
            return moment(chartData.value.labels[index]).format('DD/MM');
          },
        },
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textMutedColor,
        },
        grid: {
          color: borderColor,
          borderColor: 'transparent',
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}

// Life cycle
watch(
  [getPrimary, getSurface, isDarkTheme, dailyStatistics],
  async () => {
    showChart.value = false; // unmount Chart
    await nextTick();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    showChart.value = true; // mount lại Chart mới
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <FbCard title="Số lượng hóa đơn theo ngày" class="fb-flex fb-flex-col">
    <Skeleton v-if="dailyStatistics?.isLoading" width="100%" height="16.5rem"></Skeleton>
    <Chart
      v-else-if="!isEmpty && showChart"
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="fb-h-[16.5rem]"
    />
    <div v-else class="fb-flex-1 fb-flex fb-flex-col fb-justify-center fb-items-center">
      <img :src="emptyIcon" alt="Empty image" class="fb-self-center" />
      <span class="fb-text-muted-color">Chưa có hóa đơn theo ngày</span>
    </div>
  </FbCard>
</template>
