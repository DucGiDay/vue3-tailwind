<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="$t('SALE_SYNC_VAT--VAT_INFO')"
    :style="{ width: '60vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h6 class="fb-text-center fb-font-semibold fb-text-lg fb-flex-1">Xem trước khi gửi CQT</h6>
    </template>

    <template #default>
      <FbTable
        :value="invoiceData?.data || []"
        :loading="isLoading"
        :columns="[]"
        :hideIndexRow="true"
      >
        <Column
          field="info"
          header="Thông tin tìm kiếm"
          headerClass="!fb-bg-gray-50 !fb-text-gray !fb-py-3 fb-text-sm fb-font-medium"
          :bodyClass="'!fb-py-4 '"
          :class="['fb-whitespace-nowrap !fb-px-6']"
        >
          <template #body="{ data }">
            <ul>
              <li>Mẫu số: {{ data?.mau_hd }}</li>
              <li>Ký hiệu: {{ data?.inv_series }}</li>
              <li>Số: {{ data?.vat_invoice_number }}</li>
              <li>Mã tra cứu: {{ data?.fkey }}</li>
            </ul>
          </template>
        </Column>
        <Column
          field="vat_invoice_date"
          header="Ngày tạo"
          headerClass="!fb-bg-gray-50 !fb-text-gray !fb-py-3 fb-text-sm fb-font-medium"
          :bodyClass="'!fb-py-4 '"
          :class="['fb-whitespace-nowrap !fb-px-6']"
        />
        <Column
          field="tthai"
          header="Trạng thái"
          headerClass="!fb-bg-gray-50 !fb-text-gray !fb-py-3 fb-text-sm fb-font-medium"
          :bodyClass="'!fb-py-4 '"
          :class="['fb-whitespace-nowrap !fb-px-6']"
        />
      </FbTable>
    </template>

    <template #footer>
      <div class="fb-flex fb-gap-2">
        <Button
          :label="$t('SALE_SYNC_VAT--BUTTON_CLOSE')"
          raised
          severity="secondary"
          @click="visible = false"
        />
        <Button raised @click="sendInvoiceCqt" :loading="isLoading">
          <span>Gửi cơ quan thuế</span>
          <span v-if="isLoading">
            <ProgressSpinner class="!fb-m-0" strokeWidth="6" style="width: 1rem; height: 1rem" />
          </span>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

const toast = useToast();
const props = defineProps({
  invoiceData: {
    type: Object,
    default: () => ({})
  }
});

const visible = defineModel('visible', { default: false });
const isLoading = ref(false);

const sendInvoiceCqt = async () => {
  if (!props?.invoiceData?.payload) return;
  isLoading.value = true;
  try {
    const response = await invoiceService.sendInvoiceCqt(props.invoiceData.payload);
    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã gửi hóa đơn đến cơ quan thuế',
        life: 3000
      });
      visible.value = false;
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.message || 'Đã có lỗi xảy ra',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
