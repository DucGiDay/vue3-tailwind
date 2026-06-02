<template>
  <div class="fb-flex fb-flex-col fb-gap-5" ref="containerRef">
    <!-- Chat Flow List -->
    <div class="fb-flex fb-flex-col fb-gap-8">
      <div v-for="(msg, index) in chatMessages" :key="index" class="fb-flex fb-flex-col">
        <!-- User Message -->
        <div v-if="msg.role === 'user'" class="fb-flex fb-justify-end fb-mb-2">
          <div
            class="fb-max-w-[85%] fb-bg-[#f4f4f5] fb-text-gray-800 fb-px-4 fb-py-2.5 fb-rounded-[1.25rem] fb-rounded-tr-none fb-text-sm fb-leading-relaxed"
          >
            {{ msg.text }}
          </div>
        </div>

        <!-- AI Assistant Message -->
        <div v-else class="fb-flex fb-gap-3">
          <!-- AI Avatar -->
          <div class="fb-flex-shrink-0">
            <div
              class="fb-w-8 fb-h-8 fb-rounded-full fb-bg-blue-50 fb-flex fb-items-center fb-justify-center fb-border fb-border-blue-100"
            >
              <IconAI1 class="fb-w-5 fb-h-5" />
            </div>
          </div>

          <!-- Content Bubble -->
          <div class="fb-flex-1 fb-min-w-0">
            <!-- Markdown content -->
            <div class="fb-text-sm fb-text-gray-700 fb-leading-relaxed">
              <div
                class="markdown_content-smart-report"
                v-html="renderMd(msg.text, msg.citations)"
                @click="handleCitationClick($event, msg)"
              />
            </div>

            <!-- Action Bar -->
            <div class="fb-flex fb-items-center fb-justify-between fb-mt-3">
              <div class="fb-flex fb-items-center fb-gap-1">
                <!-- Copy -->
                <Button
                  text
                  severity="secondary"
                  size="small"
                  class="!fb-w-8 !fb-h-8 !fb-p-2"
                  v-tooltip.top="'Sao chép'"
                  @click="copyToClipboard(msg.text)"
                >
                  <IconCopy color="currentColor" />
                </Button>

                <!-- Like -->
                <Button
                  v-if="!isWeekly"
                  text
                  :severity="msg.feedback === 1 ? 'primary' : 'secondary'"
                  size="small"
                  class="!fb-w-8 !fb-h-8 !fb-p-2"
                  v-tooltip.top="'Hữu ích'"
                  :disabled="!!loadingFeedback[index]"
                  @click="sendFeedback(msg.id, index, msg.feedback === 1 ? 0 : 1, 'like')"
                >
                  <ProgressSpinner
                    v-if="loadingFeedback[index] === 'like'"
                    style="width: 14px; height: 14px"
                    strokeWidth="6"
                  />
                  <IconLike v-else :filled="msg.feedback === 1" />
                </Button>

                <!-- Dislike -->
                <Button
                  v-if="!isWeekly"
                  text
                  :severity="msg.feedback === 2 ? 'primary' : 'secondary'"
                  size="small"
                  class="!fb-w-8 !fb-h-8 !fb-p-2"
                  v-tooltip.top="'Không hữu ích'"
                  :disabled="!!loadingFeedback[index]"
                  @click="sendFeedback(msg.id, index, msg.feedback === 2 ? 0 : 2, 'dislike')"
                >
                  <ProgressSpinner
                    v-if="loadingFeedback[index] === 'dislike'"
                    style="width: 14px; height: 14px"
                    strokeWidth="6"
                  />
                  <IconDislike v-else :filled="msg.feedback === 2" />
                </Button>

                <!-- Audio -->
                <OutputAudio :reportContent="msg.text" class="!fb-w-8 !fb-h-8 !fb-p-2" />
              </div>

              <!-- Save Knowledge (chỉ weekly) -->
              <Button
                v-if="isWeekly"
                text
                severity="warning"
                size="small"
                class="!fb-text-[0.8125rem] !fb-font-medium !fb-p-0 hover:fb-underline"
                :disabled="isLoadingSave"
                @click="onSaveKnowledge"
              >
                <ProgressSpinner
                  v-if="isLoadingSave"
                  style="width: 14px; height: 14px"
                  strokeWidth="6"
                  class="fb-mr-1"
                />
                <IconSave v-else :filled="detailSessionWeek?.is_favorite" class="fb-mr-1" />
                {{ detailSessionWeek?.is_favorite ? 'Đã lưu kiến thức' : 'Lưu kiến thức' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator (isLoadMore) -->
      <div v-if="isLoading" class="fb-flex fb-items-center fb-gap-3 fb-mb-3">
        <div
          class="fb-w-8 fb-h-8 fb-rounded-full fb-bg-blue-50 fb-flex fb-items-center fb-justify-center fb-border fb-border-blue-100"
        >
          <IconAI1 class="fb-w-5 fb-h-5 logo-loader" />
        </div>
        <span class="analyzing-text fb-text-sm fb-text-gray-500">Đang phân tích</span>
      </div>
    </div>

    <!-- Gợi ý -->
    <div v-if="!isWeekly" class="fb-mt-2">
      <p class="fb-text-[0.8125rem] fb-text-gray-500 fb-mb-3">Gợi ý</p>
      <div class="fb-flex fb-flex-col fb-gap-2">
        <Button
          v-for="(q, i) in listQuestionAgent || []"
          :key="i"
          text
          size="small"
          variant="outlined"
          severity="secondary"
          :disabled="isLoading"
          class="fb-flex fb-items-start fb-gap-2 !fb-border !fb-border-gray-200 !fb-rounded-lg !fb-px-[0.875rem] !fb-text-sm !fb-text-gray-700 !fb-text-left !fb-leading-relaxed !fb-justify-start hover:!fb-bg-gray-50 hover:!fb-border-gray-400"
          :class="{ 'fb-cursor-not-allowed fb-opacity-60': isLoading }"
          @click="onSendQuestion(q)"
        >
          <span class="fb-text-gray-400 fb-flex-shrink-0 fb-mt-[0.0625rem]">↳</span>
          <span>{{ q }}</span>
        </Button>
      </div>
    </div>

    <!-- Scroll anchor -->
    <div ref="scrollAnchorRef" />

    <!-- Scroll to bottom button -->
    <div
      v-if="showScrollButton"
      class="fb-fixed fb-bottom-20 fb-right-6 fb-cursor-pointer fb-flex fb-items-center fb-justify-center fb-w-9 fb-h-9 fb-rounded-full fb-bg-white fb-shadow-md fb-border fb-border-gray-200 hover:fb-bg-gray-50"
      @click="scrollToBottom"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 4.166v11.667M10 15.833l5.833-5.833M10 15.833l-5.833-5.833"
          stroke="#414651"
          stroke-width="1.667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useSmartReportStore } from '@/stores/smart-report.store';
import { smartReportService } from '@/api/services/smart-report/smart-report.service';
import MarkdownItPlugin from '@/common/plugins/markdown-it';
import IconAI1 from '@/components/Common/Icon/IconAI1.vue';
import IconCopy from '@/components/Common/Icon/IconCopy.vue';
import IconLike from '@/components/Common/Icon/IconLike.vue';
import IconDislike from '@/components/Common/Icon/IconDislike.vue';
import IconSave from '@/components/Common/Icon/IconSave.vue';
import OutputAudio from './OutputAudio.vue';

// ─── Markdown ─────────────────────────────────────────────────────────────────
const md = MarkdownItPlugin.md;

// Override: ảnh → link
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;
  const title = token.attrGet('title');
  return `<a href="${src}" target="_blank" rel="noopener noreferrer">
    <img src="${src}" alt="${alt || 'Image'}" title="${title || 'Click để xem ảnh full size'}" style="cursor:pointer;" />
  </a>`;
};

// Override: footnote_ref → citation button
md.renderer.rules.footnote_ref = (tokens, idx) => {
  const id = tokens[idx].meta.id + 1;
  const label = tokens[idx].meta.label;
  const caption = tokens[idx].meta.subId > 0 ? `${id}:${tokens[idx].meta.subId}` : `${id}`;
  return `<a id="fnref${caption}" href="#fn${label}" data-label="${label}"
    style="border-radius:9999px;color:#fff!important;background-color:#A4A7AE;border-color:#A4A7AE;"
    class="btn btn-secondary py-0 btn-sm ml-1 citation-link">Nguồn</a>`;
};

const fixMarkdownImageUrls = (content) =>
  content.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^)]*\([^)]*\)[^)]*)\)/g,
    (match, alt, url) => `![${alt}](<${url}>)`
  );

const renderMd = (text, citations = []) => {
  const citationRefs = citations
    .map((e) => ({ ...e, title: e.title.replace('[', '[^').replace(']', ']:') }))
    .map((e) => e.title)
    .join('\n');
  return md.render(fixMarkdownImageUrls((text || '') + '\n' + citationRefs));
};

// ─── Props & Emits ────────────────────────────────────────────────────────────
const props = defineProps({
  history: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  isWeekly: { type: Boolean, default: false },
  activeCitation: { type: Object, default: () => null }
});

const emit = defineEmits(['update:history', 'change-favorite', 'show-citation']);

// ─── Store & Toast ────────────────────────────────────────────────────────────
const toast = useToast();
const srStore = useSmartReportStore();
const listQuestionAgent = computed(() => srStore.listQuestionAgent);
const detailSession = computed(() => srStore.detailSession);
const detailSessionWeek = computed(() => srStore.detailSessionWeek);

// ─── Refs ─────────────────────────────────────────────────────────────────────
const containerRef = ref(null);
const scrollAnchorRef = ref(null);

// ─── State ────────────────────────────────────────────────────────────────────
const showScrollButton = ref(false);
const isLoadingSave = ref(false);
// loadingFeedback: index → 'like' | 'dislike' | null
const loadingFeedback = ref({});

// ─── Computed: chatMessages từ history prop ────────────────────────────────────
const chatMessages = computed(() => {
  const msgs = [];

  // "Xem chi tiết" message đầu tiên (chỉ daily)
  if (!props.isWeekly) {
    msgs.push({ role: 'user', text: 'Xem chi tiết', citations: [] });
  }

  for (const item of props.history) {
    msgs.push({
      id: item.id,
      feedback: item.feedback,
      citations: item.citations || [],
      role: item.role,
      text: item.content?.[0]?.text || ''
    });
  }

  return msgs;
});

// ─── Scroll ───────────────────────────────────────────────────────────────────
let scrollableBody = null;

const handleScroll = () => {
  if (!scrollableBody) return;
  const { scrollHeight, scrollTop, clientHeight } = scrollableBody;
  showScrollButton.value = scrollHeight - scrollTop - clientHeight > 50;
};

const scrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      scrollAnchorRef.value?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  });
};

onMounted(() => {
  // Tìm scrollable parent (body của Dialog)
  scrollableBody = containerRef.value?.closest('.fb-overflow-y-auto');
  if (scrollableBody) {
    scrollableBody.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (scrollableBody) {
    scrollableBody.removeEventListener('scroll', handleScroll);
  }
});

// ─── Watch: scroll to bottom khi history thay đổi ─────────────────────────────
watch(
  () => props.history,
  () => {
    loadingFeedback.value = {};
    nextTick(() => {
      updateCitationStyles(props.activeCitation);
    });
  },
  { deep: true }
);

watch(
  () => props.activeCitation,
  (newVal) => {
    nextTick(() => updateCitationStyles(newVal));
  }
);

// ─── Citation ─────────────────────────────────────────────────────────────────
const handleCitationClick = (event, msg) => {
  const target = event.target.closest('.citation-link');
  if (!target) return;
  event.preventDefault();
  const label = target.getAttribute('data-label');
  const citation = (msg.citations || []).find((c) => {
    const match = c.title.match(/\[(\d+)\]/);
    return match && match[1] === label;
  });
  if (citation) {
    emit('show-citation', citation);
  }
};

const updateCitationStyles = (citation) => {
  if (!containerRef.value) return;
  let activeLabel = null;
  if (citation) {
    const match = citation.title.match(/\[(\d+)\]/);
    if (match) activeLabel = match[1];
  }
  containerRef.value.querySelectorAll('.citation-link').forEach((link) => {
    const label = link.getAttribute('data-label');
    if (activeLabel && label === activeLabel) {
      link.classList.add('btn-primary');
      link.classList.remove('btn-secondary');
      link.style.backgroundColor = '';
      link.style.borderColor = '';
    } else {
      link.classList.remove('btn-primary');
      link.classList.add('btn-secondary');
      link.style.backgroundColor = '#A4A7AE';
      link.style.borderColor = '#A4A7AE';
    }
  });
};

// ─── Copy ─────────────────────────────────────────────────────────────────────
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text || '');
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã sao chép!', life: 2000 });
  } catch {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể sao chép', life: 2000 });
  }
};

// ─── Feedback (Like / Dislike) ────────────────────────────────────────────────
const sendFeedback = async (id, index, feedback, type) => {
  loadingFeedback.value = { ...loadingFeedback.value, [index]: type };
  try {
    await smartReportService.sendFeedback({ message_id: id, feedback });
    // Cập nhật feedback trong history qua emit
    const offset = props.isWeekly ? 0 : 1;
    const updated = props.history.map((item, i) => {
      if (i === index - offset && item.role === 'assistant') {
        return { ...item, feedback };
      }
      return item;
    });
    emit('update:history', { history: updated, stopImmediate: true });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Gửi đánh giá thất bại',
      life: 3000
    });
  } finally {
    loadingFeedback.value = { ...loadingFeedback.value, [index]: null };
  }
};

// ─── Save Knowledge (weekly) ──────────────────────────────────────────────────
const onSaveKnowledge = async () => {
  if (isLoadingSave.value) return;
  isLoadingSave.value = true;
  try {
    const callFunc = detailSessionWeek.value?.is_favorite
      ? smartReportService.delFavoriteReport
      : smartReportService.setFavoriteReport;
    const res = await callFunc({
      session_id: detailSessionWeek.value.session_id,
      company_uid: srStore.companyUid
    });
    if (res.success) {
      srStore.setWeekSessionDetail({
        ...detailSessionWeek.value,
        is_favorite: res.data?.data?.is_favorite
      });
      emit('change-favorite');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingSave.value = false;
  }
};

// ─── Send Question (gợi ý) ────────────────────────────────────────────────────
const onSendQuestion = (question) => {
  if (props.isLoading) return;

  const sessionStr = detailSession.value?.session_id || '';
  const parts = sessionStr.split('-');
  const endDate = parts[parts.length - 1];
  const startDate = parts[parts.length - 2];

  const userMsg = {
    role: 'user',
    content: [{ type: 'input_text', text: question }]
  };

  const newHistory = [...props.history, userMsg];

  emit('update:history', {
    history: newHistory,
    customPayload: {
      start_date: +startDate,
      end_date: +endDate,
      store_uid: detailSession.value?.store_uid,
      store_name: detailSession.value?.store_uid,
      session_id: detailSession.value?.session_id,
      report_type: (detailSession.value?.session_id || '').split('-')[0],
      brand_uid: detailSession.value?.brand_uid
    }
  });
};
</script>

<style lang="scss" scoped>
/* Logo xoay khi loading */
.logo-loader {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Shimmer text animation */
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
