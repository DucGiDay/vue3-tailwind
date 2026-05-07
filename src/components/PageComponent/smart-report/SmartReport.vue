<template>
  <Dialog
    v-model:visible="visible"
    :modal="false"
    position="right"
    :maximizable="true"
    :closable="true"
    :blockScroll="false"
    :style="dialogStyle"
    :draggable="false"
    :breakpoints="{ '575px': '90vw' }"
    :pt="{
      content: {
        class: '!fb-overflow-hidden fb-bg-white',
        style: 'display: flex; flex-direction: column; min-height: 0; padding: 0;'
      },
      header: {
        class: 'fb-cursor-move !fb-p-0 !fb-border-b-0'
      },
      // root: { style: 'resize: both; overflow: auto; min-width: 50vw; min-height: 60vh;' }
      root: {
        style: 'position: relative; min-width: 400px; min-height: 200px; overflow: hidden;'
      }
    }"
    @hide="handleHide"
  >
    <template #header>
      <!-- Handle cạnh trái -->
      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          width: 5px;
          height: 100%;
          cursor: ew-resize;
          z-index: 100;
        "
        @mousedown="startResizeLeft"
      />

      <!-- Handle cạnh trên -->
      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          height: 5px;
          width: 100%;
          cursor: ns-resize;
          z-index: 100;
        "
        @mousedown="startResizeTop"
      />

      <!-- Handle góc trên-trái (kéo 2 chiều cùng lúc) -->
      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          width: 16px;
          height: 16px;
          cursor: nw-resize;
          z-index: 101;
        "
        @mousedown="startResizeCorner"
      />
      <div class="fb-flex fb-w-full fb-items-stretch fb-min-h-[3.25rem]">
        <!-- History Header Section -->
        <Transition name="sr-history">
          <div
            v-if="showHistory"
            class="fb-w-[19.5rem] fb-min-w-[19.5rem] fb-border-r fb-border-[#e9eaeb] fb-p-4 fb-flex fb-items-center"
          >
            <span class="fb-text-sm fb-font-semibold fb-text-gray-900">Lịch sử báo cáo</span>
          </div>
        </Transition>

        <!-- Main Header Section -->
        <div class="fb-flex-1 fb-flex fb-items-center fb-px-4 fb-gap-2">
          <Button
            text
            severity="secondary"
            size="small"
            v-tooltip.top="'Lịch sử báo cáo'"
            @click="showHistory = !showHistory"
          >
            <IconExpandMenu />
          </Button>

          <div class="fb-flex fb-flex-1 fb-items-center fb-justify-center fb-gap-2">
            <IconAI1 class="report_agent--image" />
            <span class="fb-text-[0.9375rem] fb-font-semibold fb-text-gray-900">
              Phân tích báo cáo
            </span>
          </div>

          <div class="fb-flex fb-items-center">
            <Button text severity="secondary" size="small" v-tooltip.top="'Chỉnh sửa'">
              <IconEdit />
            </Button>
            <Button text severity="secondary" size="small" v-tooltip.top="'Làm mới'">
              <IconRefresh />
            </Button>
            <Button text severity="secondary" size="small" v-tooltip.top="'Cài đặt'">
              <IconSetting />
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- Wrapper: flex row khi history mở -->
    <div class="fb-flex fb-flex-1 fb-min-h-0 fb-overflow-hidden">
      <!-- History sidebar -->
      <Transition name="sr-history">
        <SmartReportHistory v-if="showHistory" @select="onSelectHistory" />
      </Transition>

      <!-- Main content container -->
      <div class="fb-flex-1 fb-flex fb-flex-col fb-min-h-0 fb-bg-white">
        <!-- Main Scrollable Content -->
        <div class="fb-flex-1 fb-min-h-0 fb-overflow-y-auto fb-px-5 fb-pt-6 fb-pb-4 custom-scrollbar">
          <template v-if="!isDetailView">
            <IconAI1 class="fb-w-14" />

            <!-- Greeting -->
            <h3 class="fb-text-base fb-font-medium fb-m-0 fb-mb-2">
              Chào bạn! Tôi có thể giúp gì bạn hôm nay?
            </h3>
            <p class="fb-text-sm fb-text-gray-600 fb-leading-relaxed fb-mb-4">
              Bạn có thể chọn
              <span class="fb-font-medium">"Điều chỉnh thiết lập"</span>
              hoặc chọn một cửa hàng, ngày tháng để đưa ra kết quả chính xác, sát thực tế hơn
              <br />
              <strong>(Lưu ý AI chỉ phân tích tối đa 7 ngày)</strong>
            </p>

            <!-- Nút điều chỉnh thiết lập -->
            <div class="fb-flex fb-gap-2 fb-mb-6">
              <Button
                raised
                size="small"
                severity="secondary"
                variant="outlined"
                @click="onOpenSettings"
              >
                Điều chỉnh thiết lập
              </Button>
              <Button
                raised
                size="small"
                severity="secondary"
                variant="outlined"
                @click="showSource = !showSource"
              >
                Test nguồn
              </Button>
            </div>

            <!-- Gợi ý -->
            <div>
              <p class="fb-text-[0.8125rem] fb-text-gray-500 fb-mb-[0.625rem]">Gợi ý</p>
              <div class="fb-flex fb-flex-col fb-gap-2">
                <Button
                  v-for="(s, i) in suggestions"
                  :key="i"
                  text
                  size="small"
                  variant="outlined"
                  severity="secondary"
                  class="fb-flex fb-items-start fb-gap-2 !fb-border !fb-border-gray-200 !fb-rounded-lg !fb-px-[0.875rem] !fb-text-sm !fb-text-gray-700 !fb-text-left !fb-leading-relaxed !fb-justify-start hover:!fb-bg-gray-50 hover:!fb-border-gray-400"
                  @click="onSelectSuggestion(s)"
                >
                  <span class="fb-text-gray-400 fb-flex-shrink-0 fb-mt-[0.0625rem]">↳</span>
                  <span>{{ s }}</span>
                </Button>
              </div>
            </div>
          </template>

          <template v-else>
            <SmartReportDetail @open-source="showSource = true" />
          </template>
        </div>

        <!-- Internal Footer for Main Content -->
        <div
          class="fb-border-t fb-border-gray-100 fb-px-5 fb-py-3 fb-flex fb-items-center fb-flex-wrap fb-gap-2"
        >
          <FbSelectSingleStore v-model="selectedStore" />
          <FbDateSelect size="small" />
          <Button size="small" raised class="fb-ml-auto" @click="onAnalyze">Phân tích mới</Button>
        </div>
      </div>
      <!-- END Main content container -->

      <!-- Source panel (right) -->
      <Transition name="sr-source">
        <SmartReportSource v-if="showSource" />
      </Transition>
    </div>
  </Dialog>
</template>

<script setup>
import { useDialogResize } from '@/common/composables/useDialogResize';

import { ref, computed } from 'vue';
import moment from 'moment';
import { useGlobalStore } from '@/stores/global.store';
import IconAI1 from '@/components/Common/Icon/IconAI1.vue';
import FbSelectSingleStore from '@/components/Common/FbSelectSingleStore.vue';
import SmartReportHistory from './SmartReportHistory.vue';
import SmartReportSource from './SmartReportSource.vue';
import SmartReportDetail from './SmartReportDetail.vue';
const { dialogWidth, dialogHeight, startResizeLeft, startResizeTop, startResizeCorner } =
  useDialogResize(400, 200);

const globalStore = useGlobalStore();

const props = defineProps({
  // qiankun sẽ truyền các hàm/biến từ Host vào đây
  onClose: {
    type: Function,
    default: () => {}
  }
});

// Biến nội bộ để điều khiển Dialog trong sub-app
const visible = ref(true);
const showHistory = ref(false);
const showSource = ref(false);
const isDetailView = ref(false);

// const dialogStyle = computed(() => {
//   const baseWidth = 50; // vw
//   const sourceWidth = showSource.value ? 18 : 0; // vw
//   const historyWidth = showHistory.value ? '19.5rem' : '0rem';

//   return {
//     width: `min(92vw, calc(${baseWidth + sourceWidth}vw + ${historyWidth}))`,
//     height: '60vh',
//     transition: 'width 0.25s ease'
//   };
// });
const dialogStyle = computed(() => {
  const baseWidth = 50;
  const sourceWidth = showSource.value ? 18 : 0;
  const historyWidth = showHistory.value ? '19.5rem' : '0rem';

  return {
    width: dialogWidth.value
      ? dialogWidth.value + 'px'
      : `min(92vw, calc(${baseWidth + sourceWidth}vw + ${historyWidth}))`,
    height: dialogHeight.value ? dialogHeight.value + 'px' : '60vh',
    transition: dialogWidth.value || dialogHeight.value ? 'none' : 'width 0.25s ease'
  };
});

const selectedStore = ref(null);
const dateRange = ref([
  moment().subtract(7, 'days').startOf('day').toDate(),
  moment().subtract(1, 'days').endOf('day').toDate()
]);

const suggestions = ref([
  "Tuần này quán đang 'vượt đỉnh' hay 'hụt hơi' so với phong độ 3 tháng qua?",
  "Tìm ra 'cỗ máy in tiền' thực sự: Món nào đang gánh team cho quán?",
  'Cảnh báo: Khách đang ít đi hay khách vào nhưng chi tiền ít hơn?',
  "Lộ diện 'siêu sao' doanh thu: Bạn có đang bỏ lỡ cơ hội upsell món này?",
  "Bắt mạch xu hướng: Quán đang tăng trưởng bền vững hay chỉ là 'sốt ảo'?"
]);

const handleHide = () => {
  if (typeof props.onClose === 'function') {
    props.onClose();
  }
};

const onOpenSettings = () => {
  console.log(globalStore?.storesPermissionActive);

  console.log('Open settings');
};

const onSelectSuggestion = (text) => {
  console.log('Selected suggestion:', text);
  isDetailView.value = true;
};

const onAnalyze = () => {
  console.log('Analyze with store:', selectedStore.value, 'date:', dateRange.value);
  isDetailView.value = false;
};

const onSelectHistory = (item) => {
  console.log('Selected history:', item);
  isDetailView.value = true;
};
</script>

<style scoped lang="scss">
/* Transition width 0→auto cho history panel — không thể dùng Tailwind */
.sr-history-enter-active,
.sr-history-leave-active,
.sr-source-enter-active,
.sr-source-leave-active {
  transition:
    width 0.25s ease,
    opacity 0.2s ease;
  overflow: hidden;
}

.sr-history-enter-from,
.sr-history-leave-to,
.sr-source-enter-from,
.sr-source-leave-to {
  width: 0 !important;
  min-width: 0 !important;
  opacity: 0;
}
</style>
