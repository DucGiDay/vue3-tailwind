<template>
  <Dialog
    v-model:visible="visible"
    header="Chi tiết hóa đơn"
    modal
    class="fb-w-[50vw]"
    position="top"
    :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
  >
    <template #header>
      <h6 class="fb-text-center fb-font-semibold fb-text-lg fb-flex-1">Chi tiết hóa đơn</h6>
    </template>

    <div class="fb-flex fb-flex-col fb-gap-4">
      <InputText 
        v-model="searchText"
        placeholder="Tìm kiếm theo mã hoá đơn" 
        class="fb-w-full" 
      />

      <div
        v-if="isLoading"
        class="fb-flex fb-flex-col fb-gap-4 fb-p-4 fb-border fb-border-gray-200 fb-rounded-xl"
      >
        <Skeleton width="100%" height="2rem"></Skeleton>
        <Skeleton width="100%" height="2rem"></Skeleton>
      </div>
      <div v-else-if="dataDetail.length > 0" class="fb-space-y-4">
        <div
          v-for="(item, index) in dataDetail"
          :key="index"
          class="fb-border fb-border-gray-200 fb-rounded-xl"
        >
          <!-- Header HĐ -->
          <div
            @click="toggleExpand(index)"
            class="fb-flex fb-justify-between fb-items-start fb-p-4 fb-bg-gray-50 fb-rounded-t-xl fb-border-gray-200 fb-cursor-pointer hover:fb-bg-gray-100 fb-transition-colors"
            :class="{ 'fb-border-b': expandedItems[index] }"
          >
            <div class="fb-flex fb-flex-col fb-gap-1">
              <div class="fb-font-bold fb-text-base">
                #{{ item.tran_id?.slice(-5) }} - Số HĐ: {{ item.tran_no }}
              </div>
              <div class="fb-text-sm fb-text-gray-600">
                cafe so 1 - {{ item.table_name }} -
                {{ formatCurrency(item.total_amount) }}
              </div>
            </div>
            <div class="fb-flex fb-flex-col fb-items-end fb-gap-1">
              <div class="fb-text-sm fb-text-gray-800 fb-flex fb-items-center fb-gap-1">
                {{ formatDate(item.tran_date, 'DD/MM/YYYY HH:mm') }}
                <IconChevronDown
                  class="fb-transition-transform fb-duration-200"
                  :class="{ 'fb-rotate-180': expandedItems[index] }"
                  color="black"
                />
              </div>
              <a href="#" @click.stop class="fb-text-sm fb-text-blue-600 hover:fb-underline">
                Xem nhật ký order
              </a>
            </div>
          </div>

          <!-- Dùng grid và transition để animate khi ẩn hiện  -->
          <div
            class="fb-grid fb-transition-all fb-duration-300 fb-ease-in-out"
            :class="
              expandedItems[index]
                ? 'fb-grid-rows-[1fr] fb-opacity-100'
                : 'fb-grid-rows-[0fr] fb-opacity-0'
            "
          >
            <div class="fb-overflow-hidden fb-flex fb-flex-col">
              <!-- Chi tiết items -->
              <div class="fb-p-4 fb-flex fb-flex-col fb-gap-2">
                <div
                  v-for="(item, i) in item.sale_detail"
                  :key="index + '-' + i"
                  class="fb-flex fb-justify-between fb-items-center"
                >
                  <div class="fb-text-gray-800">(x{{ item.quantity }}) {{ item.item_name }}</div>
                  <div class="fb-text-gray-800">{{ formatCurrency(item.amount) }}</div>
                </div>
              </div>

              <div class="fb-border-t fb-border-gray-200"></div>

              <!-- Tổng tiền -->
              <div class="fb-p-4 fb-flex fb-flex-col fb-gap-3">
                <div class="fb-flex fb-justify-between fb-items-center">
                  <div class="fb-text-gray-800">Thành tiền</div>
                  <div class="fb-text-gray-800">
                    {{ formatCurrency(item.amount_origin || item.total_amount) }}
                  </div>
                </div>
                <div class="fb-flex fb-justify-between fb-items-center fb-font-bold fb-text-base">
                  <div>Tổng tiền</div>
                  <div>{{ formatCurrency(item.total_amount) }}</div>
                </div>
              </div>

              <div class="fb-border-t fb-border-gray-200"></div>

              <!-- Thanh toán -->
              <div class="fb-p-4 fb-flex fb-flex-col fb-gap-2">
                <div class="fb-font-bold fb-text-gray-800">Phương thức thanh toán:</div>
                <div
                  v-for="(method, i) in item.sale_payment_method"
                  :key="index + '-' + i"
                  class="fb-flex fb-justify-between fb-items-center"
                >
                  <div class="fb-text-gray-800">
                    - {{ method.payment_method_name }} ({{
                      method.trace_no || method.payment_method_id
                    }})
                  </div>
                  <div class="fb-text-gray-800">{{ formatCurrency(method.amount) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="fb-font-medium fb-text-gray-500 fb-text-center">Không có dữ liệu</div>
    </div>

    <template #footer>
      <div class="fb-w-full fb-flex fb-justify-end">
        <Button
          class="fb-bg-white fb-text-blue-600 fb-border fb-border-blue-600 hover:fb-bg-blue-50"
        >
          <IconDownload color="#fff" />
          Xuất hoá đơn
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import { formatDate, formatCurrency } from '@/common/utils/common';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dataDetail: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible']);

const invoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

const dataDetail = ref([]);
const isLoading = ref(false);
const expandedItems = ref({});
const searchText = ref('');
let searchTimeout = null;

const toggleExpand = (index) => {
  expandedItems.value[index] = !expandedItems.value[index];
};

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

watch(
  () => visible.value,
  async (newVal) => {
    if (newVal && props.dataDetail?.merged_tran_id) {
      searchText.value = '';
      await getData();
    }
  }
);

watch(searchText, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getData();
  }, 800);
});

const getData = async () => {
  isLoading.value = true;
  dataDetail.value = []; // reset
  const payload = {
    brand_uid: globalStore.brandUid,
    company_uid: globalStore.currentUser?.company_uid,
    list_tran_id: props.dataDetail?.merged_tran_id,
    store_uid: props.dataDetail?.store_uid,
    ...(searchText.value ? { search: searchText.value } : {})
  };
  const res = await invoiceStore.getSaleByListTranId(payload);

  if (res.data) {
    dataDetail.value = res?.data || [];
    expandedItems.value = {};
    dataDetail.value.forEach((_, idx) => {
      expandedItems.value[idx] = idx === 0;
    });
  } else {
    console.error(res.error);
  }
  isLoading.value = false;
};
</script>
