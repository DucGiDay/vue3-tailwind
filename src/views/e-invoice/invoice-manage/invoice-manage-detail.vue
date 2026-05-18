<template>
  <DetailView title="Điều chỉnh tăng" :handleBack="handleBack">
    <template #header-actions>
      <Button label="Lưu" severity="primary" size="small" />
    </template>

    <div class="fb-px-10 fb-pb-10">
      <!-- Card 1: Thông tin đơn vị phát hành -->
      <div
        class="card !fb-p-0 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-mb-6 fb-overflow-hidden"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-bg-gray-100 fb-px-6 fb-py-3 fb-font-semibold fb-text-gray-700 fb-uppercase">
          Thông tin đơn vị phát hành
        </div>
        <div class="fb-p-4">
          <div class="fb-text-center fb-font-medium fb-mb-6 fb-text-lg">
            Hoá đơn điện tử giá trị gia tăng
          </div>

          <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-12 fb-gap-x-6 fb-gap-y-4">
            <!-- Left side -->
            <div class="md:fb-col-span-8 fb-flex fb-flex-col fb-gap-4">
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Mã số thuế
                </label>
                <div class="fb-w-full md:fb-w-3/4 fb-flex fb-gap-1">
                  <!-- Giả lập input group MST -->
                  <InputText size="small" value="0" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="1" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="0" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="4" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="7" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="8" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="8" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="4" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="7" class="!fb-w-8 !fb-text-center" readonly />
                  <span class="fb-mx-1 fb-self-center">-</span>
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                  <InputText size="small" value="9" class="!fb-w-8 !fb-text-center" readonly />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Tên đơn vị
                </label>
                <div class="fb-w-full md:fb-w-3/4">
                  <InputText
                    size="small"
                    class="fb-w-full"
                    value="CÔNG TY CỔ PHẦN IPOS.VN - TEST HÓA ĐƠN"
                    readonly
                  />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/4 fb-text-sm fb-font-medium fb-text-gray-700">
                  Địa chỉ
                </label>
                <div class="fb-w-full md:fb-w-3/4">
                  <InputText
                    size="small"
                    class="fb-w-full"
                    value="Tòa Tháp VP Hòa Bình, 106 Hoàng Quốc Việt, Phường Nghĩa Đô, Thành phố Hà Nội, Việt Nam"
                    readonly
                  />
                </div>
              </div>
            </div>

            <!-- Right side -->
            <div class="md:fb-col-span-4 fb-flex fb-flex-col fb-gap-4">
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                  Mẫu số
                </label>
                <div class="fb-w-full md:fb-w-2/3">
                  <InputText size="small" class="fb-w-full fb-bg-gray-100" value="1" readonly />
                </div>
              </div>
              <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-2">
                <label class="fb-w-full md:fb-w-1/3 fb-text-sm fb-font-medium fb-text-gray-700">
                  Ký hiệu
                </label>
                <div class="fb-w-full md:fb-w-2/3">
                  <InputText
                    size="small"
                    class="fb-w-full fb-bg-gray-100"
                    value="C26MDT"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Thông tin khách hàng & hóa đơn -->
      <div
        class="card !fb-p-4 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-mb-6"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-12 fb-gap-x-10 fb-gap-y-4">
          <!-- Hàng 1 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mã khách hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.customer_code" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Ngày hóa đơn</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.vat_invoice_date" />
          </div>

          <!-- Hàng 2 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mã số thuế</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerTaxCode" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Họ tên người mua</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerDisplayName" />
          </div>

          <!-- Hàng 3 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Căn cước công dân</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerIdentityCard" />
          </div>
          <div class="md:fb-col-span-6 hidden md:fb-block"></div>

          <!-- Hàng 4 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mail khách hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerEmail" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mail CC</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.mail_cc" />
          </div>

          <!-- Hàng 5 - Full Width -->
          <div
            class="md:fb-col-span-12 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center fb-mt-4"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Đơn vị mua</label>
            <InputText
              size="small"
              class="fb-w-full"
              v-model="formInfo.extra_sale.inv_buyerLegalName"
            />
          </div>

          <!-- Hàng 6 - Full Width -->
          <div
            class="md:fb-col-span-12 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center fb-mb-4"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Địa chỉ</label>
            <InputText
              size="small"
              class="fb-w-full"
              v-model="formInfo.extra_sale.inv_buyerAddressLine"
            />
          </div>

          <!-- Hàng 7 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Số chứng từ</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.tran_no" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mã QHNS</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.budget_unit_code" />
          </div>

          <!-- Hàng 8 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Hộ chiếu</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.passport_number" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Mã cửa hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.fb_store_id" />
          </div>

          <!-- Hàng 9 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Tên cửa hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.store_name" />
          </div>
          <div class="md:fb-col-span-6 hidden md:fb-block"></div>

          <!-- Hàng 10 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">
              Hình thức thanh toán
              <span class="fb-text-error">*</span>
            </label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.payment_method_name" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">
              Tiêu chí điều chỉnh
              <span class="fb-text-error">*</span>
            </label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.adjustment_criteria" />
          </div>

          <!-- Hàng 11 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Số tài khoản ngân hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerBankAccount" />
          </div>
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Tên ngân hàng</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.inv_buyerBankName" />
          </div>

          <!-- Hàng 12 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Biên bản đính kèm</label>
            <InputText
              size="small"
              class="fb-w-full"
              v-model="formInfo.attachment_file"
              placeholder="Nhấn chuột vào đây để đính kèm biên bản (doc, docx, pdf)"
            />
          </div>
          <div class="md:fb-col-span-6 hidden md:fb-block"></div>

          <!-- Hàng 13 -->
          <div
            class="md:fb-col-span-6 fb-grid md:fb-grid-cols-[170px_1fr] fb-gap-2 md:fb-items-center"
          >
            <label class="fb-text-sm fb-font-medium fb-text-gray-700">Ghi chú</label>
            <InputText size="small" class="fb-w-full" v-model="formInfo.extra_sale.note" />
          </div>
          <div class="md:fb-col-span-6 fb-flex fb-items-center fb-justify-end fb-gap-6">
            <div class="fb-flex fb-items-center fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">Hỗ trợ tính toán</label>
              <InputText size="small" class="fb-w-[100px]" v-model="formInfo.calculation_support" />
            </div>
            <div class="fb-flex fb-items-center fb-gap-2">
              <label class="fb-text-sm fb-font-medium fb-text-gray-700">
                Hỗ trợ chọn thuế suất
              </label>
              <InputText size="small" class="fb-w-[60px]" v-model="formInfo.tax_rate_support" />
            </div>
          </div>
        </div>

        <div class="fb-mt-4 fb-text-center fb-text-sm fb-font-medium fb-text-gray-700">
          (Điều chỉnh giảm cho hóa đơn mẫu số 1, ký hiệu C26MDT, số 00000193, ngày 12 tháng 5 năm
          2026)
        </div>
      </div>

      <!-- Bảng 1: Hàng hóa dịch vụ -->
      <FbTable
        class="fb-mb-6"
        :items="itemsTable1"
        :columns="TABLE_1_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
      >
        <template #header>
          <div class="fb-flex fb-justify-between fb-items-center">
            <div class="fb-font-medium fb-text-gray-700">Chi tiết hàng hóa, dịch vụ</div>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
            />
          </div>
        </template>
        <template #action>
          <Button icon="pi pi-trash" severity="danger" text rounded />
        </template>
      </FbTable>

      <!-- Bảng 2: Các loại phí -->
      <FbTable
        class="fb-mb-6"
        :items="itemsTable2"
        :columns="TABLE_2_COLUMNS"
        :showGridlines="true"
        :hideIndexRow="true"
      >
        <template #header>
          <div class="fb-flex fb-justify-between fb-items-center">
            <div class="fb-font-medium fb-text-gray-700">Chi tiết các loại phí</div>
            <Button
              label="Thêm dòng"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              outlined
            />
          </div>
        </template>
        <template #action>
          <Button icon="pi pi-trash" severity="danger" text rounded />
        </template>
      </FbTable>

      <!-- Form nhập cuối cùng -->
      <div
        class="card !fb-p-4 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-text-sm fb-text-gray-700"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <!-- Top Row -->
        <div class="fb-flex fb-items-center fb-gap-8 fb-mb-8">
          <div class="fb-flex fb-items-center fb-gap-4">
            <span class="fb-font-medium">Loại tiền</span>
            <InputText size="small" class="fb-w-[100px]" value="VND" />
          </div>
          <div class="fb-flex fb-items-center fb-gap-4">
            <span class="fb-font-medium">Tỷ giá</span>
            <InputText size="small" class="fb-w-[150px]" />
          </div>
        </div>

        <!-- 2 Columns for Taxes -->
        <div class="fb-grid fb-grid-cols-1 md:fb-grid-cols-2 fb-gap-x-10 fb-gap-y-4 fb-mb-8">
          <!-- Left Column -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền không kê khai chịu thuế:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền không chịu thuế:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 0%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="300,000" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 5%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 8%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền chịu thuế suất 10%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center fb-mt-4">
              <span class="fb-font-semibold">
                Tổng tiền trước thuế
                <br />
                <span class="fb-italic fb-font-normal fb-text-gray-500">(Total)</span>
              </span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="300,000" readonly />
            </div>
          </div>

          <!-- Right Column -->
          <div class="fb-flex fb-flex-col fb-gap-4">
            <!-- 2 dummy rows to align with the left column -->
            <div class="fb-invisible fb-hidden md:fb-flex fb-justify-between fb-items-center">
              <span>Ẩn</span>
              <InputText size="small" class="fb-w-[150px]" readonly />
            </div>
            <div class="fb-invisible fb-hidden md:fb-flex fb-justify-between fb-items-center">
              <span>Ẩn</span>
              <InputText size="small" class="fb-w-[150px]" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 0%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 5%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 8%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
            <div class="fb-flex fb-justify-between fb-items-center">
              <span>Tổng tiền thuế suất 10%:</span>
              <InputText size="small" class="fb-w-[150px] fb-text-right" value="0" readonly />
            </div>
          </div>
        </div>

        <!-- Tổng tiền dịch vụ -->
        <div class="fb-flex fb-justify-end fb-items-center fb-gap-4 fb-mb-8">
          <span class="fb-font-semibold">
            Tổng tiền dịch vụ
            <span class="fb-italic fb-font-normal fb-text-gray-500">(Amount)</span>
          </span>
          <InputText
            size="small"
            class="fb-w-[200px] fb-text-right fb-bg-gray-100 !fb-border-transparent"
            value="300,000"
            readonly
          />
        </div>

        <!-- Số tiền viết bằng chữ -->
        <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-4">
          <span class="fb-font-semibold fb-whitespace-nowrap">
            Số tiền viết bằng chữ
            <span class="fb-italic fb-font-normal fb-text-gray-500">(Amount in word)</span>
          </span>
          <div class="fb-w-full">
            <InputText
              size="small"
              class="fb-w-full fb-bg-gray-100 !fb-border-transparent"
              value="Ba trăm nghìn đồng chẵn"
              readonly
            />
          </div>
        </div>
      </div>
    </div>
  </DetailView>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DetailView from '@/components/SharedComponent/views/DetailView.vue';
import { useGlobalStore } from '@/stores/global.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const saleData = ref({});
const formInfo = ref({
  extra_sale: {},
});

const handleBack = () => {
  router.push('/e-invoice/invoice-manage');
};

onMounted(async () => {
  try {
    const payload = {
      company_uid: globalStore?.currentUser?.company_uid,
      brand_uid: globalStore?.brandUid,
      tran_id: route.query?.tran_id,
      store_uid: route.query?.store_uid,
    };
    const res = await invoiceService.getSaleByTranId(payload);
    saleData.value = res?.data || {};
      const data = res.data;
      formInfo.value = {
        ...data,
        extra_sale: data.extra_sale || {},
      };
      
      // Default values for fields not in API
      formInfo.value.calculation_support = 'Mặc định';
      formInfo.value.tax_rate_support = '0%';
      formInfo.value.adjustment_criteria = 'Điều chỉnh số lượng';
      formInfo.value.payment_method_name = data.sale_payment_method?.[0]?.payment_method_name || 'Thanh toán tiền mặt';
    
    console.log('getSaleByTranId response:', res);
  } catch (error) {
    console.error('getSaleByTranId error:', error);
  }
});

const itemsTable1 = ref([
  // mock data
]);

const itemsTable2 = ref([
  // mock data
]);

const TABLE_1_COLUMNS = [
  { field: 'action', header: 'Xóa', width: '60px', align: 'center', type: 'custom' },
  { field: 'property', header: 'Tính chất' },
  { field: 'stt', header: 'STT', width: '60px', align: 'center' },
  { field: 'code', header: 'Mã hàng hóa' },
  { field: 'name', header: 'Tên hàng hóa, dịch vụ' },
  { field: 'unit', header: 'ĐVT (Unit)' },
  { field: 'quantity', header: 'Số lượng', align: 'right' },
  { field: 'price', header: 'Đơn giá', align: 'right' },
  { field: 'total_before_discount', header: 'Tiền trước chiết khấu', align: 'right' },
  { field: 'discount_rate', header: 'Tỷ lệ chiết khấu', align: 'right' },
  { field: 'discount_amount', header: 'Số tiền chiết khấu', align: 'right' },
  { field: 'total_amount', header: 'Thành tiền (Total) VNĐ', align: 'right' },
  { field: 'vat_rate', header: 'Thuế suất GTGT(%)', align: 'right' },
  { field: 'vat_amount', header: 'Thuế GTGT', align: 'right' },
  { field: 'total', header: 'Cộng', align: 'right' },
  { field: 'service_fee', header: 'Tiền phí dịch vụ', align: 'right' },
];

const TABLE_2_COLUMNS = [
  { field: 'action', header: 'Xóa', width: '60px', align: 'center', type: 'custom' },
  { field: 'stt', header: 'STT', width: '60px', align: 'center' },
  { field: 'fee_name', header: 'Tên loại phí' },
  { field: 'fee_amount', header: 'Tiền phí', align: 'right' },
];
</script>
