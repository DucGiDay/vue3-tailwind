<template>
  <div
    class="fb-flex fb-flex-col fb-w-[18.75rem] fb-min-w-[18.75rem] fb-border-l fb-border-[#e9eaeb] fb-bg-white fb-overflow-hidden"
  >
    <!-- Header -->
    <div
      class="fb-px-4 fb-py-3 fb-flex fb-items-center fb-justify-between fb-border-b fb-border-[#e9eaeb]"
    >
      <span class="fb-text-sm fb-font-semibold">Nguồn</span>
      <Button text severity="secondary" size="small" @click="emit('close')">
        <IconClose />
      </Button>
    </div>

    <!-- Content -->
    <div
      class="fb-flex-1 fb-overflow-auto fb-px-4 fb-py-4 fb-flex fb-flex-col fb-gap-4 custom-scrollbar"
    >
      <!-- Nội dung markdown từ citation -->
      <div
        v-if="citation?.data"
        class="fb-text-sm fb-text-gray-700 fb-leading-relaxed markdown-content"
        v-html="renderMd(citation.data)"
      />

      <!-- Source link -->
      <div
        v-if="citation"
        class="fb-flex fb-items-center fb-justify-between fb-px-3 fb-py-2.5 fb-rounded-lg fb-border fb-border-[#e9eaeb] fb-bg-gray-50 fb-cursor-pointer hover:fb-bg-gray-100 fb-transition-colors fb-duration-150"
      >
        <a
          :href="citation.url || '#'"
          target="_blank"
          rel="noreferrer"
          class="fb-flex fb-items-center fb-gap-2 fb-no-underline fb-flex-1 fb-min-w-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="fb-flex-shrink-0">
            <g clip-path="url(#clip0_src)">
              <path
                d="M6.667 8.666c.286.383.651.7 1.071.929.42.23.883.365 1.36.4.477.034.956-.036 1.403-.203.448-.167.855-.428 1.193-.766l2-2c.607-.629.943-1.47.935-2.344-.007-.874-.358-1.71-.976-2.328-.618-.618-1.454-.969-2.328-.977-.874-.007-1.715.33-2.344.936L8.16 3.453M9.333 7.333c-.286-.383-.651-.7-1.071-.929a3.667 3.667 0 00-1.36-.4 3.667 3.667 0 00-1.403.203 3.667 3.667 0 00-1.193.766l-2 2c-.607.629-.943 1.47-.936 2.344.008.874.358 1.71.977 2.328.618.618 1.454.969 2.328.977.874.007 1.715-.33 2.344-.937l1.14-1.14"
                stroke="#0560A6"
                stroke-width="1.67"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_src"><rect width="16" height="16" fill="white" /></clipPath>
            </defs>
          </svg>
          <span class="fb-text-[0.8125rem] fb-font-medium fb-text-blue-700 fb-truncate">
            {{ citation.title?.replace(/\[\^?\d+\]:?\s*/, '') || 'Xem nguồn' }}
          </span>
        </a>
        <i class="pi pi-chevron-right fb-text-gray-400 fb-text-xs fb-flex-shrink-0 fb-ml-2" />
      </div>

      <!-- Fallback khi không có citation -->
      <div
        v-else
        class="fb-text-center fb-text-gray-400 fb-text-sm fb-py-6"
      >
        Không có nguồn
      </div>
    </div>

    <!-- Footer -->
    <div class="fb-px-4 fb-py-3 fb-border-t fb-border-[#e9eaeb]">
      <Button
        text
        severity="secondary"
        size="small"
        icon="pi pi-download"
        v-tooltip.top="'Tải xuống'"
      />
    </div>
  </div>
</template>

<script setup>
import MarkdownItPlugin from '@/common/plugins/markdown-it';
import IconClose from '@/components/Common/Icon/IconClose.vue';

// ─── Props & Emits ────────────────────────────────────────────────────────────
defineProps({
  citation: {
    type: Object,
    default: () => null
    // shape: { title: string, data: string, url: string }
  }
});

const emit = defineEmits(['close']);

// ─── Markdown ─────────────────────────────────────────────────────────────────
const md = MarkdownItPlugin.md;

const renderMd = (content) => md.render(content || '');
</script>

<style lang="scss" scoped>
.markdown-content {
  :deep(p) {
    margin-bottom: 0.75rem;
    &:last-child { margin-bottom: 0; }
  }
  :deep(ul), :deep(ol) {
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
  }
  :deep(li) { margin-bottom: 0.25rem; }
  :deep(strong) { font-weight: 600; }
  :deep(table) {
    th, td {
      min-width: 6rem;
      padding: 0.25rem 8px;
      border-bottom: 1px solid #e9eaeb;
    }
  }
}
</style>
