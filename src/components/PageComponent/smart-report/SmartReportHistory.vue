<template>
  <div
    class="fb-flex fb-flex-col fb-w-[19.5rem] fb-min-w-[19.5rem] fb-border-r fb-border-[#e9eaeb] fb-bg-white fb-overflow-hidden"
  >
   

    <!-- Tabs (Acting as sub-header) -->
    <div class="fb-flex fb-gap-0.5 fb-px-2 fb-pt-3 fb-pb-2 fb-border-b fb-border-[#e9eaeb]">
      <Button
        v-for="tab in tabs"
        :key="tab.key"
        text
        size="small"
        :severity="activeTab === tab.key ? 'primary' : 'secondary'"
        class="!fb-justify-start !fb-text-[0.8125rem]"
        :class="activeTab === tab.key ? '!fb-font-semibold !fb-bg-primary-50' : '!fb-font-medium'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </Button>
    </div>

    <!-- List -->
    <div class="fb-flex-1 fb-overflow-y-auto fb-p-2 custom-scrollbar">
      <Button
        v-for="item in currentList"
        :key="item.id"
        text
        severity="secondary"
        class="!fb-w-full !fb-justify-start !fb-flex-col !fb-items-start !fb-px-2.5 !fb-py-2"
        :class="selectedId === item.id ? '!fb-bg-blue-50' : ''"
        @click="onSelect(item)"
      >
        <span class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-900 fb-leading-snug">
          {{ item.title }}
        </span>
        <span class="fb-text-xs fb-text-gray-500 fb-mt-0.5">{{ item.date }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['select']);

const activeTab = ref('recent');
const selectedId = ref(null);

const tabs = [
  { key: 'recent', label: 'Lịch sử gần nhất' },
  { key: 'weekly', label: 'Báo cáo tuần' },
  { key: 'knowledge', label: 'Kiến thức' }
];

// Mock data — thay bằng API thực sau
const recentItems = ref([
  { id: 1, title: 'Cửa hàng A', date: 'ngày 30/01/2025' },
  { id: 2, title: 'Cửa hàng B', date: 'ngày 30/01/2025' },
  { id: 3, title: 'Cửa hàng B', date: 'ngày 29/01/2025' },
  { id: 4, title: 'Cửa hàng B', date: 'ngày 28/01/2025' },
  { id: 5, title: 'Cửa hàng B', date: 'ngày 27/01/2025' },
  { id: 6, title: 'Cửa hàng B', date: 'ngày 26/01/2025' },
  { id: 7, title: 'Cửa hàng B', date: 'ngày 25/01/2025' },
  { id: 8, title: 'Cửa hàng B', date: 'ngày 24/01/2025' }
]);

const weeklyItems = ref([
  { id: 10, title: 'Tuần 4 - tháng 1', date: '24/01 – 30/01/2025' },
  { id: 11, title: 'Tuần 3 - tháng 1', date: '17/01 – 23/01/2025' }
]);

const knowledgeItems = ref([
  { id: 20, title: 'Phân tích xu hướng tiêu dùng', date: '01/2025' },
  { id: 21, title: 'Tối ưu doanh thu mùa lễ', date: '12/2024' }
]);

const currentList = computed(() => {
  if (activeTab.value === 'recent') return recentItems.value;
  if (activeTab.value === 'weekly') return weeklyItems.value;
  return knowledgeItems.value;
});

const onSelect = (item) => {
  selectedId.value = item.id;
  emit('select', item);
};
</script>
