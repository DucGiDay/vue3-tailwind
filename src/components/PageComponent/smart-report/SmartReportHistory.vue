<template>
  <div
    class="fb-flex fb-flex-col fb-w-[19.5rem] fb-min-w-[19.5rem] fb-border-r fb-border-[#e9eaeb] fb-bg-white fb-overflow-hidden"
  >
    <!-- Tabs -->
    <div class="fb-flex fb-gap-0.5 fb-px-2 fb-pt-3 fb-pb-2">
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
      <!-- Tab: Lịch sử gần nhất -->
      <template v-if="activeTab === 'recent'">
        <!-- Skeleton khi đang thêm mới -->
        <Skeleton v-if="isAdding" height="2.5rem" class="fb-mb-1 !fb-rounded-lg" />

        <Button
          v-for="item in listSession"
          :key="item.session_id"
          text
          severity="secondary"
          class="!fb-w-full !fb-justify-start !fb-flex-col !fb-items-start !fb-px-2.5 !fb-py-2 !fb-rounded-lg"
          :class="detailSession?.session_id === item.session_id ? '!fb-bg-blue-50' : ''"
          @click="onSelect(item.session_id, 'recent')"
        >
          <span
            class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-900 fb-leading-snug fb-text-left"
          >
            {{ item.session_name }}
          </span>
        </Button>

        <!-- Skeleton loading list -->
        <template v-if="isLoading">
          <Skeleton v-for="n in 5" :key="n" height="2.5rem" class="fb-mb-1 !fb-rounded-lg" />
        </template>

        <!-- Empty -->
        <div
          v-else-if="!listSession.length && !isAdding"
          class="fb-text-center fb-text-gray-400 fb-text-sm fb-py-6"
        >
          Chưa có dữ liệu
        </div>
      </template>

      <!-- Tab: Báo cáo tuần -->
      <template v-else-if="activeTab === 'weekly'">
        <Skeleton
          v-if="isLoadingWeek"
          v-for="n in 5"
          :key="n"
          height="2.5rem"
          class="fb-mb-1 !fb-rounded-lg"
        />

        <Button
          v-for="item in listSessionWeek"
          :key="item.session_id"
          text
          severity="secondary"
          class="!fb-w-full !fb-justify-start !fb-flex-col !fb-items-start !fb-px-2.5 !fb-py-2 !fb-rounded-lg"
          :class="detailSessionWeek?.session_id === item.session_id ? '!fb-bg-blue-50' : ''"
          @click="onSelect(item.session_id, 'weekly')"
        >
          <div class="fb-flex fb-items-center fb-gap-1.5 fb-w-full">
            <span
              class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-900 fb-leading-snug fb-flex-1 fb-text-left"
            >
              {{ item.report_name }}
            </span>
            <IconSave
              v-if="item.is_favorite"
              filled
              class="fb-w-4 fb-h-4 fb-text-yellow-500 fb-flex-shrink-0"
            />
          </div>
        </Button>

        <div
          v-if="!isLoadingWeek && !listSessionWeek.length"
          class="fb-text-center fb-text-gray-400 fb-text-sm fb-py-6"
        >
          Chưa có dữ liệu
        </div>
      </template>

      <!-- Tab: Kiến thức (Favorite) -->
      <template v-else-if="activeTab === 'knowledge'">
        <Skeleton
          v-if="isLoadingFavorite"
          v-for="n in 5"
          :key="n"
          height="2.5rem"
          class="fb-mb-1 !fb-rounded-lg"
        />

        <Button
          v-for="item in listFavoriteReports"
          :key="item.session_id"
          text
          severity="secondary"
          class="!fb-w-full !fb-justify-start !fb-flex-col !fb-items-start !fb-px-2.5 !fb-py-2 !fb-rounded-lg"
          :class="detailSessionWeek?.session_id === item.session_id ? '!fb-bg-blue-50' : ''"
          @click="onSelect(item.session_id, 'knowledge')"
        >
          <div class="fb-flex fb-items-center fb-gap-1.5 fb-w-full">
            <span
              class="fb-text-[0.8125rem] fb-font-medium fb-text-gray-900 fb-leading-snug fb-flex-1 fb-text-left"
            >
              {{ item.report_name }}
            </span>
            <IconSave filled class="fb-w-4 fb-h-4 fb-text-yellow-500 fb-flex-shrink-0" />
          </div>
        </Button>

        <div
          v-if="!isLoadingFavorite && !listFavoriteReports.length"
          class="fb-text-center fb-text-gray-400 fb-text-sm fb-py-6"
        >
          Chưa có dữ liệu
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSmartReportStore } from '@/stores/smart-report.store';
import { useGlobalStore } from '@/stores/global.store';
import IconSave from '@/components/Common/Icon/IconSave.vue';

// ─── Emits ────────────────────────────────────────────────────────────────────
const emit = defineEmits(['select']);

// ─── Store (Pinia) ────────────────────────────────────────────────────────────
const srStore = useSmartReportStore();
const globalStore = useGlobalStore();

const getCompanyUid = computed(() => globalStore?.currentUser?.company_uid);
const brandUid = computed(() => globalStore?.brandUid);
const listSession = computed(() => srStore.listSession);
const detailSession = computed(() => srStore.detailSession);
const listSessionWeek = computed(() => srStore.listSessionWeek);
const detailSessionWeek = computed(() => srStore.detailSessionWeek);
const listFavoriteReports = computed(() => srStore.listFavoriteReports);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'recent', label: 'Lịch sử gần nhất' },
  { key: 'weekly', label: 'Báo cáo tuần' },
  { key: 'knowledge', label: 'Kiến thức' }
];

// ─── State ────────────────────────────────────────────────────────────────────
const activeTab = ref('recent');
const isLoading = ref(false);
const isLoadingWeek = ref(false);
const isLoadingFavorite = ref(false);
const isAdding = ref(false);

// ─── Methods ──────────────────────────────────────────────────────────────────
const params = computed(() => ({
  company_uid: getCompanyUid.value,
  brand_uid: brandUid.value
}));

const getListSession = () => srStore.getSessions(params.value);

const getData = async (isAddingNew = false, isFavorite = false) => {
  try {
    isAdding.value = isAddingNew;

    if (isAddingNew) {
      await getListSession().finally(() => {
        isAdding.value = false;
      });
    } else if (isFavorite) {
      isLoadingFavorite.value = true;
      await srStore.getFavoriteReports(params.value).finally(() => {
        isLoadingFavorite.value = false;
      });
    } else {
      isLoading.value = true;
      isLoadingWeek.value = true;
      isLoadingFavorite.value = true;
      await Promise.all([
        getListSession().finally(() => {
          isLoading.value = false;
          isAdding.value = false;
        }),
        srStore.getWeekSessions({ ...params.value, limit_weeks: 10 }).finally(() => {
          isLoadingWeek.value = false;
        }),
        srStore.getFavoriteReports(params.value).finally(() => {
          isLoadingFavorite.value = false;
        })
      ]);
    }
  } catch (error) {
    console.error('[SmartReportHistory] getData error:', error);
    isLoading.value = false;
    isLoadingWeek.value = false;
    isLoadingFavorite.value = false;
  }
};

// Expose để parent gọi được getData
defineExpose({ getData, activeTab });

const onSelect = (sessionId, type) => {
  emit('select', { sessionId, type });
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  getData();
});
</script>
