<template>
  <div class="fb-flex fb-flex-col fb-gap-5">
    <!-- Chat Flow List -->
    <div class="fb-flex fb-flex-col fb-gap-8">
      <div v-for="(msg, index) in chatMessages" :key="index" class="fb-flex fb-flex-col">
        <!-- User Message -->
        <div v-if="msg.role === 'user'" class="fb-flex fb-justify-end fb-mb-2">
          <div
            class="fb-max-w-[85%] fb-bg-[#f4f4f5] fb-text-gray-800 fb-px-4 fb-py-2.5 fb-rounded-[1.25rem] fb-rounded-tr-none fb-text-sm fb-leading-relaxed"
          >
            {{ msg.content }}
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
            <h3
              v-if="msg.title"
              class="fb-text-base fb-font-semibold fb-text-gray-900 fb-mb-2 fb-m-0"
            >
              {{ msg.title }}
            </h3>

            <div class="fb-text-sm fb-text-gray-700 fb-leading-relaxed">
              <div class="markdown-content" v-html="renderMd(msg.content)"></div>
              <div v-if="msg.showSource" class="fb-mt-2">
                <span
                  class="fb-inline-flex fb-items-center fb-px-2 fb-py-0.5 fb-rounded fb-bg-gray-100 fb-text-[10px] fb-font-medium fb-text-gray-500 fb-cursor-pointer hover:fb-bg-gray-200 transition-colors"
                  @click="$emit('open-source')"
                >
                  Nguồn
                </span>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="fb-flex fb-items-center fb-justify-between fb-mt-4">
              <div class="fb-flex fb-items-center fb-gap-1">
                <Button
                  text
                  severity="secondary"
                  size="small"
                  class="!fb-w-8 !fb-h-8 !fb-p-2"
                  v-tooltip.top="'Sao chép'"
                >
                  <IconCopy color="currentColor" />
                </Button>
                <Button text severity="secondary" size="small" class="!fb-w-8 !fb-h-8 !fb-p-2">
                  <IconLike />
                </Button>
                <Button text severity="secondary" size="small" class="!fb-w-8 !fb-h-8 !fb-p-2">
                  <IconDislike />
                </Button>
                <Button
                  icon="pi pi-volume-up"
                  text
                  severity="secondary"
                  size="small"
                  class="!fb-w-8 !fb-h-8 !fb-text-gray-400 hover:!fb-text-blue-500"
                  v-tooltip.top="'Đọc'"
                />
              </div>

              <Button
                icon="pi pi-bookmark"
                label="Lưu kiến thức"
                text
                severity="warning"
                size="small"
                class="!fb-text-[0.8125rem] !fb-font-medium !fb-p-0 hover:fb-underline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions Section -->
    <div class="fb-mt-2">
      <p class="fb-text-[0.8125rem] fb-text-gray-500 fb-mb-3">Gợi ý</p>
      <div class="fb-flex fb-flex-col fb-gap-2">
        <Button
          v-for="(s, i) in detailSuggestions"
          :key="i"
          text
          size="small"
          variant="outlined"
          severity="secondary"
          class="fb-flex fb-items-start fb-gap-2 !fb-border !fb-border-gray-200 !fb-rounded-lg !fb-px-[0.875rem] !fb-text-sm !fb-text-gray-700 !fb-text-left !fb-leading-relaxed !fb-justify-start hover:!fb-bg-gray-50 hover:!fb-border-gray-400"
          @click="onSelectSuggestion(s)"
        >
          <span class="fb-text-gray-400 fb-flex-shrink-0 fb-mt-[0.125rem]">↳</span>
          <span>{{ s }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconAI1 from '@/components/Common/Icon/IconAI1.vue';
import MarkdownItPlugin from '@/common/plugins/markdown-it';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: 'Nhận định hành vi tiêu dùng',
      content: `Ngày 01/01 (Tết Dương lịch) làm nhịp mua sắm thay đổi so với ngày thường. Dù một phần khách đi chơi hoặc di chuyển, cửa hàng gần khu dân cư vẫn ghi nhận nhu cầu mua cho gia đình/nhóm bạn tăng.

So với 01/12 (Thứ Hai – đầu tuần), khi hành vi mua thường là đơn lẻ, "vừa đủ", 01/01 hình thành 2 cụm cao điểm rõ rệt, trong đó 13–14h nổi bật hơn hẳn.`
    })
  }
});

defineEmits(['open-source']);

const md = MarkdownItPlugin.md;

const renderMd = (content) => {
  return md.render(content || '');
};

const detailSuggestions = ref([
  "Tuần này quán đang 'vượt đỉnh' hay 'hụt hơi' so với phong độ 3 tháng qua?",
  "Tìm ra 'cỗ máy in tiền' thực sự: Món nào đang gánh team cho quán?",
  'Cảnh báo: Khách đang ít đi hay khách vào nhưng chi tiền ít hơn?',
  "Lộ diện 'siêu sao' doanh thu: Bạn có đang bỏ lỡ cơ hội upsell món này?",
  "Bắt mạch xu hướng: Quán đang tăng trưởng bền vững hay chỉ là 'sốt ảo'?"
]);

const chatMessages = ref([
  {
    role: 'user',
    content: 'Xem chi tiết'
  },
  {
    role: 'assistant',
    title: props.data.title || 'Nhận định hành vi tiêu dùng',
    content: props.data.content,
    showSource: true
  }
]);

const onSelectSuggestion = (text) => {
  chatMessages.value.push({
    role: 'user',
    content: text
  });

  // Giả lập phản hồi từ AI
  chatMessages.value.push({
    role: 'assistant',
    content: `Đang phân tích dữ liệu cho yêu cầu: **${text}**... \n\n(Đây là phản hồi giả lập để minh họa luồng chat).`,
    showSource: false
  });
};
</script>

<style lang="scss" scoped>
.markdown-content {
  :deep(p) {
    margin-bottom: 0.75rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
  :deep(ul),
  :deep(ol) {
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
  }
  :deep(li) {
    margin-bottom: 0.25rem;
  }
  :deep(strong) {
    font-weight: 600;
    color: var(--gray-900);
  }
}
</style>
