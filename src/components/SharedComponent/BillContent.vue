<script setup>
import { formatDate, formatCurrency, roundNumber } from '@/common/utils/common';

const props = defineProps({
  sale: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

/**
 * Kiểm tra xem món ăn/topping có đang được giảm giá hay không
 */
const shouldShowDiscount = (item) => {
  if (!item.price_org || !item.quantity) return false;
  return +(Math.round(item.price_org * item.quantity + 'e+2') + 'e-2') > item.amount;
};

/**
 * Tính tổng giá trị gốc của món ăn (trước khi giảm giá)
 */
const getDiscountPrice = (item) => {
  return (item.price_org || 0) * (item.quantity || 0);
};

/**
 * Tính tổng tiền gốc bao gồm cả thuế VAT
 */
const getOriginVat = (item) => {
  return (
    (item.amount_origin || 0) -
    (item.discount_extra_amount || 0) +
    (item.partner_marketing_amount || 0) -
    (item.amount_discount_detail || 0) -
    (item.amount_discount_price || 0) +
    (item.service_charge_amount || 0) +
    (item.vat_amount || 0)
  );
};

/**
 * Phân tách và gom nhóm tiền thuế theo từng mức thuế suất
 */
const getVatAmountDetail = (sale) => {
  if (![3, 4].includes(sale?.extra_data?.vat_option) || !sale.vat_amount) return false;

  const vatRateAmountMap = {};
  function assignVat(target) {
    if (target.vat_tax_amount) {
      vatRateAmountMap[target.vat_tax_rate] =
        (vatRateAmountMap[target.vat_tax_rate] || 0) + target.vat_tax_amount;
    }
  }
  sale.sale_detail?.forEach((item) => {
    assignVat(item);
    if (item.toppings?.length) {
      item.toppings.forEach((topping) => {
        assignVat(topping);
        if (topping.sub_topping?.length) {
          topping.sub_topping.forEach(assignVat);
        }
      });
    }
  });

  return Object.entries(vatRateAmountMap);
};

/**
 * Xác định xem voucher có được tính là một phương thức giảm giá thanh toán hay không
 */
const isDiscountPaymentTovoucher = (sale) => {
  return (
    !(sale && sale.voucher_code && (sale.voucher_amount > 0 || sale.voucher_extra > 0)) ||
    (sale && sale.voucher_code && sale.voucher_amount_paid > 0)
  );
};

/**
 * Tính "Thành tiền" của hóa đơn
 */
const getSubTotal = (sale) => {
  return (
    (sale.amount_origin || 0) -
    (sale.amount_discount_detail || 0) -
    (sale.amount_discount_price || 0)
  );
};
</script>

<template>
  <div class="fb-overflow-hidden fb-flex fb-flex-col">
    <!-- Chi tiết items -->
    <div class="fb-p-4 fb-flex fb-flex-col">
      <template v-for="(sd, i) in sale.sale_detail" :key="sd.id_sale_detail || i">
        <div class="fb-flex fb-flex-col">
          <!-- Dòng món chính -->
          <div
            class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
          >
            <div class="fb-flex fb-flex-col">
              <div class="fb-text-gray-800 fb-font-medium fb-text-base">
                (x{{ roundNumber(sd.quantity) }}) {{ sd.item_name }}
              </div>
              <div
                v-if="sd.note"
                class="fb-text-sm fb-text-gray-500 fb-flex fb-items-center fb-gap-1 fb-ml-2 fb-mt-0.5"
              >
                <i class="far fa-edit"></i>
                {{ sd.note }}
              </div>
            </div>
            <div class="fb-flex fb-flex-col fb-items-end">
              <div class="fb-text-gray-800 fb-font-medium fb-text-base">
                {{ formatCurrency(sd.amount) }}
              </div>
              <div v-if="shouldShowDiscount(sd)" class="fb-text-sm fb-text-gray-400 fb-line-through">
                {{ formatCurrency(getDiscountPrice(sd)) }}
              </div>
            </div>
          </div>

          <!-- Toppings và Sub-toppings -->
          <template v-for="topping in sd.toppings" :key="topping.id_sale_detail">
            <!-- Dòng Topping -->
            <div
              class="fb-flex fb-justify-between fb-items-start fb-ml-4 fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
            >
              <div class="fb-text-base fb-text-gray-600">
                - (x{{ roundNumber(topping.quantity) }}) {{ topping.item_name }}
              </div>
              <div class="fb-text-base fb-text-gray-600 fb-flex fb-flex-col fb-items-end">
                <div>{{ formatCurrency(topping.amount) }}</div>
                <div
                  v-if="shouldShowDiscount(topping)"
                  class="fb-text-sm fb-text-gray-400 fb-line-through"
                >
                  {{ formatCurrency(getDiscountPrice(topping)) }}
                </div>
              </div>
            </div>

            <!-- Dòng Sub-topping -->
            <div
              v-for="subTopping in topping.sub_topping"
              :key="subTopping.id_sale_detail"
              class="fb-flex fb-justify-between fb-items-start fb-ml-8 fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
            >
              <div class="fb-text-sm fb-text-gray-500">
                + (x{{ roundNumber(subTopping.quantity, 5) }}) {{ subTopping.item_name }}
              </div>
              <div class="fb-text-sm fb-text-gray-500 fb-flex fb-flex-col fb-items-end">
                <div>{{ formatCurrency(subTopping.amount) }}</div>
                <div
                  v-if="shouldShowDiscount(subTopping)"
                  class="fb-text-sm fb-text-gray-400 fb-line-through"
                >
                  {{ formatCurrency(getDiscountPrice(subTopping)) }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- Border phân cách nhẹ giữa các món chính -->
        <div
          v-if="i < sale.sale_detail.length - 1"
          class="fb-border-t fb-border-gray-100 fb-my-1"
        ></div>
      </template>
    </div>

    <div class="fb-border-t fb-border-gray-200"></div>

    <!-- Tổng tiền -->
    <div class="fb-p-4 fb-flex fb-flex-col fb-gap-1">
      <div
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800 fb-text-base">Thành tiền</div>
        <div class="fb-text-gray-800 fb-text-base">
          {{ formatCurrency(getSubTotal(sale)) }}
        </div>
      </div>

      <div
        v-if="sale.discount_extra_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800 fb-text-base">
          Chiết khấu thanh toán
          <span v-if="sale.discount_extra_name">({{ sale.discount_extra_name }})</span>
        </div>
        <div class="fb-text-gray-800 fb-text-base">- {{ formatCurrency(sale.discount_extra_amount) }}</div>
      </div>

      <div
        v-if="sale.partner_marketing_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800 fb-text-base">Khuyến mãi đối tác</div>
        <div class="fb-text-gray-800 fb-text-base">
          {{ formatCurrency(sale.partner_marketing_amount) }}
        </div>
      </div>

      <div
        v-if="sale.service_charge_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">
          Phí dịch vụ
          <span v-if="sale.service_charge_name">({{ sale.service_charge_name }})</span>
        </div>
        <div class="fb-text-gray-800">
          {{ formatCurrency(sale.service_charge_amount) }}
        </div>
      </div>

      <template v-if="sale.extra_data && sale.extra_data.vat_option != 5">
        <div
          v-if="sale.vat_amount"
          class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
        >
          <div class="fb-text-gray-800">VAT</div>
          <div class="fb-text-gray-800">{{ formatCurrency(sale.vat_amount) }}</div>
        </div>
        <div
          v-for="([vatRate, vatAmount], idxVat) in getVatAmountDetail(sale)"
          :key="vatRate"
          class="fb-flex fb-justify-between fb-items-start fb-pl-4 fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
        >
          <div class="fb-text-gray-500 fb-italic fb-text-sm">{{ roundNumber(vatRate * 100) }}%</div>
          <div class="fb-text-gray-500 fb-italic fb-text-sm">
            {{ formatCurrency(vatAmount) }}
          </div>
        </div>
      </template>
      <div
        v-else
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Tiền giảm thuế VAT</div>
        <div class="fb-text-gray-800">{{ formatCurrency(sale.discount_vat_amount) }}</div>
      </div>

      <div
        v-if="sale.vat_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-font-bold fb-text-gray-800">Cộng tiền (có thuế VAT)</div>
        <div class="fb-font-bold fb-text-gray-800">
          {{ formatCurrency(getOriginVat(sale)) }}
        </div>
      </div>

      <div
        v-if="sale.commission_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Hoa hồng</div>
        <div class="fb-text-gray-800">-{{ formatCurrency(sale.commission_amount) }}</div>
      </div>

      <div
        v-if="sale.ship_fee_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Phí giao hàng</div>
        <div class="fb-text-gray-800">{{ formatCurrency(sale.ship_fee_amount) }}</div>
      </div>
      <div
        v-if="sale.ship_fee_amount == 0 && sale.extra_data && sale.extra_data.ship_fee > 0"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Phí giao hàng đối tác</div>
        <div class="fb-text-gray-800">{{ formatCurrency(sale.extra_data.ship_fee) }}</div>
      </div>

      <div
        v-if="sale.deduct_tax_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">
          Thuế khấu trừ
          <span v-if="sale.deduct_tax_rate">{{ sale.deduct_tax_rate * 100 }}%</span>
        </div>
        <div class="fb-text-gray-800">- {{ formatCurrency(sale.deduct_tax_amount || 0) }}</div>
      </div>

      <div
        v-if="sale.voucher_name && sale.voucher_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Voucher ({{ sale.voucher_name }})</div>
        <div class="fb-text-gray-800">
          -{{
            formatCurrency(isDiscountPaymentTovoucher(sale) ? sale.voucher_amount_paid : 0)
          }}
        </div>
      </div>

      <div
        v-if="sale.extra_data && sale.extra_data.voucher_input"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Số lượng voucher</div>
        <div class="fb-flex fb-flex-col fb-items-end">
          <div
            v-for="(vText, vIdx) in sale.extra_data.voucher_input.split('\n').filter(Boolean)"
            :key="vIdx"
            class="fb-text-gray-600 fb-text-base"
          >
            {{ vText }}
          </div>
        </div>
      </div>

      <div
        v-if="sale.extra_data && sale.extra_data.deposit_amount"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-800">Đặt cọc</div>
        <div class="fb-text-gray-800">
          {{ formatCurrency(sale.extra_data.deposit_amount) }}
        </div>
      </div>

      <div
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors fb-font-bold fb-text-base fb-text-blue-600"
      >
        <div>Tổng tiền</div>
        <div>{{ formatCurrency(sale.total_amount) }}</div>
      </div>

      <div
        v-if="sale.extra_data && sale.extra_data.peo_count"
        class="fb-flex fb-justify-between fb-items-start fb-p-1 fb-rounded-md hover:fb-bg-gray-100 fb-transition-colors"
      >
        <div class="fb-text-gray-600 fb-text-sm">Số lượng khách</div>
        <div class="fb-text-gray-600 fb-text-sm">{{ sale.extra_data.peo_count }}</div>
      </div>
    </div>

    <div class="fb-border-t fb-border-gray-200"></div>

    <!-- Thanh toán và Ghi chú -->
    <div class="fb-p-4 fb-flex fb-flex-col fb-gap-3">
      <div class="fb-flex fb-flex-col fb-gap-2">
        <div class="fb-font-bold fb-text-gray-800">Phương thức thanh toán:</div>
        <div
          v-for="(method, i) in sale.sale_payment_method"
          :key="i"
          class="fb-flex fb-flex-col fb-gap-1"
        >
          <div class="fb-flex fb-justify-between fb-items-center">
            <div class="fb-text-gray-800">
              - {{ method.payment_method_name }}
              <span v-if="method.trace_no">({{ method.trace_no }})</span>
            </div>
            <div class="fb-text-gray-800">{{ formatCurrency(method.amount) }}</div>
          </div>
          <div v-if="method.tran_id_of_partner" class="fb-text-xs fb-text-gray-500 fb-ml-4">
            Mã tham chiếu đối tác: {{ method.tran_id_of_partner }}
          </div>
          <div
            v-if="method.payment_fee_type === 1 && method.payment_fee_amount"
            class="fb-flex fb-justify-between fb-items-center fb-ml-4"
          >
            <div class="fb-text-xs fb-text-gray-500">+ Phí thanh toán</div>
            <div class="fb-text-xs fb-text-gray-500">
              {{ formatCurrency(method.payment_fee_amount) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="sale.voucher_code" class="fb-text-sm fb-text-gray-800">
        <span class="fb-font-semibold">Mã voucher:</span>
        {{ sale.voucher_code }}
      </div>

      <div v-if="sale.sale_note" class="fb-text-sm fb-text-gray-800">
        <span class="fb-font-semibold">Ghi chú:</span>
        {{ sale.sale_note }}
      </div>

      <div
        v-if="sale.extra_data && (sale.extra_data.customer_name || sale.extra_data.customer_phone)"
        class="fb-mt-2 fb-p-3 fb-bg-blue-50 fb-rounded-lg fb-flex fb-flex-col fb-gap-1"
      >
        <div class="fb-font-semibold fb-text-blue-700 fb-text-sm mb-1">Thông tin khách hàng</div>
        <div v-if="sale.extra_data.customer_name" class="fb-flex fb-justify-between fb-text-sm">
          <div class="fb-text-blue-600">Tên khách hàng:</div>
          <div class="fb-text-blue-800">{{ sale.extra_data.customer_name }}</div>
        </div>
        <div v-if="sale.extra_data.customer_phone" class="fb-flex fb-justify-between fb-text-sm">
          <div class="fb-text-blue-600">Số điện thoại:</div>
          <div class="fb-text-blue-800">{{ sale.extra_data.customer_phone }}</div>
        </div>
        <div v-if="sale.extra_data.customer_address" class="fb-flex fb-justify-between fb-text-sm">
          <div class="fb-text-blue-600">Địa chỉ:</div>
          <div class="fb-text-blue-800">{{ sale.extra_data.customer_address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
