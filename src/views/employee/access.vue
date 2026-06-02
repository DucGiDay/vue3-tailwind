<template>
  <TableView
    :title="$t('ROUTER_TITLE--EMPLOYEE_ACCESS')"
    v-model:searchValue="search"
    :searchPlaceholder="$t('EMPLOYEE_ACCESS--SEARCH')"
    @search="onSearch"
  >
    <!-- Header Actions -->
    <template #filters>
      <Select
        v-model="filterStatus"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="$t('EMPLOYEE_ACCESS--ALL_STATUS')"
        class="fb-w-[180px]"
      />
    </template>

    <!-- Table -->
    <template #table>
      <FbTable
        :columns="columns"
        :items="employees"
        :rowClass="getRowClass"
        enableScrollPagination
        :hasMoreData="hasMoreData"
        :stripedRows="false"
        :isLoading="isLoading"
        :currentPage="currentPage"
        :pageSize="pageSize"
        scrollHeight="flex"
        @page-change="loadMore"
      >
        <template #products="{ row }">
          <ProductTags :products="row.products" :row="row" @edit="handleEditProduct" />
        </template>

        <template #action="{ row }">
          <div
            v-if="
              row &&
              Array.isArray(row.products) &&
              row.products.some(
                (product) => product.is_active === false && product.is_requesting === true,
              )
            "
            class="fb-flex fb-items-center fb-justify-center fb-gap-2"
          >
            <Button
              :label="$t('EMPLOYEE_ACCESS--CANCEL')"
              text
              severity="secondary"
              size="small"
              @click="rejectRequest(row)"
            />
            <Button
              :label="$t('EMPLOYEE_ACCESS--APPROVAL')"
              size="small"
              @click="approveRequest(row)"
            />
          </div>
        </template>
      </FbTable>
    </template>
  </TableView>
  <Dialog
    v-model:visible="visibleProductModal"
    modal
    :header="$t('EMPLOYEE_ACCESS--PRODUCT')"
    :style="{ width: '750px' }"
  >
    <div class="fb-flex fb-flex-col fb-gap-3">
      <div
        v-for="product in productOptions"
        :key="product.id"
        class="product-item"
        :class="{
          'product-item--active': selectedProducts.includes(product.id),
        }"
        @click="toggleProduct(product.id)"
      >
        <label :for="product.id">
          {{ product.code === 'GENERAL' ? 'FABI' : product.name }}
        </label>
        <Checkbox
          v-model="selectedProducts"
          :inputId="product.id"
          :value="product.id"
          name="products"
          @click.stop
        />
      </div>
    </div>

    <template #footer>
      <div class="fb-flex fb-justify-end fb-gap-2">
        <Button
          :label="$t('EMPLOYEE_ACCESS--CLOSE')"
          text
          class="border-btn"
          @click="visibleProductModal = false"
        />

        <Button :label="$t('EMPLOYEE_ACCESS--SAVE')" @click="saveProducts" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from '@/common/i18n';
import TableView from '@/components/SharedComponent/views/TableView.vue';
import { employeeService } from '@/api/services/employee/employee.service';
import ProductTags from './component/product-table.vue';
import { useToast } from 'primevue/usetoast';
const { t } = useI18n();
const search = ref('');
const filterStatus = ref('ALL');
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMoreData = ref(true);
const employees = ref([]);
const statusOptions = [
  {
    label: $t('EMPLOYEE_ACCESS--ALL_STATUS'),
    value: 'ALL',
  },
  {
    label: $t('EMPLOYEE_ACCESS--APPROVAL_STATUS'),
    value: 'APPROVED',
  },
  {
    label: $t('EMPLOYEE_ACCESS--PENDING_STATUS'),
    value: 'PENDING',
  },
];

const columns = [
  {
    field: 'user_full_name',
    header: $t('EMPLOYEE_ACCESS--NAME'),
    style: {
      minWidth: '220px',
    },
  },
  {
    field: 'user_email',
    header: 'Email',
    style: {
      minWidth: '240px',
    },
  },
  {
    field: 'user_phone',
    header: $t('EMPLOYEE_ACCESS--PHONE'),
    style: {
      minWidth: '180px',
    },
  },
  {
    field: 'products',
    header: $t('EMPLOYEE_ACCESS--PRODUCT'),
    style: {
      minWidth: '320px',
    },
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: {
      width: '240px',
      minWidth: '240px',
    },
  },
];
const visibleProductModal = ref(false);
const productOptions = ref([]);
const selectedProducts = ref([]);
const currentRow = ref(null);
const approving = ref({});
const rejecting = ref({});

const toast = useToast();
const getData = async () => {
  isLoading.value = true;

  try {
    const payload = {
      page: currentPage.value,
      results_per_page: pageSize.value,
      search: search.value || null,
      status: filterStatus.value === 'ALL' ? undefined : filterStatus.value,
    };

    const res = await employeeService.getRequest(payload);

    const fetchedData = res?.data?.requests || [];

    if (currentPage.value === 1) {
      employees.value = fetchedData;
    } else {
      employees.value = [...employees.value, ...fetchedData];
    }

    hasMoreData.value = fetchedData.length === pageSize.value;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async () => {
  if (isLoading.value || !hasMoreData.value) return;

  currentPage.value++;

  await getData();
};

const filter = async () => {
  currentPage.value = 1;
  employees.value = [];

  await getData();
};

let searchTimeout = null;

const onSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    await filter();
  }, 500);
};

const handleEditProduct = async (row) => {
  currentRow.value = row;
  visibleProductModal.value = true;
  await getAllProducts();
  mapSelectedProducts();
};

const getAllProducts = async () => {
  const res = await employeeService.getListProduct();

  productOptions.value = res?.data || [];
};

const mapSelectedProducts = () => {
  selectedProducts.value =
    currentRow.value?.data?.products
      ?.filter(
        (product) =>
          !(
            product.is_active === false &&
            product.is_requesting === false
          )
      )
      .map((product) => product.product_uid) || [];
};

const saveProducts = async () => {
  if (!currentRow.value) return;

  try {
    const requestProducts = selectedProducts.value || [];

    const payload = {
      user_uid: currentRow.value.data.user_uid,
      product_uids: requestProducts,
      mode: 'REPLACE',
    };

    const res = await employeeService.updateProductAccess(payload);

    if (res?.error) {
      toast.add({
        severity: 'error',
        summary: res.error?.message || 'Lưu thất bại',
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: $t('EMPLOYEE_ACCESS--APPROVAL_SUCCESS'),
      life: 3000,
    });

    visibleProductModal.value = false;

    currentPage.value = 1;
    employees.value = [];

    await getData();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error?.response?.data?.message || 'Có lỗi xảy ra',
      life: 3000,
    });
  }
};
const toggleProduct = (id) => {
  if (selectedProducts.value.includes(id)) {
    selectedProducts.value = selectedProducts.value.filter((item) => item !== id);
  } else {
    selectedProducts.value.push(id);
  }
};

const rejectRequest = async (row) => {
  if (rejecting.value[row.user_uid]) return;

  rejecting.value[row.user_uid] = true;

  try {
    const payload = {
      user_uid: row.user_uid,
      product_uids: [],
      mode: 'MERGE',
    };

    const res = await employeeService.updateProductAccess(payload);

    if (res?.error) {
      toast.add({
        severity: 'error',
        summary: res.error?.message || 'Huỷ yêu cầu thất bại',
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: $t('EMPLOYEE_ACCESS--CANCEL_SUCCESS'),
      life: 3000,
    });

    currentPage.value = 1;

    await getData();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error?.response?.data?.message || 'Có lỗi xảy ra',
      life: 3000,
    });
  } finally {
    rejecting.value[row.user_uid] = false;
  }
};

const approveRequest = async (row) => {
  // chống double click
  if (approving.value[row.user_uid]) return;

  approving.value[row.user_uid] = true;

  try {
    const requestProducts =
      row.products
        ?.filter((product) => product.is_active === false)
        ?.map((product) => product.product_uid) || [];

    const payload = {
      user_uid: row.user_uid,
      product_uids: requestProducts,
      mode: 'MERGE',
    };

    const res = await employeeService.updateProductAccess(payload);

    if (res?.error) {
      toast.add({
        severity: 'error',
        summary: res.error?.message || 'Duyệt yêu cầu thất bại',
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: 'success',
      summary: $t('EMPLOYEE_ACCESS--APPROVAL_SUCCESS'),
      life: 3000,
    });

    currentPage.value = 1;

    await getData();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: error?.response?.data?.message || 'Có lỗi xảy ra',
      life: 3000,
    });
  } finally {
    approving.value[row.user_uid] = false;
  }
};

const getRowClass = (row) => {
  const hasPendingProduct =
    row && Array.isArray(row.products) && row.products.some((product) =>
      product.is_active === false && product.is_requesting === true);
  return hasPendingProduct ? 'pending-row' : '';
};

watch(filterStatus, async () => {
  await filter();
});

onMounted(() => {
  getData();
});
</script>
<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 56px;

  padding: 14px 16px;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: #fff;

  transition: all 0.2s ease;

  cursor: pointer;

  &:hover {
    border-color: #93c5fd;
    background: #f8fbff;
  }

  &--active {
    border-color: #1677ff;
    background: #f0f7ff;
  }
}

.product-item__name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

:deep(.p-checkbox) {
  flex-shrink: 0;
}

:deep(.p-checkbox-box) {
  width: 20px;
  height: 20px;

  border-radius: 6px;
}

:deep(.p-checkbox-box) {
  border-radius: 6px;
}

:deep(.p-dialog-header) {
  font-weight: 500 !important;
  font-size: 16px !important;
}
.border-btn {
  border: solid 1px #e5e7eb;
  color: rgba(65, 70, 81, 1);
}
</style>

<style lang="scss">
.p-datatable-tbody > tr.pending-row > td {
  background: #eef6fc !important;
}
</style>
