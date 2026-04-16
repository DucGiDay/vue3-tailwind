<template>
  <DetailView title="Tạo biên bản thỏa thuận" :handleBack="handleBack">
    <template #header-actions>
      <div class="fb-flex fb-items-center">
        <!-- <Button
          label="Test nhanh"
          raised
          size="small"
          severity="secondary"
          class="fb-mr-2"
          @click="fillTestData"
        /> -->
        <Button label="Lưu lại" :loading="loading" raised size="small" @click="handleSave" />
      </div>
    </template>
    <FbLoading :show="loading" :fullScreen="true" />
    <div class="md:fb-px-10">
      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-w-full"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-flex fb-flex-col fb-gap-4">
          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-52 fb-text-sm fb-font-medium fb-text-gray-700">
              Mẫu số
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.origin_serial"
                class="fb-w-full"
                placeholder="Nhập mẫu số hóa đơn gốc"
                size="small"
                :invalid="!!error['origin_serial']"
                @input="delete error['origin_serial']"
              />
              <Message v-if="error['origin_serial']" severity="error" size="small" variant="simple">
                {{ error['origin_serial'] }}
              </Message>
            </div>
          </div>

          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-52 fb-text-sm fb-font-medium fb-text-gray-700">
              Ký hiệu hóa đơn gốc
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.origin_pattern"
                class="fb-w-full"
                placeholder="Nhập ký hiệu hóa đơn gốc"
                size="small"
                :invalid="!!error['origin_pattern']"
                @input="delete error['origin_pattern']"
              />
              <Message
                v-if="error['origin_pattern']"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ error['origin_pattern'] }}
              </Message>
            </div>
          </div>

          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-52 fb-text-sm fb-font-medium fb-text-gray-700">
              Số HĐ gốc
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.invoice_number_origin"
                class="fb-w-full"
                placeholder="Nhập số HĐ gốc"
                size="small"
                :invalid="!!error['invoice_number_origin']"
                @input="delete error['invoice_number_origin']"
              />
              <Message
                v-if="error['invoice_number_origin']"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ error['invoice_number_origin'] }}
              </Message>
            </div>
          </div>

          <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
            <label class="fb-w-full md:fb-w-52 fb-text-sm fb-font-medium fb-text-gray-700">
              Số HĐ điều chỉnh
              <span class="fb-text-error">*</span>
            </label>
            <div class="fb-flex-1">
              <InputText
                v-model="agreement.invoice_number_replace"
                class="fb-w-full"
                placeholder="Nhập số HĐ điều chỉnh"
                size="small"
                :invalid="!!error['invoice_number_replace']"
                @input="delete error['invoice_number_replace']"
              />
              <Message
                v-if="error['invoice_number_replace']"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ error['invoice_number_replace'] }}
              </Message>
            </div>
          </div>
        </div>
      </div>

      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-w-full fb-mt-6"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <div class="fb-grid fb-grid-cols-1 lg:fb-grid-cols-2 fb-gap-6">
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Số biên bản
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.record_invoice_number"
                  class="fb-w-full"
                  placeholder="Nhập số biên bản"
                  size="small"
                  :invalid="!!error['record_invoice_number']"
                  @input="delete error['record_invoice_number']"
                />
                <Message
                  v-if="error['record_invoice_number']"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ error['record_invoice_number'] }}
                </Message>
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Ngày biên bản
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-flex-1">
                <DatePicker
                  v-model="agreement.record_invoice_date"
                  class="fb-w-full"
                  placeholder="Chọn ngày biên bản"
                  size="small"
                  fluid
                  dateFormat="dd/mm/yy"
                  :invalid="!!error['record_invoice_date']"
                  @update:modelValue="delete error['record_invoice_date']"
                />
                <Message
                  v-if="error['record_invoice_date']"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ error['record_invoice_date'] }}
                </Message>
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Mail khách hàng
                <span class="fb-text-error">*</span>
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.cus_email"
                  class="fb-w-full"
                  placeholder="Nhập email khách hàng"
                  size="small"
                  :invalid="!!error['extra_data.cus_email']"
                  @input="delete error['extra_data.cus_email']"
                />
                <Message
                  v-if="error['extra_data.cus_email']"
                  severity="error"
                  size="small"
                  variant="simple"
                >
                  {{ error['extra_data.cus_email'] }}
                </Message>
              </div>
            </div>
          </div>

          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Đơn vị mua
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.cus_name"
                  class="fb-w-full"
                  placeholder="Nhập đơn vị mua"
                  size="small"
                />
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Mã số thuế
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.cus_tax_code"
                  class="fb-w-full"
                  placeholder="Nhập mã số thuế"
                  size="small"
                />
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Địa chỉ
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.cus_address"
                  class="fb-w-full"
                  placeholder="Nhập địa chỉ"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="card !fb-p-6 !fb-rounded-2xl !fb-border !fb-border-gray-300 fb-w-full fb-mt-6"
        style="box-shadow: 0 0.5px 2px 0 rgba(10, 13, 18, 0.03) !important"
      >
        <p class="fb-text-sm fb-text-gray-700 !fb-mb-4" v-if="agreement.invoice_number_origin">
          (Thay thế cho hóa đơn điện tử số
          <span class="fb-font-semibold">{{ agreement.invoice_number_origin }}</span>
          , mẫu số
          <span class="fb-font-semibold">{{ agreement.origin_serial }}</span>
          , ký hiệu
          <span class="fb-font-semibold">{{ agreement.origin_pattern }}</span>
          )
        </p>

        <div class="fb-grid fb-grid-cols-1 lg:fb-grid-cols-2 fb-gap-6 fb-mb-4">
          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Bên A
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.position_a"
                  class="fb-w-full"
                  placeholder="Nhập bên A"
                  size="small"
                />
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Bên B
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.position_b"
                  class="fb-w-full"
                  placeholder="Nhập bên B"
                  size="small"
                />
              </div>
            </div>
          </div>

          <div class="fb-flex fb-flex-col fb-gap-4">
            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Chức vụ
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.representative_of_party_a"
                  class="fb-w-full"
                  placeholder="Nhập chức vụ"
                  size="small"
                />
              </div>
            </div>

            <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-center fb-gap-0 md:fb-gap-4">
              <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700">
                Chức vụ
              </label>
              <div class="fb-flex-1">
                <InputText
                  v-model="agreement.extra_data.representative_of_party_b"
                  class="fb-w-full"
                  placeholder="Nhập chức vụ"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="fb-flex fb-flex-col md:fb-flex-row md:fb-items-start fb-gap-0 md:fb-gap-4">
          <label class="fb-w-full md:fb-w-40 fb-text-sm fb-font-medium fb-text-gray-700 fb-pt-2">
            Lý do thu hồi
            <span class="fb-text-error">*</span>
          </label>
          <div class="fb-flex-1">
            <Textarea
              v-model="agreement.extra_data.info.before"
              class="fb-w-full"
              rows="5"
              placeholder="Vui lòng nhập lý do"
              style="min-height: 110px"
            />
          </div>
        </div>
      </div>
    </div>
  </DetailView>
</template>

<script setup>
import { reactive, ref } from 'vue';
import DetailView from '@/components/PageComponent/views/DetailView.vue';
import { validateByFields } from '@/common/utils/validate';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/global.store';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';
import FbLoading from '@/components/Common/FbLoading.vue';

const router = useRouter();
const toast = useToast();
const globalStore = useGlobalStore();

const loading = ref(false);

const agreement = reactive({
  merged_tran_id_origin: '',
  merged_tran_id_replace: '',
  origin_serial: '', // Mẫu hóa đơn gốc
  origin_pattern: '', // Ký hiệu HĐ gốc
  replace_pattern: '', // Ký hiệu HĐ thay thế
  status: 0,
  invoice_number_origin: '', // Số HĐ gốc
  invoice_number_replace: '', // Số HĐ thay thế
  record_invoice_number: '', // Số biên bản
  record_invoice_date: null, // Ngày biên bản
  type: 1,
  fkey_record: '',
  extra_data: {
    replace_serial: '', // Mẫu hóa đơn thay thế
    cus_name: '', // Tên khách hàng (Đơn vị mua)
    cus_tax_code: '',
    cus_code: '',
    cus_email: '',
    cus_address: '',
    cus_phone: '',
    doc_address_create: '',
    position_a: '', // Bên A
    position_b: '', // Bên B
    representative_of_party_a: '', // Chức vụ
    representative_of_party_b: '', // Chức vụ
    info: {
      before: '', // Lý do thu hồi
      after: ''
    }
  }
});
const error = ref({});

const handleSave = async () => {
  error.value = validateByFields(agreement, [
    {
      id: 'origin_serial',
      rules: ['required']
    },
    {
      id: 'origin_pattern',
      rules: ['required']
    },
    {
      id: 'invoice_number_origin',
      rules: ['required']
    },
    {
      id: 'invoice_number_replace',
      rules: ['required']
    },
    {
      id: 'record_invoice_number',
      rules: ['required']
    },
    {
      id: 'record_invoice_date',
      rules: ['required']
    },
    {
      id: 'extra_data.cus_email',
      rules: ['required', 'email']
    }
  ]);

  if (Object.keys(error.value).length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Vui lòng kiểm tra lại các trường thông tin',
      life: 3000
    });
    return;
  }
  const payload = {
    ...agreement,
    record_invoice_date: agreement.record_invoice_date
      ? agreement.record_invoice_date.getTime()
      : null,
    brand_uid: globalStore?.brandUid,
    company_uid: globalStore?.currentUser?.company_uid
  };

  loading.value = true;
  await invoiceService
    .createAgreementProtocol(payload)
    .then((res) => {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Tạo biên bản thỏa thuận thành công',
        life: 3000
      });
      router.back();
    })
    .catch((err) => {
      console.error('Error:', err?.message);
      toast.add({
        severity: 'error',
        summary: 'Lỗi hệ thống',
        detail: err?.message || 'Không thể kết nối đến máy chủ',
        life: 3000
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleBack = () => {
  router.push({ path: '/e-invoice/agreement-protocol' });
};

const fillTestData = () => {
  const randomId = Math.floor(Math.random() * 10000);
  Object.assign(agreement, {
    merged_tran_id_origin: `ORIGIN-${randomId}`,
    merged_tran_id_replace: `REPLACE-${randomId}`,
    origin_serial: '1',
    origin_pattern: '1C23MAA',
    replace_pattern: '1C24TBB',
    status: 0,
    invoice_number_origin: `000${randomId}`.slice(-7),
    invoice_number_replace: `000${randomId + 1}`.slice(-7),
    record_invoice_number: `BB-${randomId}`,
    record_invoice_date: new Date(),
    type: 1,
    fkey_record: `FKEY-${randomId}`,
    extra_data: {
      replace_serial: '1',
      cus_name: 'Công ty TNHH Giải pháp iPOS.vn',
      cus_tax_code: '0105307524',
      cus_code: `KH-${randomId}`,
      cus_email: 'support@ipos.vn',
      cus_address: 'Tầng 11, Tòa nhà Hòa Bình, 106 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      cus_phone: '19004766',
      doc_address_create: 'Hà Nội',
      position_a: 'Nguyễn Xuân iPOS',
      position_b: 'Khách hàng Test',
      representative_of_party_a: 'Giám đốc',
      representative_of_party_b: 'Kế toán trưởng',
      info: {
        before: 'Thông tin hóa đơn cũ bị sai địa chỉ khách hàng',
        after: 'Cập nhật lại đúng địa chỉ theo đăng ký kinh doanh mới'
      }
    }
  });
};
</script>
