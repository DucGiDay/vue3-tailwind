<template>
  <div class="layout-wrapper">
    <div class="layout-main-container pb-0">
      <TableView
        v-model:searchValue="searchField"
        searchPlaceholder="Tìm kiếm mã hóa đơn"
        @search="onSearchChange"
      >
        <template #table>
          <FbTable
            :columns="EXTEND_LICENSE_TABLE_COLUMNS"
            :is-loading="isLoading"
            :items="orderHistory.data"
            enablePagination
            :currentPage="currentPage"
            :pageSize="numPerPage"
            :totalRecords="totalRecords"
            rowHover
            :rowClass="() => 'fb-cursor-pointer'"
            @row-click="toggleDetail"
            @page-change="getData"
          >
            <template #deliveryInfo="{ record }">
              {{ record?.receiverName }}
            </template>
            <template #amount="{ record }">
              {{ formatCurrency(record) }}
            </template>
            <template #status="{ record }">
              <span
                :class="statusMap(record)?.class"
                class="fb-px-2 fb-py-[0.125rem] fb-rounded-2xl fb-text-xs"
              >
                {{ statusMap(record)?.label }}
              </span>
            </template>
            <template #action="{ row }">
              <div
                v-if="row?.status === 'PENDING' && row.amount > 0"
                class="fb-flex fb-items-center"
              >
                <Button size="small" variant="text" @click="togglePayingDialog(row)">
                  Thanh toán lại
                </Button>
                <Button
                  size="small"
                  variant="text"
                  severity="contrast"
                  @click="toggleConfirmDialog(row)"
                >
                  <IconTrash />
                </Button>
              </div>
            </template>
          </FbTable>
        </template>

        <template #extra>
          <Dialog
            header="Xác nhận"
            v-model:visible="displayConfirmation"
            :style="{ width: '30rem' }"
            :modal="true"
          >
            <div class="fb-flex fb-items-center fb-justify-center">
              <span>
                Nhập lý do hủy đơn #
                <span class="fb-font-semibold fb-text-primary">{{ selectedItem?.roCode }}</span>
                :
              </span>
            </div>
            <Fluid>
              <Textarea v-model="reason" rows="3" placeholder="Nhập lý do" />
            </Fluid>
            <template #footer>
              <Button label="Đóng" @click="toggleConfirmDialog" text severity="secondary" />
              <Button label="Xác nhận" @click="onDeleteItem" severity="danger" autofocus />
            </template>
          </Dialog>
          <DetailOrder
            v-model:visible="displayDetail"
            :item="selectedItem"
            @delete-item="toggleConfirmDialog"
            @repaid-item="togglePayingDialog"
          />
          <ModalPayingOrder
            v-model:visible="displayPaying"
            :item="selectedItem"
            @success="reloadTable"
            @hide="onHidePaying"
          />
        </template>
      </TableView>
    </div>
  </div>
</template>

<script setup>
import {
  ORDER_STATUS_FILTER_LIST,
  ORDER_STATUS_COLOR,
  EXTEND_LICENSE_TABLE_COLUMNS,
} from '@/common/constant/extend-license.constant';
import { useExtendLicenseStore } from '@/stores/extend-license.store';
import { useGlobalStore } from '@/stores/global.store';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/common/utils/common';
import DetailOrder from '@/components/PageComponent/extend-license/DetailOrder.vue';
import ModalPayingOrder from '@/components/PageComponent/extend-license/ModalPayingOrder.vue';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { extendLicenseService } from '@/api/services/extend-license/extend-license.service';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const toast = useToast();

// States
const searchField = ref('');
const statusMap = (status) => {
  return ORDER_STATUS_COLOR[status];
};
const numPerPage = ref(20);
const totalRecords = ref(0);
const currentPage = ref(1);
const displayConfirmation = ref(false);
const displayDetail = ref(false);
const displayPaying = ref(false);
const selectedItem = ref({});
const reason = ref('Hủy đơn từ CMS');

// Stores
const extendLicenseStore = useExtendLicenseStore();
const globalStore = useGlobalStore();
const { orderHistory, isLoading } = storeToRefs(extendLicenseStore);

// Methods
const getData = async ({ page, rows } = {}) => {
  currentPage.value = page || currentPage.value;
  numPerPage.value = rows || numPerPage.value;
  await extendLicenseStore.getListOrderHistory({
    companyId: globalStore?.currentUser?.company_id,
    page: currentPage.value,
    numPerPage: numPerPage.value,
    // list_store_uid: globalStore.storesIdPermissionActive.join(','),
    textSearch: searchField.value,
    ...(route.query?.product_code ? { productCode: route.query?.product_code } : {}),
  });

  totalRecords.value = orderHistory.value?.meta?.count;
};

const onDeleteItem = async () => {
  try {
    if (!selectedItem.value?.roCode) throw new Error('Không tìm thấy roCode');

    const payload = {
      // status: 'CANCELED',
      orderCode: selectedItem.value?.roCode,
      cancelNote: reason.value,
      _id: selectedItem.value?._id,
    };
    isLoading.value = true;
    displayConfirmation.value = false;
    const response = await extendLicenseService.cancelOrder(payload);
    if (response.error)
      toast.add({ severity: 'error', summary: response.error?.message, life: 3000 });
    else {
      toast.add({ severity: 'success', summary: 'Hủy đơn thành công', life: 3000 });
      await reloadTable();
    }
  } catch (error) {
    displayConfirmation.value = true;
    console.error(error?.message);
  } finally {
    isLoading.value = false;
  }
};

const reloadTable = async () => {
  await getData();
};

const onHidePaying = async () => {
  selectedItem.value = {};
};

const toggleConfirmDialog = (item) => {
  selectedItem.value = item || {};
  displayConfirmation.value = !displayConfirmation.value;
};
const togglePayingDialog = (item) => {
  selectedItem.value = item || {};
  displayPaying.value = !displayPaying.value;
};
const toggleDetail = ({ data } = {}) => {
  selectedItem.value = data || {};
  displayDetail.value = true;
};

let searchTimeout = null;
const onSearchChange = async () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    await getData();
  }, 500);
};

onMounted(() => {
  getData();
});
</script>
