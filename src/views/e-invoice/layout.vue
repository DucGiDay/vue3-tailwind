<template>
  <transition name="filter-slide">
    <div v-if="hasTaxCode && isLoaded" title="Chọn mã số thuế"
      class="fb-fixed fb-w-full lg:fb-w-[calc(100%-20rem)] lg:fb-top-[60px] fb-left-0 lg:fb-left-[20rem] fb-z-10 fb-bg-primary-50/90 fb-backdrop-blur-md fb-border-b fb-border-primary-100 fb-px-4 fb-py-2 fb-flex fb-items-center fb-shadow-sm fb-cursor-pointer"
      @click="eInvoiceStore.showTaxCodeDialog = true">
      <span class="fb-text-sm fb-text-primary-900">
        MST:
        <strong class="fb-text-primary-700 fb-ml-1">{{ eInvoiceStore.currentTaxCode }}</strong>
      </span>
    </div>
  </Transition>
  <router-view></router-view>

  <Dialog v-model:visible="eInvoiceStore.showTaxCodeDialog" modal header="Chọn mã số thuế" :closable="hasTaxCode"
    :style="{ width: '40vw' }">
    <div class="fb-flex fb-flex-col fb-gap-4">
      <span>Vui lòng chọn mã số thuế để tiếp tục:</span>
      <Select v-if="taxCodeOptions?.length" v-model="selectedTaxCode" :options="taxCodeOptions" optionLabel="tax_code"
        optionValue="tax_code" placeholder="Chọn mã số thuế" class="fb-w-full" />
      <div v-else class="fb-text-error-500">{{ eInvoiceStore.listTaxStores?.error || 'Không tìm thấy MST' }}</div>
      <div class="fb-flex fb-justify-end fb-mt-4">
        <Button label="Xác nhận" @click="confirmTaxCode" :disabled="!selectedTaxCode" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEInoiveStore } from '@/stores/e-invoice.store';
import { useGlobalStore } from '@/stores/global.store';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const eInvoiceStore = useEInoiveStore();
const globalStore = useGlobalStore();

const selectedTaxCode = ref(null);
const hasTaxCode = ref(false);
const isLoaded = ref(false);

const taxCodeOptions = computed(() => eInvoiceStore.listTaxStores.data || []);

onMounted(async () => {
  const params = {
    brand_uid: globalStore.brandUid,
    company_uid: globalStore.currentUser?.company_uid,
  };
  await eInvoiceStore.getListStoreGroupByTaxCode(params);
  isLoaded.value = true;
  if (eInvoiceStore.listTaxStores?.error) {
    hasTaxCode.value = false;
    eInvoiceStore.showTaxCodeDialog = true;
    return;
  }

  const savedTaxCode = localStorage.getItem('fabi_selected_tax_code');
  const isValidTaxCode =
    savedTaxCode && eInvoiceStore.listTaxStores.data.some((item) => item.tax_code === savedTaxCode);

  if (!isValidTaxCode) {
    eInvoiceStore.showTaxCodeDialog = true;
  } else {
    hasTaxCode.value = true;
    selectedTaxCode.value = savedTaxCode;
  }
});

const confirmTaxCode = () => {
  if (selectedTaxCode.value) {
    localStorage.setItem('fabi_selected_tax_code', selectedTaxCode.value);
    eInvoiceStore.showTaxCodeDialog = false;
    hasTaxCode.value = true;
    window.location.reload(); // Reload to refresh data with new tax code
  }
};
</script>
