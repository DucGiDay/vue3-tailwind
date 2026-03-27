<script setup>
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { VAT_PUBLISH_STATUS_COLOR } from '@/common/constant/e-invoice.constant';

// Store/Getter
const invoiceStore = useEInoiveStore();
const recentInvoice = computed(() => invoiceStore.recentInvoice);

const tableColumns = [
  { field: 'merged_tran_id', header: 'Mã hóa đơn' },
  { field: 'vat_publish_status', header: 'Trạng thái' }
];
</script>

<template>
  <div>
    <div class="fb-font-semibold fb-mb-4">Hóa đơn gần nhất</div>
    <div class="fb-shadow-sm !fb-p-0">
      <FbTable
        :columns="tableColumns"
        :show-export="false"
        :is-loading="recentInvoice?.isLoading"
        :items="recentInvoice?.data || []"
        :scrollable="false"
        :stripedRows="false"
      >
        <template #vat_publish_status="{ record }">
          <span
            :class="VAT_PUBLISH_STATUS_COLOR[record?.code]?.class"
            class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
          >
            {{ record?.name }}
          </span>
        </template>
        <template #empty>
          {{ recentInvoice?.error || 'Chưa có hóa đơn' }}
        </template>
      </FbTable>
    </div>
  </div>
</template>
