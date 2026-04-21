<template>
  <div>
    <div class="fb-font-semibold fb-mb-4">Hóa đơn gần nhất</div>
    <div class="fb-shadow-sm !fb-p-0">
      <FbTable
        :columns="LAST_BILL_TABLE_COLUMNS"
        :show-export="false"
        :is-loading="recentInvoice?.isLoading"
        :items="recentInvoice?.data || []"
        :scrollable="false"
        rowHover
        :stripedRows="false"
        @rowClick="openDetail"
      >
        <template #vat_publish_status="{ record }">
          <span
            :class="VAT_PUBLISH_STATUS_COLOR[record?.code]?.class"
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
          >
            {{ record?.name }}
          </span>
        </template>
        <template #extra_data="{ record }">
          {{ record?.inv_buyerDisplayName || '' }}
        </template>
        <template #empty>
          {{ recentInvoice?.error || 'Chưa có hóa đơn' }}
        </template>
      </FbTable>
    </div>
    <ModalSaleDetail v-model:visible="visibleDetail" :dataDetail="dataDetail" />
  </div>
</template>

<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import ModalSaleDetail from '@/components/PageComponent/ModalSaleDetail.vue';
import {
  VAT_PUBLISH_STATUS_COLOR,
  LAST_BILL_TABLE_COLUMNS
} from '@/common/constant/e-invoice.constant';

// Store/Getter
const invoiceStore = useEInoiveStore();
const recentInvoice = computed(() => invoiceStore.recentInvoice);

// States
const visibleDetail = ref(false);
const dataDetail = ref(null);

// Methods
const openDetail = ({ data }) => {
  visibleDetail.value = true;
  dataDetail.value = data;
};
</script>
