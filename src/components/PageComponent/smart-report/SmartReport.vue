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
        style: 'display: flex; flex-direction: column; height: 100%; min-height: 0; padding: 0;'
      },
      header: {
        class: 'fb-cursor-move !fb-p-0 !fb-border-b-0'
      },
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
      <!-- Handle góc trên-trái -->
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
            :severity="showHistory ? 'primary' : 'secondary'"
            size="small"
            :class="showHistory && '!fb-bg-primary-50'"
            v-tooltip.top="showHistory ? '' : 'Lịch sử báo cáo'"
            @click="showHistory = !showHistory"
          >
            <IconExpandMenu color="currentColor" />
          </Button>

          <div class="fb-flex fb-flex-1 fb-items-center fb-justify-center fb-gap-2">
            <IconAI1 class="report_agent--image" />
            <span class="fb-text-[0.9375rem] fb-font-semibold fb-text-gray-900">
              Phân tích báo cáo
            </span>
          </div>

          <div class="fb-flex fb-items-center">
            <Button
              text
              severity="secondary"
              size="small"
              v-tooltip.top="'Khôi phục kích thước'"
              :disabled="isLoadingAIReport"
              @click="onResetSize"
            >
              <IconRefresh />
            </Button>
            <Button
              text
              severity="secondary"
              size="small"
              v-tooltip.top="'Cấu hình nhà hàng'"
              @click="onGoToInitial"
            >
              <IconSetting />
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- Wrapper: flex row khi history hoặc source mở -->
    <div class="fb-flex fb-flex-1 fb-min-h-0 fb-overflow-hidden">
      <!-- History sidebar -->
      <Transition name="sr-history">
        <SmartReportHistory v-if="showHistory" ref="historyRef" @select="onSelectHistory" />
      </Transition>

      <!-- Main content container -->
      <div class="fb-flex-1 fb-flex fb-flex-col fb-min-h-0 fb-bg-white">
        <!-- Main Scrollable Content -->
        <div
          class="fb-flex-1 fb-min-h-0 fb-overflow-y-auto fb-px-5 fb-pt-6 fb-pb-4 custom-scrollbar"
          @scroll="handleScrollBody"
        >
          <!-- Loading state -->
          <div
            v-if="isLoadingAIReport"
            class="fb-h-full fb-flex fb-flex-col fb-items-center fb-justify-center fb-gap-4"
          >
            <IconAI1 class="fb-w-14 fb-animate-spin" />
            <span class="analyzing-text fb-text-sm fb-text-gray-500">Đang phân tích</span>
          </div>

          <!-- Preload / Initial state -->
          <template v-else-if="isDetailView === 0">
            <IconAI1 class="fb-w-14 fb-mb-4" />

            <h3 class="fb-text-base fb-font-medium fb-m-0 fb-mb-2">
              Chào bạn! Tôi có thể giúp gì bạn hôm nay?
            </h3>
            <p class="fb-text-sm fb-text-gray-600 fb-leading-relaxed fb-mb-1">
              Bạn có thể chọn
              <span class="fb-font-medium">"Điều chỉnh thiết lập"</span>
              hoặc chọn một cửa hàng, ngày tháng để đưa ra kết quả chính xác, sát thực tế hơn
            </p>
            <p
              :class="[
                'fb-text-sm fb-leading-relaxed fb-mb-4',
                errorInvalidDate === 7 ? 'fb-text-error-500' : 'fb-text-gray-600',
                { shake: shakeActive && errorInvalidDate === 7 }
              ]"
            >
              <strong>(Lưu ý AI chỉ phân tích tối đa 7 ngày)</strong>
            </p>
            <p
              v-show="errorInvalidDate === 10"
              :class="[
                'fb-text-sm fb-mb-4',
                {
                  'fb-text-red-500': errorInvalidDate === 10,
                  shake: shakeActive && errorInvalidDate === 10
                }
              ]"
            >
              (Vui lòng chọn ngày trong quá khứ)
            </p>

            <div class="fb-flex fb-gap-2 fb-mb-6">
              <!-- TODO: Form - hiện tại chưa cần -->
              <!-- <Button raised size="small" severity="secondary" variant="outlined" @click="onOpenSettings">
                Điều chỉnh thiết lập
              </Button> -->
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
                  :disabled="!storeUid"
                  @click="onSelectSuggestion(s)"
                >
                  <span class="fb-text-gray-400 fb-flex-shrink-0 fb-mt-[0.0625rem]">↳</span>
                  <span>{{ s }}</span>
                </Button>
              </div>
            </div>
          </template>

          <!--  Error text -->
          <template v-else-if="isDetailView === 1">
            <div class="fb-text-sm fb-text-red-500 fb-mb-4">
              {{ errorText }}
            </div>
          </template>

          <!-- Preview content -->
          <template v-else-if="isDetailView === 2">
            <div class="markdown_content-smart-report" v-html="previewContent" />
          </template>

          <!-- Result / Detail state -->
          <template v-else>
            <SmartReportDetail
              ref="detailRef"
              :history="history"
              :is-loading="isLoadMore"
              :is-weekly="isWeekly"
              :active-citation="selectedCitation"
              @update:history="handleGenerateReport($event, false)"
              @change-favorite="onChangeFavorite"
              @show-citation="handleShowCitation"
            />
          </template>
        </div>

        <!-- Footer -->
        <div
          class="fb-border-t fb-border-gray-100 fb-px-5 fb-py-3 fb-flex fb-items-center fb-flex-wrap fb-gap-2"
        >
          <FbSelectSingleStore v-model="selectedStore" size="small" />
          <FbDateSelect size="small" v-model="dateRange" />
          <Button
            size="small"
            raised
            class="fb-ml-auto"
            :disabled="!storeUid || isLoadingAIReport"
            @click="checkStoreAIReport"
          >
            Phân tích mới
          </Button>
        </div>
      </div>
      <!-- END Main content container -->

      <!-- Source / Citation panel (right) -->
      <Transition name="sr-source">
        <SmartReportSource v-if="showSource" :citation="selectedCitation" @close="closeSource" />
      </Transition>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';
import { useGlobalStore } from '@/stores/global.store';
import { useSmartReportStore, toTimestampFrom, toTimestampTo } from '@/stores/smart-report.store';
import { useDialogResize } from '@/common/composables/useDialogResize';

import IconAI1 from '@/components/Common/Icon/IconAI1.vue';
import IconExpandMenu from '@/components/Common/Icon/IconExpandMenu.vue';
import IconRefresh from '@/components/Common/Icon/IconRefresh.vue';
import IconSetting from '@/components/Common/Icon/IconSetting.vue';
import FbSelectSingleStore from '@/components/Common/FbSelectSingleStore.vue';
import SmartReportHistory from './SmartReportHistory.vue';
import SmartReportSource from './SmartReportSource.vue';
import SmartReportDetail from './SmartReportDetail.vue';
import MarkdownItPlugin from '@/common/plugins/markdown-it';

// ─── Markdown ─────────────────────────────────────────────────────────────────
const md = MarkdownItPlugin.md;

// TODO: Form & Feedback - chưa cần
// import SmartReportForm from './SmartReportForm.vue';
// import SmartReportFeedback from './SmartReportFeedback.vue';

// ─── Composables ──────────────────────────────────────────────────────────────
const toast = useToast();
const globalStore = useGlobalStore();
const srStore = useSmartReportStore();
const { dialogWidth, dialogHeight, startResizeLeft, startResizeTop, startResizeCorner } =
  useDialogResize(400, 200);

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  onClose: { type: Function, default: () => {} },
  reportType: { type: String }
});

// ─── Refs ─────────────────────────────────────────────────────────────────────
const historyRef = ref(null);
const detailRef = ref(null);

// ─── UI State ─────────────────────────────────────────────────────────────────
const visible = ref(true);
const showHistory = ref(false);
const showSource = ref(false);
const isDetailView = ref(0);
const a = ref(0); // 0: initial, 1: error, 2: preview, 3: detail

// ─── Data State ───────────────────────────────────────────────────────────────
const history = ref([]);
const isLoadingAIReport = ref(false);
const isLoadMore = ref(false);
const isWeekly = ref(false);
const errorText = ref('');
const shakeActive = ref(false);
const storeObject = ref({});
const selectedCitation = ref(null);
const lastLoggedSessionKey = ref('');

// ─── Store / Date ─────────────────────────────────────────────────────────────
const selectedStore = ref(null); // uid string từ FbSelectSingleStore
const dateRange = ref([
  moment().subtract(7, 'days').startOf('day').toDate(),
  moment().subtract(1, 'days').endOf('day').toDate()
]);

// ─── Store Getters (Pinia) ────────────────────────────────────────────────────
const detailSession = computed(() => srStore.detailSession);
const detailSessionWeek = computed(() => srStore.detailSessionWeek);
const firstMessageOfDetailSession = computed(() => srStore.firstMessageOfDetailSession);
const dataAgentReport = computed(() => srStore.dataAgentReport);

// Global store (brand/company info)
const getCompanyUid = computed(() => globalStore.currentUser?.company_uid);
const brandUid = computed(() => globalStore.brandUid);
const currentUser = computed(() => globalStore.currentUser);

// ─── Computed ─────────────────────────────────────────────────────────────────
const storeUid = computed(() => selectedStore.value);
const previewContent = computed(() => {
  const firstMessage = firstMessageOfDetailSession.value;

  const citations = (firstMessage?.citations || []).map((e) => ({
    ...e,
    title: e.title.replace('[', '[^').replace(']', ']:')
  }));

  return md.render(
    (dataAgentReport.value?.text ||
      firstMessage?.conclude ||
      firstMessage?.content ||
      firstMessage?.overview ||
      'Có lỗi xảy ra, xin vui lòng thử lại') +
      '\n' +
      (citations.map((e) => e.title).join('\n') || '')
  );
});

const errorInvalidDate = computed(() => {
  if (!dateRange.value || dateRange.value.length < 2) return 0;
  const [start, end] = dateRange.value;
  const diffDays = Math.ceil(Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  return diffDays > 7 ? 7 : endDay.getTime() >= today.getTime() ? 10 : 0;
});

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

const suggestions = ref([
  "Tuần này quán đang 'vượt đỉnh' hay 'hụt hơi' so với phong độ 3 tháng qua?",
  "Tìm ra 'cỗ máy in tiền' thực sự: Món nào đang gánh team cho quán?",
  'Cảnh báo: Khách đang ít đi hay khách vào nhưng chi tiền ít hơn?',
  "Lộ diện 'siêu sao' doanh thu: Bạn có đang bỏ lỡ cơ hội upsell món này?",
  "Bắt mạch xu hướng: Quán đang tăng trưởng bền vững hay chỉ là 'sốt ảo'?"
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const logEvent = (eventName) => {
  try {
    window.$gtag?.event(eventName);
  } catch {}
  try {
    window.$clarity?.('event', eventName);
  } catch {}
  srStore.loggingEventAI({ report_key: eventName.toLowerCase(), email: currentUser.value?.email });
};

const buildHistoryItem = (item) => {
  const text =
    (item?.overview || '') +
    '  \n  \n\n' +
    (item?.analysis_details || '') +
    '  \n  \n\n' +
    (item?.conclude || '');
  return {
    id: item?._id || srStore.detailSession?.message_id,
    feedback: item?.feedback || 0,
    citations: item?.citations || [],
    role: item?.role || 'assistant',
    content: [
      {
        type: item?.role === 'user' ? 'input_text' : 'output_text',
        text: item?.content || text || ''
      }
    ]
  };
};

// ─── Methods ──────────────────────────────────────────────────────────────────
const handleHide = () => {
  // TODO: Feedback - canShowFeedback() → showFeedback
  if (typeof props.onClose === 'function') {
    props.onClose();
  }
};

const onGoToInitial = () => {
  isDetailView.value = 0;
  history.value = [];
  errorText.value = '';
  srStore.setDetailSession({});
};

const onResetSize = () => {
  dialogWidth.value = 0;
  dialogHeight.value = 0;
};

const handleShowCitation = (citation) => {
  selectedCitation.value = null;
  showHistory.value = false;
  showSource.value = true;
  selectedCitation.value = citation;
};

const closeSource = () => {
  showSource.value = false;
  selectedCitation.value = null;
};

const handleScrollBody = (e) => {
  if (!isDetailView.value) return;
  const { scrollTop, offsetHeight, scrollHeight } = e.target;
  const scrollPercent = (scrollTop + offsetHeight) / scrollHeight;
  const currentKey = `${detailSession.value?.session_id}_${detailSessionWeek.value?.session_id}`;
  if (scrollPercent >= 0.7 && lastLoggedSessionKey.value !== currentKey) {
    lastLoggedSessionKey.value = currentKey;
    logEvent('SMART_REPORT_SCROLL_70_PERCENT');
  }
};

const onChangeFavorite = () => {
  historyRef.value?.getData(false, true);
};

const triggerShake = () => {
  shakeActive.value = true;
  setTimeout(() => {
    shakeActive.value = false;
  }, 400);
};

// ─── Core: Generate Report ─────────────────────────────────────────────────────
const handleGenerateReport = async (
  { history: historyParam = null, stopImmediate = false, customPayload = {} } = {},
  isLoadingFullBody = true
) => {
  errorText.value = '';

  const payload = {
    brand_uid: brandUid.value,
    company_uid: getCompanyUid.value,
    start_date: toTimestampFrom(dateRange.value[0]),
    end_date: toTimestampTo(dateRange.value[1]),
    report_type: props?.reportType || 'both',
    store_uid: storeUid.value,
    store_name: globalStore.storesById?.[storeUid.value]?.store_name,
    method: 'prompt',
    ...customPayload
  };

  if (historyParam) {
    history.value = historyParam;
    payload.history = historyParam.map((e) => ({ role: e.role, content: e.content }));
  } else {
    history.value = [];
    // isDetailView.value = 0;
  }

  if (srStore.detailSession?.session_id) {
    payload.session_id = srStore.detailSession.session_id;
  }

  if (stopImmediate) return;

  isLoadingAIReport.value = isLoadingFullBody;
  isLoadMore.value = true;

  const res = await srStore.generateReport(payload);

  isLoadMore.value = false;
  isLoadingAIReport.value = false;

  errorText.value = firstMessageOfDetailSession.value?.text || '';

  if (errorText.value) {
    // Show lỗi
    isDetailView.value = 1;
  } else if (srStore.dataAgentReport?.code === 202) {
    // Chưa cấu hình store -> show preview
    isDetailView.value = 0;
  } else if (!historyParam) {
    // Đã có history -> đang trong 1 luồng chat
    isDetailView.value = 2;
  } else {
    // Chưa có history -> bắt đầu 1 session mới -> show preview
    isDetailView.value = 3;
  }

  history.value = (srStore.detailSession?.messages || []).map(buildHistoryItem);
  console.log('generateReport', res);
  if (res?.success && !res?.data?.cached) {
    historyRef.value?.getData(true);
  }
};

// ─── Core: Check Store & Trigger Report ──────────────────────────────────────
const checkStoreAIReport = async () => {
  if (!!errorInvalidDate.value) {
    triggerShake();
    return;
  }
  if (!storeUid.value) return;

  // Nếu đang có data & không lỗi → không generate lại
  if (history.value.length > 0 && !!isDetailView.value && !errorText.value) {
    return;
  }

  try {
    isLoadingAIReport.value = true;
    const res = await srStore.checkStore({
      brand_uid: brandUid.value,
      company_uid: getCompanyUid.value,
      id: storeUid.value
    });

    if (res.data) {
      storeObject.value = res?.data || {};
      logEvent('SMART_REPORT_GENERATE_NEW_REPORT');
      // TODO: Form - bỏ qua check infor_report_analyzer, generate thẳng
      await handleGenerateReport();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Có lỗi xảy ra',
      life: 3000
    });
  } finally {
    isLoadingAIReport.value = false;
  }
};

// ─── Select History ───────────────────────────────────────────────────────────
const onSelectHistory = async ({ sessionId, type }) => {
  // type: 'recent' | 'weekly' | 'knowledge'
  isDetailView.value = 3;
  isWeekly.value = type !== 'recent';
  errorText.value = '';

  if (isLoadingAIReport.value) return;
  history.value = [];

  logEvent('SMART_REPORT_OPEN_REPORT_DETAIL');

  try {
    isLoadingAIReport.value = true;

    if (type !== 'recent') {
      await srStore.getWeekSessionDetail({ session_id: sessionId });
      const item = srStore.detailSessionWeek?.report_data;
      const text =
        (item?.overview || '') +
        '  \n  \n\n' +
        (item?.analysis_details || '') +
        '  \n  \n\n' +
        (item?.conclude || '');
      history.value = [
        {
          role: 'assistant',
          citations: item?.citations || [],
          content: [{ type: 'output_text', text: text || '' }]
        }
      ];
    } else {
      await srStore.getSessionDetail(sessionId);
      history.value = (srStore.detailSession?.messages || []).map(buildHistoryItem);
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Có lỗi xảy ra',
      life: 3000
    });
  } finally {
    isLoadingAIReport.value = false;
  }
};

// ─── Select suggestion from preload ───────────────────────────────────────────
const onSelectSuggestion = async (text) => {
  if (!storeUid.value || !!errorInvalidDate.value) {
    triggerShake();
    return;
  }
  // Trigger generate, rồi add câu hỏi vào history
  await checkStoreAIReport();
};

// ─── Watch ────────────────────────────────────────────────────────────────────
watch(selectedStore, () => {
  history.value = [];
  isDetailView.value = 0;
  errorText.value = '';
  srStore.setDetailSession({});
});

watch(
  dateRange,
  () => {
    history.value = [];
    isDetailView.value = 0;
    errorText.value = '';
    srStore.setDetailSession({});
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
/* Transition width 0→auto cho history / source panel */
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

.shake {
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}

/* Logo xoay khi loading */
.fb-animate-spin {
  animation: spin 1s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.analyzing-text {
  position: relative;
  display: inline-block;
  background: linear-gradient(
    90deg,
    currentColor 0%,
    currentColor 40%,
    rgba(255, 255, 255, 0.8) 50%,
    currentColor 60%,
    currentColor 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer-text 2s linear infinite;
}

@keyframes shimmer-text {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
