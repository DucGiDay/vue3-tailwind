<script setup>
import { ProductService } from '@/service/ProductService';
import { onMounted, ref } from 'vue';

const products = ref(null);
const picklistProducts = ref(null);
const orderlistProducts = ref(null);
const options = ref(['list', 'grid']);
const layout = ref('list');

onMounted(() => {
  ProductService.getProductsSmall().then((data) => {
    products.value = data.slice(0, 6);
    picklistProducts.value = [data, []];
    orderlistProducts.value = data;
  });
});

function getSeverity(product) {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warning';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
}
</script>

<template>
  <div class="fb-flex fb-flex-col">
    <div class="card">
      <div class="fb-font-semibold fb-text-xl">DataView</div>
      <DataView :value="products" :layout="layout">
        <template #header>
          <div class="fb-flex fb-justify-end">
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </SelectButton>
          </div>
        </template>

        <template #list="slotProps">
          <div class="fb-flex fb-flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div class="fb-flex fb-flex-col sm:fb-flex-row sm:fb-items-center fb-p-6 fb-gap-4" :class="{ 'border-t border-surface': index !== 0 }">
                <div class="md:fb-w-40 fb-relative">
                  <img
                    class="fb-block xl:fb-block fb-mx-auto fb-rounded fb-w-full"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                    :alt="item.name"
                  />
                  <Tag
                    :value="item.inventoryStatus"
                    :severity="getSeverity(item)"
                    class="fb-absolute dark:!fb-bg-surface-900"
                    style="left: 4px; top: 4px"
                  ></Tag>
                </div>
                <div class="fb-flex fb-flex-col md:fb-flex-row fb-justify-between md:fb-items-center fb-flex-1 fb-gap-6">
                  <div class="fb-flex fb-flex-row md:fb-flex-col fb-justify-between fb-items-start fb-gap-2">
                    <div>
                      <span class="fb-font-medium fb-text-surface-500 dark:fb-text-surface-400 fb-text-sm">{{ item.category }}</span>
                      <div class="fb-text-lg fb-font-medium fb-mt-2">{{ item.name }}</div>
                    </div>
                    <div class="fb-bg-surface-100 fb-p-1" style="border-radius: 30px">
                      <div
                        class="fb-bg-surface-0 fb-flex fb-items-center fb-gap-2 fb-justify-center fb-py-1 fb-px-2"
                        style="
                          border-radius: 30px;
                          box-shadow:
                            0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                            0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                        "
                      >
                        <span class="fb-text-surface-900 fb-font-medium fb-text-sm">{{ item.rating }}</span>
                        <i class="pi pi-star-fill fb-text-yellow-500"></i>
                      </div>
                    </div>
                  </div>
                  <div class="fb-flex fb-flex-col md:fb-items-end fb-gap-8">
                    <span class="fb-text-xl fb-font-semibold">${{ item.price }}</span>
                    <div class="fb-flex fb-flex-row-reverse md:fb-flex-row fb-gap-2">
                      <Button icon="pi pi-heart" outlined></Button>
                      <Button
                        icon="pi pi-shopping-cart"
                        label="Buy Now"
                        :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                        class="fb-flex-auto md:fb-flex-initial fb-whitespace-nowrap"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="fb-grid fb-grid-cols-12 fb-gap-4">
            <div v-for="(item, index) in slotProps.items" :key="index" class="fb-col-span-12 sm:fb-col-span-6 lg:fb-col-span-4 fb-p-2">
              <div class="fb-p-6 fb-border fb-border-surface-200 dark:fb-border-surface-700 fb-bg-surface-0 dark:fb-bg-surface-900 fb-rounded fb-flex fb-flex-col">
                <div class="fb-bg-surface-50 fb-flex fb-justify-center fb-rounded fb-p-4">
                  <div class="fb-relative fb-mx-auto">
                    <img
                      class="fb-rounded fb-w-full"
                      :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                      :alt="item.name"
                      style="max-width: 300px"
                    />
                    <Tag
                      :value="item.inventoryStatus"
                      :severity="getSeverity(item)"
                      class="fb-absolute dark:!fb-bg-surface-900"
                      style="left: 4px; top: 4px"
                    ></Tag>
                  </div>
                </div>
                <div class="fb-pt-6">
                  <div class="fb-flex fb-flex-row fb-justify-between fb-items-start fb-gap-2">
                    <div>
                      <span class="fb-font-medium fb-text-surface-500 dark:fb-text-surface-400 fb-text-sm">{{ item.category }}</span>
                      <div class="fb-text-lg fb-font-medium fb-mt-1">{{ item.name }}</div>
                    </div>
                    <div class="fb-bg-surface-100 fb-p-1" style="border-radius: 30px">
                      <div
                        class="fb-bg-surface-0 fb-flex fb-items-center fb-gap-2 fb-justify-center fb-py-1 fb-px-2"
                        style="
                          border-radius: 30px;
                          box-shadow:
                            0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                            0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                        "
                      >
                        <span class="fb-text-surface-900 fb-font-medium fb-text-sm">{{ item.rating }}</span>
                        <i class="pi pi-star-fill fb-text-yellow-500"></i>
                      </div>
                    </div>
                  </div>
                  <div class="fb-flex fb-flex-col fb-gap-6 fb-mt-6">
                    <span class="fb-text-2xl fb-font-semibold">${{ item.price }}</span>
                    <div class="fb-flex fb-gap-2">
                      <Button
                        icon="pi pi-shopping-cart"
                        label="Buy Now"
                        :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                        class="fb-flex-auto fb-whitespace-nowrap"
                      ></Button>
                      <Button icon="pi pi-heart" outlined></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>

    <div class="fb-flex fb-flex-col lg:fb-flex-row fb-gap-8">
      <div class="lg:fb-w-2/3">
        <div class="card">
          <div class="fb-font-semibold fb-text-xl fb-mb-4">PickList</div>
          <PickList v-model="picklistProducts" breakpoint="1400px" dataKey="id">
            <template #option="{ option }">
              {{ option.name }}
            </template>
          </PickList>
        </div>
      </div>

      <div class="lg:fb-w-1/3">
        <div class="card">
          <div class="fb-font-semibold fb-text-xl fb-mb-4">OrderList</div>
          <OrderList v-model="orderlistProducts" breakpoint="1400px" dataKey="id" pt:pcList:root="w-full">
            <template #option="{ option }">
              {{ option.name }}
            </template>
          </OrderList>
        </div>
      </div>
    </div>
  </div>
</template>